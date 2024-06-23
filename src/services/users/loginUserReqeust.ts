import { connection } from '../fcapi/axios'

interface LoginUserReq {
  email: string
  password: string
}

interface LoginUserRes {
  refreshToken: string
  accessToken: string
}

export async function loginUserRequest(data: LoginUserReq) {
  return connection.post<LoginUserRes>('/auth', data)
}
