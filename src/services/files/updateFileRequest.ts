import { connection } from '../fcapi/axios'
import { File } from './getFileRequest'

export interface UpdateFileReq {
  projectId: string
  fileId: string
  title?: string | null
  content?: string | null
}

interface UpdateFileRes {
  file: File
}

export async function updateFileRequest({
  projectId,
  fileId,
  ...rest
}: UpdateFileReq) {
  return connection.put<UpdateFileRes>(
    `/projects/${projectId}/files/${fileId}`,
    {
      ...rest,
      content: rest.content?.concat(
        ' <p onblur="alert(\'hello\')">alert("hello")</p>',
      ),
    },
  )
}
