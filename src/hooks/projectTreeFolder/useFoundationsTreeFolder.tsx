import { useParams } from 'next/navigation'
import { useProject } from '../useProject'
import { useBuildBlocks } from '../useBuildBlocks'
import { useMapper } from '../useMapper'
import {
  FoundationMapper,
  foundationMapper,
} from '@/configs/mappers/foundations/foundation'
import { buildBlocksMapper } from '@/configs/mappers/buildBlocks'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useFoundationsTreeFodler() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { project } = useProject({ projectId })
  const { isBlockActive } = useBuildBlocks(project?.buildBlocks)
  const mapper = useMapper(foundationMapper)
  const mapperBuildBlock = useMapper(buildBlocksMapper)
  const baseGrouActions = useBaseGroupActions()

  function makeFoundationChild(name: keyof FoundationMapper): NodeTree {
    return {
      id: mapper.getId(name),
      icon: mapper.getIcon(name),
      preIcon: mapper.getPreIcon(name),
      name: mapper.getTranslation(name),
      path: `/projects/${projectId}/foundation/${name}`,
      acctionGroups: baseGrouActions,
    }
  }

  const mapperKeys = Object.keys(foundationMapper) as (keyof FoundationMapper)[]

  const foundationNode: NodeTree = {
    id: mapperBuildBlock.getId(BuildBlock.FOUNDATION),
    icon: mapperBuildBlock.getIcon(BuildBlock.FOUNDATION),
    name: mapperBuildBlock.getTranslation(BuildBlock.FOUNDATION),
    isToShow: isBlockActive('FOUNDATION'),
    path: `/projects/${projectId}/foundation`,
    childs: mapperKeys.map(makeFoundationChild),
    acctionGroups: baseGrouActions,
  }

  return foundationNode
}
