import { connection } from '../fcapi/axios'

export interface User {
  id: string
  name: string
  username: string
  skipLogin: boolean
  verified: boolean
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date | null
}

interface GetUserRes {
  user: User | null
}

export async function getUserRequest() {
  return connection.get<GetUserRes>('/users')
}
