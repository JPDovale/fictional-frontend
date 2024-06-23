import { connection } from '../fcapi/axios'

interface DeletePersonAttributeReq {
  projectId: string
  personId: string
  attributeId: string
}

export async function deletePersonAttributeRequest({
  projectId,
  personId,
  attributeId,
}: DeletePersonAttributeReq) {
  return connection.delete(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}`,
  )
}
