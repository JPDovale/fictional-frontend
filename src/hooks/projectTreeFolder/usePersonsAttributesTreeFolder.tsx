import { useParams } from 'next/navigation'
import { usePersonsAttributes } from '../persons/usePersonsAttributes'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { useMapper } from '../useMapper'
import { attributesTypeMapper } from '@/configs/mappers/persons/attributesType'
import { AttributePreview } from '@/services/persons/getAttributesPreviweRequest'
import { FileEdit, Trash } from 'lucide-react'
import { useAttributeGroupActions } from './useAttributesGroupActions'
import { useDeletingPersonAttribute } from '../persons/useDeletingPersonAttribute'
import { NodeTree } from '@/components/application/FolderTree/Node'

interface MakeAttributeNodeProps {
  attributeType: AttributeType
  personId: string
}

export function usePersonAttributesTreeFolder() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { attributes } = usePersonsAttributes({ projectId })
  const { setDeletingPersonAttribute } = useDeletingPersonAttribute({
    projectId,
  })
  const { makePersonGroupActions } = useAttributeGroupActions()
  const mapper = useMapper(attributesTypeMapper)

  function makeAttributeNodeChilds(
    attribute: AttributePreview,
    attributeType: AttributeType,
    personId: string,
  ): NodeTree {
    return {
      id: attribute.id,
      name: attribute.file.title,
      path: `/projects/${projectId}/persons/${personId}/attributes/${mapper.getName(attributeType)}/${attribute.id}`,
      icon: FileEdit,
      acctionGroups: makePersonGroupActions(personId),
      actions: [
        {
          icon: Trash,
          label: 'Mover para lixeira',
          action: () => setDeletingPersonAttribute(attribute.id),
          type: 'danger',
        },
      ],
    }
  }

  function makeAttributeNode({
    attributeType,
    personId,
  }: MakeAttributeNodeProps): NodeTree {
    const attributesThisNode = attributes.filter(
      (attribute) =>
        attribute.type === attributeType && attribute.personId === personId,
    )

    const attributesNode: NodeTree = {
      id: `${attributeType}-${personId}`,
      name: mapper.getTranslation(attributeType),
      icon: mapper.getIcon(attributeType),
      isToShow: attributesThisNode.length > 0,
      childs: attributesThisNode.map((attribute) =>
        makeAttributeNodeChilds(attribute, attributeType, personId),
      ),
      acctionGroups: makePersonGroupActions(personId),
    }

    return attributesNode
  }

  return {
    makeAttributeNode,
  }
}
