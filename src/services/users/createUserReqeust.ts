import { connection } from '../fcapi/axios'

interface CreateUserReq {
  name: string
  email: string
  password: string
}

interface CreateUserRes {}

export async function createUserRequest(data: CreateUserReq) {
  return connection.post<CreateUserRes>('/users', data)
}
