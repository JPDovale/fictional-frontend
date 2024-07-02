import { connection } from '../fcapi/axios'

interface DeleteEventReq {
  projectId: string
  timelineId: string
  eventId: string
}

export async function deleteEventRequest({
  projectId,
  timelineId,
  eventId,
}: DeleteEventReq) {
  return connection.delete(
    `/projects/${projectId}/timelines/${timelineId}/events/${eventId}`,
  )
}
