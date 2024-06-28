import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Response } from './responses'
export const URL = process.env.NEXT_PUBLIC_API_URL

const apiConfigSSR: AxiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
})

apiConfigSSR.interceptors.response.use(
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

const connectionSSR = {
  setDefaultBearerToken: (token: string) => {
    apiConfigSSR.defaults.headers.Authorization = `Bearer ${token}`
  },

  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfigSSR.get<unknown, Response<T, AxiosHeaders>>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfigSSR.post<unknown, Response<T, AxiosHeaders>>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfigSSR.put<unknown, Response<T, AxiosHeaders>>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiConfigSSR.patch<unknown, Response<T, AxiosHeaders>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiConfigSSR.delete<unknown, Response<T, AxiosHeaders>>(url, config),
}

export { apiConfigSSR, connectionSSR }
