import { connection } from '../fcapi/axios'

export enum BuildBlock {
  FOUNDATION = 'FOUNDATION',
  TIME_LINES = 'TIME_LINES',
  PERSONS = 'PERSONS',
  SCENES_BOARD = 'SCENES_BOARD',
}

export interface BuildBlocksJson {
  FOUNDATION: boolean
  TIME_LINES: boolean
  PERSONS: boolean
  SCENES_BOARD: boolean
}

export interface Project {
  id: string
  name: string
  image: {
    url: string | null
    alt: string
  }
  buildBlocks: BuildBlocksJson
  type: 'BOOK'
  structureType: 'FICTIONAL_FLOW'
  createdAt: Date
  updatedAt: Date | null
}

interface GetProjectsRes {
  projects: Project[]
}

export async function getProjectsRequest() {
  return connection.get<GetProjectsRes>('/projects')
}
