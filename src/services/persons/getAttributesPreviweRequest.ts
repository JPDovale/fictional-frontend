import { connection } from '../fcapi/axios'
import { AttributeType } from './getPersonAttributeRequest'

export interface AttributePreview {
  id: string
  type: AttributeType
  personId: string
  file: {
    id: string
    title: string
    contentPreview: string
    createdAt: Date
    updatedAt: Date | null
  }
}

interface GetAttributesPreviewReq {
  projectId: string
}

interface GetAttributesPreviewRes {
  attributes: AttributePreview[]
}

export async function getAttributesPreviewRequest({
  projectId,
}: GetAttributesPreviewReq) {
  return connection.get<GetAttributesPreviewRes>(
    `/projects/${projectId}/persons-attributes`,
  )
}
