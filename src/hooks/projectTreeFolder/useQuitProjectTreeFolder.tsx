import { useMapper } from '../useMapper'
import { projectBaseMapper } from '@/configs/mappers/projects/projectBase'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useQuitProjectTreeFolder() {
  const mapper = useMapper(projectBaseMapper)
  const baseGroupActions = useBaseGroupActions()

  const quitNode: NodeTree = {
    id: mapper.getId('logout'),
    name: mapper.getTranslation('logout'),
    path: '/projects',
    icon: mapper.getIcon('logout'),
    acctionGroups: baseGroupActions,
  }

  return quitNode
}
