import { useParams } from 'next/navigation'
import { useMapper } from '../useMapper'
import { projectBaseMapper } from '@/configs/mappers/projects/projectBase'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useHomeTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const baseGroupActions = useBaseGroupActions()
  const mapperProjectBase = useMapper(projectBaseMapper)

  const homeNode: NodeTree = {
    id: mapperProjectBase.getId('home'),
    icon: mapperProjectBase.getIcon('home'),
    name: mapperProjectBase.getTranslation('home'),
    path: `/projects/${projectId}`,
    acctionGroups: baseGroupActions,
  }

  return homeNode
}
