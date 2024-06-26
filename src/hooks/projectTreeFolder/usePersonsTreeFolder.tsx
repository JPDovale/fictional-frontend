import { useParams } from 'next/navigation'
import { useProject } from '../useProject'
import { useBuildBlocks } from '../useBuildBlocks'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { useMapper } from '../useMapper'
import { buildBlocksMapper } from '@/configs/mappers/buildBlocks'
import { personsTypesMapper } from '@/configs/mappers/persons/personsType'
import { PersonType } from '@/services/persons/getPersonRequest'
import { usePersonTypeTreeFolder } from './usePersonTypeTreeFolder'
import { useBaseGroupActions } from './useBaseGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function usePersonsTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { project } = useProject({ projectId })
  const { isBlockActive } = useBuildBlocks(project?.buildBlocks)
  const { makePersonTypeNode } = usePersonTypeTreeFolder()
  const mapperBuildBlocks = useMapper(buildBlocksMapper)
  const baseGroupActions = useBaseGroupActions()

  const personTypesKeys = Object.keys(personsTypesMapper) as PersonType[]

  const personsNode: NodeTree = {
    id: mapperBuildBlocks.getId(BuildBlock.PERSONS),
    path: `/projects/${projectId}/persons/new`,
    isToShow: isBlockActive(BuildBlock.PERSONS),
    icon: mapperBuildBlocks.getIcon(BuildBlock.PERSONS),
    name: mapperBuildBlocks.getTranslation(BuildBlock.PERSONS),
    childs: personTypesKeys.map(makePersonTypeNode),
    acctionGroups: baseGroupActions,
  }

  return personsNode
}
