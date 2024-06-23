import { connection } from '../fcapi/axios'
import { BuildBlock, Project } from './getProjectsRequest'

interface UpdateProjectBuildBlocksReq {
  buildBlocks: BuildBlock[]
  projectId: string
}

interface UpdateProjectBuildBlocksRes {
  project: Project
}

export async function updateProjectBuildblocksRequest({
  projectId,
  ...rest
}: UpdateProjectBuildBlocksReq) {
  return connection.patch<UpdateProjectBuildBlocksRes>(
    `/projects/${projectId}/build-blocks`,
    rest,
  )
}
