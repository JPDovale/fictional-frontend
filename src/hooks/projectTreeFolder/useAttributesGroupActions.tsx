import { attributesTypeMapper } from '@/configs/mappers/persons/attributesType'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { usePersons } from '../persons/usePersons'
import { useMapper } from '../useMapper'
import { useBaseGroupActions } from './useBaseGroupActions'
import { useParams } from '../useParams'
import { Action, ActionGroup } from '@/components/application/FolderTree/Node'

export function useAttributeGroupActions() {
  const { projectId } = useParams()
  const { createAttributeForPerson } = usePersons({ projectId })
  const baseGroupActions = useBaseGroupActions()
  const mapper = useMapper(attributesTypeMapper)

  const attributeTypesKeys = Object.keys(
    attributesTypeMapper,
  ) as AttributeType[]

  function makePersonGroupActions(personId: string): ActionGroup[] {
    const actions: Action[] = attributeTypesKeys.map((type) => ({
      label: `Criar ${mapper.getTranslation(type)}`,
      action: () =>
        createAttributeForPerson({
          personId,
          type,
        }),
      icon: mapper.getIcon(type),
    }))

    const groupActions: ActionGroup[] = [
      { title: 'Atributos', actions },
      ...baseGroupActions,
    ]

    return groupActions
  }

  return { makePersonGroupActions }
}
