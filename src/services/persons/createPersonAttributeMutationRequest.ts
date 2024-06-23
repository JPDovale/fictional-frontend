import { connection } from '../fcapi/axios'
import { ImportanceLevel } from '../timelines/getTimelineRequest'

export interface CreatePersonAttributeMutationReq {
  projectId: string
  personId: string
  attributeId: string
  date?: string
  importanceLevel?: ImportanceLevel
  title?: string
}

export async function createPersonAttributeMutationRequest({
  projectId,
  personId,
  attributeId,
  ...rest
}: CreatePersonAttributeMutationReq) {
  return connection.post(
    `/projects/${projectId}/persons/${personId}/attributes/${attributeId}/mutations`,
    rest,
  )
}
