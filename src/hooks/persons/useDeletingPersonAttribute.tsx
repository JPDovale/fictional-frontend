import { useToast } from '@/components/ui/use-toast'
import { usePersons } from './usePersons'
import { usePersonsAttributes } from './usePersonsAttributes'
import { usePathname, useRouter } from 'next/navigation'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { deletePersonAttributeRequest } from '@/services/persons/deletePersonAttributeRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'

interface UseDeletingPersonAttributeProps {
  projectId?: string
}

export function useDeletingPersonAttribute({
  projectId,
}: UseDeletingPersonAttributeProps) {
  const { toast } = useToast()
  const { persons, refetchPersons } = usePersons({ projectId })
  const { refetchAttributes, attributes } = usePersonsAttributes({ projectId })
  const { deletingPersonAttribute, setDeletingPersonAttribute } =
    useInterfaceStore((state) => ({
      deletingPersonAttribute: state.deletingPersonAttribute,
      setDeletingPersonAttribute: state.setDeletingPersonAttribute,
    }))

  const navigate = useRouter()
  const pathname = usePathname()

  const attribute = attributes.find((a) => a.id === deletingPersonAttribute)
  const person = persons.find((p) => p.id === attribute?.personId)

  async function deletePersonAttribute() {
    if (!projectId || !attribute || !deletingPersonAttribute) return

    const response = await deletePersonAttributeRequest({
      projectId,
      personId: attribute.personId,
      attributeId: attribute.id,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.NO_CONTENT) {
      toast({
        title: 'Atributomovido para lixeira',
        description: `O atributo ${attribute.file?.title} de ${person?.name} foi movido para lixeira.`,
      })

      await refetchPersons()
      await refetchAttributes()

      if (pathname.includes(deletingPersonAttribute)) {
        navigate.push(`/projects/${projectId}`)
      }

      setDeletingPersonAttribute(null)
    }
  }

  return {
    deletePersonAttribute,
    deletingPersonAttribute,
    setDeletingPersonAttribute,
    attribute,
    person,
  }
}
