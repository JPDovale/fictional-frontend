import { connection } from '../fcapi/axios'
import { File } from './getFileRequest'

export interface CreateFileReq {
  projectId: string
  folderId?: string
}

interface CreateFileRes {
  file: File
}

export async function createFileRequest({ projectId, ...rest }: CreateFileReq) {
  return connection.post<CreateFileRes>(`/projects/${projectId}/files`, rest)
}
