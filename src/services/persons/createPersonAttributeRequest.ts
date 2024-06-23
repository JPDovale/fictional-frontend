import { connection } from '../fcapi/axios'
import { AttributeType } from './getPersonAttributeRequest'

export interface CreatePersonAttributeReq {
  projectId: string
  personId: string
  type: AttributeType
}

export async function createPersonAttributeRequest({
  projectId,
  personId,
  ...rest
}: CreatePersonAttributeReq) {
  return connection.post(
    `/projects/${projectId}/persons/${personId}/attributes`,
    rest,
  )
}
