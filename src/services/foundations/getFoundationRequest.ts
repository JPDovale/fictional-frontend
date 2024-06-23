import { connection } from '../fcapi/axios'

export interface Foundation {
  id: string
  projectId: string
  foundation: string
  whatHappens: string
  whyHappens: string
  whereHappens: string
  whoHappens: string
  createdAt: Date
  updatedAt: Date | null
}

interface GetFoundationReq {
  projectId: string
}

interface GetFoundationRes {
  foundation: Foundation
}

export async function getFoundationRequest({ projectId }: GetFoundationReq) {
  return connection.get<GetFoundationRes>(`/projects/${projectId}/foundations`)
}
