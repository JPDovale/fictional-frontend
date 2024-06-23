import { connection } from '../fcapi/axios'
import { BuildBlock, Project } from './getProjectsRequest'

interface CreateProjectReq {
  name: string
  image?: string
  buildBlocks: BuildBlock[]
}

interface CreateProjectRes {
  project: Project
}

export async function createProjectRequest(data: CreateProjectReq) {
  return connection.post<CreateProjectRes>('/projects', data)
}
