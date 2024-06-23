import { connection } from '../fcapi/axios'
import { ImportanceLevel } from '../timelines/getTimelineRequest'

export interface UpdatePersonAttributeMutationReq {
  projectId: string
  personId: string
  attributeId: string
  mutationId: string
  date?: string | null
  ImportanceLevel?: ImportanceLevel
  title?: string | null
}

export async function updatePersonAttributeMutationRequest({
  projectId,
  personId,
  attributeId,
  mutationId,
  ...rest
}: UpdatePersonAttributeMutationReq) {
  return connection.put(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}/mutations/${mutationId}`,
    rest,
  )
}
