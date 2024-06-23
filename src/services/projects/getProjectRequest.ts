import { connection } from '../fcapi/axios'
import { Project } from './getProjectsRequest'

interface GetProjectReq {
  projectId: string
}

interface GetProjectRes {
  project: Project
}

export async function getProjectRequest({ projectId }: GetProjectReq) {
  return connection.get<GetProjectRes>(`/projects/${projectId}`)
}
