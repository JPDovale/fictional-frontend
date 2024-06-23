import { connection } from '../fcapi/axios'

interface DeleteProjectReq {
  projectId: string
}

export async function deleteProjectRequest({ projectId }: DeleteProjectReq) {
  return connection.delete(`/projects/${projectId}`)
}
