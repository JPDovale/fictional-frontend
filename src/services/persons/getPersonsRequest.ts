import { connection } from '../fcapi/axios'
import { Person } from './getPersonRequest'

export type PersonPreview = Omit<Person, 'birthDate' | 'deathDate'>

interface GetPersonsReq {
  projectId: string
}

interface GetPersonsRes {
  persons: PersonPreview[]
}

export async function getPersonsRequest({ projectId }: GetPersonsReq) {
  return connection.get<GetPersonsRes>(`/projects/${projectId}/persons/`)
}
