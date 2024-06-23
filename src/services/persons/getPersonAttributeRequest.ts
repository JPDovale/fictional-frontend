import { connection } from '../fcapi/axios'
import { EventDate, ImportanceLevel } from '../timelines/getTimelineRequest'

export interface Mutation {
  id: string
  fileId: string
  position: number
  eventId: string | null
  title?: string | null
  date: EventDate | null
  importanceLevel: ImportanceLevel | null
  createdAt: Date
  updatedAt: Date | null
}

export enum AttributeType {
  APPEARANCE = 'APPEARANCE',
  DREAM = 'DREAM',
  OBJECTIVE = 'OBJECTIVE',
  PERSONALITY = 'PERSONALITY',
  TRAUMA = 'TRAUMA',
  VALUE = 'VALUE',
  HOBBY = 'HOBBY',
  FEAR = 'FEAR',
  MOTIVATION = 'MOTIVATION',
  ADDICTION = 'ADDICTION',
  DESIRE = 'DESIRE',
  HABIT = 'HABIT',
}

export interface Attribute {
  id: string
  fileId: string
  type: AttributeType
  createdAt: Date
  updatedAt: Date | null
  mutations: Mutation[]
}

interface GetPersonAttributeReq {
  projectId: string
  personId: string
  attributeId: string
}

interface GetPersonAttributeRes {
  attribute: Attribute
}

export async function getPersonAttributeRequest({
  projectId,
  personId,
  attributeId,
}: GetPersonAttributeReq) {
  return connection.get<GetPersonAttributeRes>(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}`,
  )
}
