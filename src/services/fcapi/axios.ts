import { jwtDecode } from 'jwt-decode'
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'
import { Response } from './responses'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import { CookiesKeys } from '@/hooks/useCookies'
import localstorageFunctions from '@/utils/localstorageFunctions'
import { LocalStorageKeys } from '@/configs/localstorageKeys'

export const URL = process.env.NEXT_PUBLIC_API_URL

const apiConfig: AxiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
})

const refreshConfig = axios.create({
  baseURL: URL,
  withCredentials: true,
})

apiConfig.interceptors.request.use(
  async (config) => {
    const waitFor = localstorageFunctions.Get<boolean>(
      LocalStorageKeys.WAIT_REFRESH,
    )

    async function wait(
      assertions: () => void,
      maxDuration = 2000,
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        let elapsedTime = 0

        const interval = setInterval(() => {
          elapsedTime += 200

          try {
            assertions()
            clearInterval(interval)
            resolve()
          } catch (err) {
            if (elapsedTime >= maxDuration) {
              localstorageFunctions.Set(LocalStorageKeys.WAIT_REFRESH, false)
              reject(err)
            }
          }
        }, 200)
      })
    }

    if (waitFor)
      await wait(() => {
        const waitFor = localstorageFunctions.Get<boolean>(
          LocalStorageKeys.WAIT_REFRESH,
        )

        if (waitFor) {
          console.log('waiting')
          throw new Error('wait')
        }
      })

    const cookies = parseCookies()
    const token = cookies[CookiesKeys.TOKEN]?.replaceAll('"', '')
    const refresh = cookies[CookiesKeys.REFRESH]?.replaceAll('"', '')

    if (refresh && token) {
      const decodedToken = jwtDecode(token)
      const currentDate = Date.now() / 1000

      if (decodedToken.exp && decodedToken.exp < currentDate) {
        try {
          localstorageFunctions.Set(LocalStorageKeys.WAIT_REFRESH, true)
          const response = await refreshConfig.post('/auth/refresh', {
            token: refresh,
          })

          if (response.status === 201) {
            config.headers.Authorization = `Bearer ${response.data.data.accessToken}`
            apiConfig.defaults.headers.Authorization = `Bearer ${response.data.data.accessToken}`

            const rawToken = JSON.stringify(response.data.data.accessToken)
            const rawRefresh = JSON.stringify(response.data.data.refreshToken)

            setCookie(null, CookiesKeys.TOKEN, rawToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/',
            })
            setCookie(null, CookiesKeys.REFRESH, rawRefresh, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/',
            })

            localstorageFunctions.Set(LocalStorageKeys.WAIT_REFRESH, false)
          }

          return config
        } catch (err) {
          localstorageFunctions.Set(LocalStorageKeys.WAIT_REFRESH, false)
          if (err instanceof AxiosError && err.response?.status === 401) {
            destroyCookie(null, CookiesKeys.TOKEN)
            destroyCookie(null, CookiesKeys.REFRESH)
          }
        }
      }
    }
    config.headers.Authorization = `Bearer ${token}`
    apiConfig.defaults.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error),
)

apiConfig.interceptors.response.use(
  (res) => {
    const { data: dataRes, ...restRes } = res
    const { data, ...restDataRes } = dataRes

    return Promise.resolve({
      ...restRes,
      data: {
        ...data,
        ...restDataRes,
      },
    })
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.resolve({
        ...error.response.data,
        status: error.response.status,
      })
    }

    const err = {
      message: 'Não foi possível se conectar com o servidor!',
      status: 500,
    }
    return Promise.resolve(err)
  },
)

const connection = {
  setDefaultBearerToken: (token: string) => {
    apiConfig.defaults.headers.Authorization = `Bearer ${token}`
  },

  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfig.get<unknown, Response<T, AxiosHeaders>>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.post<unknown, Response<T, AxiosHeaders>>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.put<unknown, Response<T, AxiosHeaders>>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfig.patch<unknown, Response<T, AxiosHeaders>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfig.delete<unknown, Response<T, AxiosHeaders>>(url, config),
}

export { apiConfig, connection }
