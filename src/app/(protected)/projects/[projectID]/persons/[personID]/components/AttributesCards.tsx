import {
  attributeIconsMapper,
  attributeTypeNameMapper,
} from '@/configs/projectFolderTree/persons'
import { useProject } from '@/hooks/useProject'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { useParams } from 'next/navigation'
import { AttributeGroupCards } from './AttributeGroupCards'

export function AttributesCards() {
  const { projectID, personID } = useParams()
  const projectId = projectID as string
  const personId = personID as string

  const { usePerson } = useProject({ projectId })
  const { person, attributesThisPerson } = usePerson({ personId })

  const attributeTypes = Object.keys(attributeTypeNameMapper) as AttributeType[]

  if (!person) return null

  return (
    <div className="flex flex-col gap-4 pt-4  border-t border-t-purple500">
      <h2 className="text-xl font-bold">Atributos do personagem</h2>

      {attributeTypes.map((type, i) => (
        <AttributeGroupCards
          key={`${type}-${i}`}
          title={attributeTypeNameMapper[type]}
          Icon={attributeIconsMapper[type]}
          attributes={attributesThisPerson.filter((attr) => attr.type === type)}
        />
      ))}
    </div>
  )
}
