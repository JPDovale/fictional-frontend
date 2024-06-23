import { connection } from '../fcapi/axios'

export interface ChangePositionPersonAttributeMuttationReq {
  projectId: string
  personId: string
  attributeId: string
  mutationId: string
  direction: 'UP' | 'DOWN' | 'TOP' | 'BOTTOM'
}

export async function changePositionPersonAttributeMuttationRequest({
  projectId,
  personId,
  attributeId,
  mutationId,
  ...rest
}: ChangePositionPersonAttributeMuttationReq) {
  return connection.patch(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}/mutations/${mutationId}/position`,
    rest,
  )
}
