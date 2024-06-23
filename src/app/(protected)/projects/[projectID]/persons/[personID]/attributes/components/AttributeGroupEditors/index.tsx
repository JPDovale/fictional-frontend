import { ListEnd } from 'lucide-react'
import { useState } from 'react'
import { AttributeMutationEditor } from '../AttributeMutationEditor'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CreateAttributeMutationDialog } from './CreateAttributeMutationDialog'
import { AttributeEditor } from './AttributeEditor'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { NotFound } from '@/components/application/NotFound'

export function AttributeGroupEditors() {
  const [isCreatingMutation, setIsCreatingMutation] = useState(false)
  const [animationRef] = useAutoAnimate()

  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const { usePerson } = useProject({ projectId })
  const { useAttribute } = usePerson({ personId })
  const { attribute, isLoadingAttribute } = useAttribute({ attributeId })

  const menuOptions = [
    {
      title: `Criar alteração de atributo`,
      description:
        'Cria uma alteração de atributo que ocorera no decorrer da história',
      handler: () => setIsCreatingMutation(true),
      icon: <ListEnd className="w-10 h-10 p-2" />,
    },
  ]

  if (!attribute && !isLoadingAttribute) return <NotFound />

  return (
    <main className="flex flex-col max-w-3xl w-full mx-auto -mt-24 py-4">
      <AttributeEditor menuOptions={menuOptions} />

      <ul ref={animationRef}>
        {attribute?.mutations.map((mutation) => (
          <AttributeMutationEditor
            lastPossition={attribute.mutations.length}
            key={mutation.id}
            mutation={mutation}
            menuOptions={menuOptions}
          />
        ))}
      </ul>

      <CreateAttributeMutationDialog
        isOpen={isCreatingMutation}
        setIsOpen={setIsCreatingMutation}
      />
    </main>
  )
}
