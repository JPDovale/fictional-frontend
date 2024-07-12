import { useParams } from 'next/navigation'
import { useMapper } from '../useMapper'
import { projectBaseMapper } from '@/configs/mappers/projects/projectBase'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useDrawTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const mapper = useMapper(projectBaseMapper)
  const baseGourpActions = useBaseGroupActions()

  const settingsNode: NodeTree = {
    id: mapper.getId('draw'),
    path: `/projects/${projectId}/draw`,
    icon: mapper.getIcon('draw'),
    name: mapper.getTranslation('draw'),
    acctionGroups: baseGourpActions,
  }

  return settingsNode
}
