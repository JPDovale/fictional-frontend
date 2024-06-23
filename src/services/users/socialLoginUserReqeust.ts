import { connection } from '../fcapi/axios'

interface SocialLoginUserReq {
  token: string
}

interface SocialLoginUserRes {
  refreshToken: string
  accessToken: string
}

export async function socialLoginUserRequest(data: SocialLoginUserReq) {
  return connection.post<SocialLoginUserRes>('/auth/social', data)
}
