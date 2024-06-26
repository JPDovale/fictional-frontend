import { connection } from '../fcapi/axios'

export interface CreateFolderReq {
  projectId: string
  parentId?: string
}

export async function createFolderRequest({
  projectId,
  ...rest
}: CreateFolderReq) {
  return connection.post(`/projects/${projectId}/folders`, rest)
}
