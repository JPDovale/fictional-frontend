import { connection } from '../fcapi/axios'

export interface DeletePersonAttributeMuttationReq {
  projectId: string
  personId: string
  attributeId: string
  mutationId: string
}

export async function deletePersonAttributeMuttationRequest({
  projectId,
  personId,
  attributeId,
  mutationId,
}: DeletePersonAttributeMuttationReq) {
  return connection.delete(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}/mutations/${mutationId}`,
  )
}
