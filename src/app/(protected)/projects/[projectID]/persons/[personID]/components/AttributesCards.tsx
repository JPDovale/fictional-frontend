import { useProject } from '@/hooks/useProject'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { useParams } from 'next/navigation'
import { AttributeGroupCards } from './AttributeGroupCards'
import { attributesTypeMapper } from '@/configs/mappers/persons/attributesType'
import { useMapper } from '@/hooks/useMapper'

export function AttributesCards() {
  const { projectID, personID } = useParams()
  const projectId = projectID as string
  const personId = personID as string

  const { usePerson } = useProject({ projectId })
  const { person, attributesThisPerson } = usePerson({ personId })
  const mapper = useMapper(attributesTypeMapper)

  const attributeTypes = Object.keys(attributesTypeMapper) as AttributeType[]

  if (!person) return null

  return (
    <div className="flex flex-col gap-4 pt-4  border-t border-t-purple500">
      <h2 className="text-xl font-bold">Atributos do personagem</h2>

      {attributeTypes.map((type, i) => (
        <AttributeGroupCards
          key={`${type}-${i}`}
          title={mapper.getTranslation(type)}
          Icon={mapper.getIcon(type)!}
          attributes={attributesThisPerson.filter((attr) => attr.type === type)}
        />
      ))}
    </div>
  )
}
