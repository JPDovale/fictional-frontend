import { connection } from '../fcapi/axios'

interface DeleteFileReq {
  projectId: string
  fileId: string
}

export async function deleteFileRequest({ projectId, fileId }: DeleteFileReq) {
  return connection.delete(`/projects/${projectId}/files/${fileId}`)
}
