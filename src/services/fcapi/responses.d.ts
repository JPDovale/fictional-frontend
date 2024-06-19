type Errors = {
  details: Array<{
    code: string
    expected: string
    received: string
    path: string[]
    message: string
  }>
  name: string
}

export interface Response<T = unknown, K = unknown> {
  message?: string
  title?: string
  error?: string
  status: number
  data?: T
  errors?: Errors
  headers: K
}
