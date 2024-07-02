import { connection } from '../fcapi/axios'

export type ImportanceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface EventDate {
  date: string
  day: number
  month: number
  year: number
  period: -1 | 0
  hour: number
  minute: number
  second: number
}

export interface Event {
  id: string
  title: string
  event: string
  importanceLevel: ImportanceLevel
  date: string
  dateObject: EventDate
  createdAt: Date
  updatedAt: Date | null
}

interface Timeline {
  id: string
  name: string
  projectId: string
  createdAt: string
  updatedAt: string | null
  events: Event[]
}

interface GetTimelineReq {
  projectId: string
  timelineId: string
}

interface GetTimelineRes {
  timeline: Timeline
}

export async function getTimelineRequest({
  projectId,
  timelineId,
}: GetTimelineReq) {
  return connection.get<GetTimelineRes>(
    `/projects/${projectId}/timelines/${timelineId}`,
  )
}
