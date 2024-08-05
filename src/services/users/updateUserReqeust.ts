import { connection } from '../fcapi/axios'

interface UpdateUserReq {
  name?: string | null
  email?: string | null
  imageUrl?: string | null
}

export async function updateUserRequest(data: UpdateUserReq) {
  return connection.put('/users', data)
}
