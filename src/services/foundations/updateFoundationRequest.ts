import { connection } from '../fcapi/axios'

export interface UpdateFoundationReq {
  projectId: string
  foundationId: string
  foundation?: string | null
  whatHappens?: string | null
  whyHappens?: string | null
  whereHappens?: string | null
  whoHappens?: string | null
}

export async function updateFoundationRequest({
  projectId,
  foundationId,
  ...rest
}: UpdateFoundationReq) {
  return connection.put(
    `/projects/${projectId}/foundations/${foundationId}`,
    rest,
  )
}
