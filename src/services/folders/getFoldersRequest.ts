import { connection } from '../fcapi/axios'

export type Folder = {
  id: string
  projectId: string
  parentId: string | null
  name: string
  files: {
    id: string
    title: string
  }[]
  childs: Folder[]
  createdAt: Date
  updatedAt: Date | null
}

interface GetFoldersReq {
  projectId: string
}

interface GetFoldersRes {
  folders: Folder[]
}

export async function getFoldersRequest({ projectId }: GetFoldersReq) {
  return connection.get<GetFoldersRes>(`/projects/${projectId}/folders/`)
}
