import { isString } from 'lodash'
import { useParams as useNextParams } from 'next/navigation'

export function useParams() {
  const { projectID, personID, attributeID, timelineID, fileID } =
    useNextParams()

  const projectId = isString(projectID) ? projectID : 'not-found'
  const personId = isString(personID) ? personID : 'not-found'
  const attributeId = isString(attributeID) ? attributeID : 'not-found'
  const timelineId = isString(timelineID) ? timelineID : 'not-found'
  const fileId = isString(fileID) ? fileID : 'not-found'

  return { projectId, personId, attributeId, timelineId, fileId }
}
