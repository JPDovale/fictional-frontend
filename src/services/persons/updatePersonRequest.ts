import { connection } from '../fcapi/axios'
import { Person, PersonType } from './getPersonRequest'

export interface UpdatePersonReq {
  projectId: string
  personId: string
  fatherId?: string | null
  motherId?: string | null
  type?: PersonType
  deathDate?: string | null
  birthDate?: string | null
  image?: string | null
  name?: string | null
  history?: string | null
}

interface UpdatePersonRes {
  person: Person
}

export async function updatePersonRequest({
  projectId,
  personId,
  ...rest
}: UpdatePersonReq) {
  return connection.put<UpdatePersonRes>(
    `/projects/${projectId}/persons/${personId}`,
    rest,
  )
}
