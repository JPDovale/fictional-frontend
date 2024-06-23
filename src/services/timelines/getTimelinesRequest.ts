import { connection } from '../fcapi/axios'

interface TimelinePreview {
  id: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string | null
}

interface GetTimelinesReq {
  projectId: string
}

interface GetTimelinesRes {
  timelines: TimelinePreview[]
}

export async function getTimelinesRequest({ projectId }: GetTimelinesReq) {
  return connection.get<GetTimelinesRes>(`/projects/${projectId}/timelines/`)
}
