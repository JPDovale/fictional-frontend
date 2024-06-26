import { Clock } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTimelines } from '../useTimelines'
import { useMapper } from '../useMapper'
import { buildBlocksMapper } from '@/configs/mappers/buildBlocks'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { useBuildBlocks } from '../useBuildBlocks'
import { useProject } from '../useProject'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useTimelinesTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { project } = useProject({ projectId })
  const { timelines } = useTimelines({ projectId })
  const { isBlockActive } = useBuildBlocks(project?.buildBlocks)
  const mapper = useMapper(buildBlocksMapper)
  const baseGroupActions = useBaseGroupActions()

  const timeLinesNode: NodeTree = {
    id: mapper.getId(BuildBlock.TIME_LINES),
    path: `/projects/${projectId}/timelines`,
    icon: mapper.getIcon(BuildBlock.TIME_LINES),
    isToShow: isBlockActive(BuildBlock.TIME_LINES),
    name: mapper.getTranslation(BuildBlock.TIME_LINES),
    acctionGroups: baseGroupActions,
    childs: timelines.map((timeline) => ({
      id: timeline.id,
      name: timeline.name,
      icon: Clock,
      path: `/projects/${projectId}/timelines/${timeline.id}`,
    })),
  }

  return timeLinesNode
}
