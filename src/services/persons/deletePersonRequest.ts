import { connection } from '../fcapi/axios'

interface DeletePersonReq {
  projectId: string
  personId: string
}

export async function deletePersonRequest({
  projectId,
  personId,
}: DeletePersonReq) {
  return connection.delete(`/projects/${projectId}/persons/${personId}`)
}
