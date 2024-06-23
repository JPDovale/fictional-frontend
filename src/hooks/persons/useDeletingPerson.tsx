import { useToast } from '@/components/ui/use-toast'
import { usePersons } from './usePersons'
import { usePersonsAttributes } from './usePersonsAttributes'
import { usePathname, useRouter } from 'next/navigation'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { deletePersonRequest } from '@/services/persons/deletePersonRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'

interface UseDeletingPersonProps {
  projectId?: string
}

export function useDeletingPerson({ projectId }: UseDeletingPersonProps) {
  const { toast } = useToast()
  const { persons, refetchPersons } = usePersons({ projectId })
  const { refetchAttributes } = usePersonsAttributes({ projectId })
  const { deletingPerson, setDeletingPerson } = useInterfaceStore((state) => ({
    deletingPerson: state.deletingPerson,
    setDeletingPerson: state.setDeletingPerson,
  }))

  const navigate = useRouter()
  const pathname = usePathname()
  const person = persons.find((p) => p.id === deletingPerson)

  async function deletePerson() {
    if (!projectId || !deletingPerson) return

    const response = await deletePersonRequest({
      projectId,
      personId: deletingPerson,
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
        title: 'Personagem movido para lixeira',
        description: `O personagem ${person?.name} foi movido para lixeira.`,
      })

      await refetchPersons()
      await refetchAttributes()

      if (pathname.includes(deletingPerson)) {
        navigate.push(`/projects/${projectId}`)
      }

      setDeletingPerson(null)
    }
  }

  return { deletePerson, deletingPerson, setDeletingPerson, person }
}
