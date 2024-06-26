import { personsTypesMapper } from '@/configs/mappers/persons/personsType'
import { PersonType } from '@/services/persons/getPersonRequest'
import { useMapper } from '../useMapper'
import { useParams } from 'next/navigation'
import { usePersons } from '../persons/usePersons'
import { PersonPreview } from '@/services/persons/getPersonsRequest'
import { attributesTypeMapper } from '@/configs/mappers/persons/attributesType'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { usePersonAttributesTreeFolder } from './usePersonsAttributesTreeFolder'
import { useBaseGroupActions } from './useBaseGroupActions'
import { personActionsMapper } from '@/configs/mappers/persons/acctionsMapper'
import { useDeletingPerson } from '../persons/useDeletingPerson'
import { HiOutlineIdentification } from 'react-icons/hi2'
import { useAttributeGroupActions } from './useAttributesGroupActions'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function usePersonTypeTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { persons } = usePersons({ projectId })
  const { setDeletingPerson } = useDeletingPerson({ projectId })
  const { makeAttributeNode } = usePersonAttributesTreeFolder()
  const { makePersonGroupActions } = useAttributeGroupActions()
  const mapper = useMapper(personsTypesMapper)
  const mapperPersonActions = useMapper(personActionsMapper)
  const baseGroupActions = useBaseGroupActions()
  const attributeTypesKeys = Object.keys(
    attributesTypeMapper,
  ) as AttributeType[]

  function makePersonTypeChild(
    person: PersonPreview,
    personsType: PersonType,
  ): NodeTree {
    return {
      id: person.id,
      icon: mapper.getIcon(personsType),
      name: person.name,
      path: `/projects/${projectId}/persons/${person.id}`,
      acctionGroups: makePersonGroupActions(person.id),
      childs: [
        {
          id: `${person.id}-id`,
          name: 'Identidade',
          path: `/projects/${projectId}/persons/${person.id}/identity`,
          acctionGroups: makePersonGroupActions(person.id),
          icon: HiOutlineIdentification,
        },
        ...attributeTypesKeys.map((key) =>
          makeAttributeNode({
            attributeType: key,
            personId: person.id,
          }),
        ),
      ],
      actions: [
        {
          icon: mapperPersonActions.getIcon('trash'),
          label: mapperPersonActions.getTranslation('trash'),
          action: () => setDeletingPerson(person.id),
          type: 'danger',
        },
      ],
    }
  }

  function makePersonTypeNode(personsType: PersonType): NodeTree {
    const personsThisType = persons.filter((p) => p.type === personsType)

    const personNode: NodeTree = {
      id: mapper.getId(personsType),
      icon: mapper.getIcon(personsType),
      name: mapper.getTranslation(personsType),
      isToShow: personsThisType.length > 0,
      childs: personsThisType.map((person) =>
        makePersonTypeChild(person, personsType),
      ),
      acctionGroups: baseGroupActions,
    }

    return personNode
  }

  return {
    makePersonTypeNode,
  }
}
