import { connection } from '../fcapi/axios'

export interface File {
  id: string
  title: string
  content: string
  projectId: string
  createdAt: Date
  updatedAt: Date | null
}

interface GetFileReq {
  projectId: string
  fileId: string
}

interface GetFileRes {
  file: File
}

export async function getFileRequest({ projectId, fileId }: GetFileReq) {
  return connection.get<GetFileRes>(`/projects/${projectId}/files/${fileId}`)
}
