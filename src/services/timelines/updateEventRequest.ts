import { connection } from '../fcapi/axios'
import { ImportanceLevel } from './getTimelineRequest'

interface UpdateEventReq {
  projectId: string
  timelineId: string
  eventId: string
  event?: string
  importanceLevel?: ImportanceLevel
  date?: string
  title?: string
}

export async function updateEventRequest({
  projectId,
  timelineId,
  eventId,
  ...rest
}: UpdateEventReq) {
  return connection.put(
    `/projects/${projectId}/timelines/${timelineId}/events/${eventId}`,
    rest,
  )
}
