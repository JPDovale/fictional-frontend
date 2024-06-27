import { connection } from '../fcapi/axios'

export interface DeleteFolderReq {
  projectId: string
  folderId?: string
}

export async function deleteFolderRequest({
  projectId,
  folderId,
}: DeleteFolderReq) {
  return connection.delete(`/projects/${projectId}/folders/${folderId}`)
}
