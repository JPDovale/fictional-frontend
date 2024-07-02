import { connection } from '../fcapi/axios'
import { ImportanceLevel } from './getTimelineRequest'

interface CreateEventReq {
  projectId: string
  timelineId: string
  event: string
  importanceLevel: ImportanceLevel
  date: string
  title: string
}

export async function createEventRequest({
  projectId,
  timelineId,
  ...rest
}: CreateEventReq) {
  return connection.post(
    `/projects/${projectId}/timelines/${timelineId}/events`,
    rest,
  )
}
