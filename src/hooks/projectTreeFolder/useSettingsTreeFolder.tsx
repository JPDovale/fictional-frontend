import { useParams } from 'next/navigation'
import { useMapper } from '../useMapper'
import { projectBaseMapper } from '@/configs/mappers/projects/projectBase'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useSettingsTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const mapper = useMapper(projectBaseMapper)
  const baseGourpActions = useBaseGroupActions()

  const settingsNode: NodeTree = {
    id: mapper.getId('settings'),
    path: `/projects/${projectId}/config`,
    icon: mapper.getIcon('settings'),
    name: mapper.getTranslation('settings'),
    acctionGroups: baseGourpActions,
  }

  return settingsNode
}
