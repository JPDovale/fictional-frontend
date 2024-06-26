import { connection } from '../fcapi/axios'

export interface UpdateFolderReq {
  projectId: string
  folderId: string
  name?: string | null
}

export async function updateFolderRequest({
  projectId,
  folderId,
  ...rest
}: UpdateFolderReq) {
  return connection.put(`/projects/${projectId}/folders/${folderId}`, rest)
}
