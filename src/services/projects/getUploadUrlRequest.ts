import { connection } from '../fcapi/axios'

interface GetUploadUrlReq {
  filename: string
  contentType: string
}

interface GetUploadUrlRes {
  uploadUrl: string
  name: string
}

export async function getUploadUrlRequest(data: GetUploadUrlReq) {
  return connection.post<GetUploadUrlRes>('/projects/upload', data)
}
