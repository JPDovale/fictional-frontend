'use client'
import { setCookie, parseCookies, destroyCookie } from 'nookies'

export enum CookiesKeys {
  TOKEN = '@FC:TOKEN',
  REFRESH = '@FC:REFRESH',
}

export function useCookies() {
  function get<T>(key: CookiesKeys): T | null {
    const cookies = parseCookies()

    if (!cookies[key]) return null

    const response = JSON.parse(cookies?.[key]) as T

    return response
  }

  function set(key: CookiesKeys, data: unknown) {
    const raw = JSON.stringify(data)
    setCookie(null, key, raw, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  }

  function remove(key: CookiesKeys) {
    destroyCookie(null, key)
  }

  return { get, set, remove }
}
