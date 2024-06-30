import { connection } from '../fcapi/axios'

export async function deleteUserSessionsRequest() {
  return connection.delete('/auth')
}
