import { connection } from '../fcapi/axios'
import { EventDate } from '../timelines/getTimelineRequest'

export enum PersonType {
  PROTAGONIST = 'PROTAGONIST',
  ANTAGONIST = 'ANTAGONIST',
  SUPPORTING = 'SUPPORTING',
  SECONDARY = 'SECONDARY',
  ADVERSARY = 'ADVERSARY',
  MENTOR = 'MENTOR',
  COMIC = 'COMIC',
  SYMBOLIC = 'SYMBOLIC',
  EXTRA = 'EXTRA',
}

export interface Person {
  id: string
  name: string
  image: {
    url: string | null
    alt: string
  }
  history: string | null
  birthDate: EventDate | null
  deathDate: EventDate | null
  projectId: string
  type: PersonType
  fatherId: string | null
  motherId: string | null
  createdAt: Date
  updatedAt: Date | null
}

interface GetPersonReq {
  projectId: string
  personId: string
}

interface GetPersonRes {
  person: Person
}

export async function getPersonRequest({ projectId, personId }: GetPersonReq) {
  return connection.get<GetPersonRes>(
    `/projects/${projectId}/persons/${personId}`,
  )
}
