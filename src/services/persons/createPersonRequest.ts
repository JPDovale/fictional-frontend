import { connection } from '../fcapi/axios'
import { Person, PersonType } from './getPersonRequest'

interface CreatePersonReq {
  projectId: string
  fatherId?: string
  motherId?: string
  type: PersonType
  deathDate?: string
  birthDate?: string
  image?: string
  name?: string
}

interface CreatePersonRes {
  person: Person
}

export async function createPersonRequest({
  projectId,
  ...rest
}: CreatePersonReq) {
  return connection.post<CreatePersonRes>(
    `/projects/${projectId}/persons`,
    rest,
  )
}
