import { useParams } from 'next/navigation'
import { useMapper } from '../useMapper'
import { personActionsMapper } from '@/configs/mappers/persons/acctionsMapper'
import { projectBaseMapper } from '@/configs/mappers/projects/projectBase'
import { buildBlocksMapper } from '@/configs/mappers/buildBlocks'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { useFolders } from '../useFolders'
import { ActionGroup } from '@/components/application/FolderTree/Node'
import { FaCrown } from 'react-icons/fa6'
import { useUser } from '../useUser'

export function useBaseGroupActions() {
  const { user } = useUser()
  const { projectID } = useParams()
  const projectId = projectID as string

  const { createFolder } = useFolders()
  const mapperBuildBlocks = useMapper(buildBlocksMapper)
  const mapperPersonActions = useMapper(personActionsMapper)
  const mapperProjectBase = useMapper(projectBaseMapper)

  const baseGroupActions: ActionGroup[] = [
    {
      title: mapperProjectBase.getTranslation('project'),
      actions: [
        {
          label: mapperProjectBase.getTranslation('settings'),
          action: () => `/projects/${projectId}/config`,
          icon: mapperProjectBase.getIcon('settings'),
        },
        {
          label: mapperProjectBase.getTranslation('logout'),
          action: () => `/projects`,
          icon: mapperProjectBase.getIcon('logout'),
        },
        {
          label: mapperProjectBase.getTranslation('trash'),
          action: () => `/projects/${projectId}/config#trash`,
          icon: mapperProjectBase.getIcon('trash'),
          type: 'danger',
        },
      ],
    },
    {
      title: mapperBuildBlocks.getTranslation(BuildBlock.PERSONS),
      actions: [
        {
          label: mapperPersonActions.getTranslation('new'),
          action: () => `/projects/${projectId}/persons/new`,
          icon: mapperPersonActions.getIcon('new'),
        },
      ],
    },
    {
      title: mapperProjectBase.getTranslation('folders'),
      actions: [
        {
          label: 'Nova pasta',
          action: () => createFolder(),
          icon: mapperProjectBase.getIcon('folders'),
          postIcon: FaCrown,
          disabled: !user?.isSubscriber,
        },
      ],
    },
  ]

  return baseGroupActions
}
