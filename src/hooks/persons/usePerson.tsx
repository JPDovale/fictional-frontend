import { useQuery } from '@tanstack/react-query'
import { usePersonsAttributes } from './usePersonsAttributes'
import { usePersonQueryMutation } from './usePersonQueryMutation'
import { useAttribute } from './useAttribute'
import { Person, getPersonRequest } from '@/services/persons/getPersonRequest'
import { useToast } from '@/components/ui/use-toast'
import { StatusCode } from '@/shared/types/types/StatusCode'
import localstorageFunctions from '@/utils/localstorageFunctions'

interface UsePersonProps {
  projectId?: string
  personId?: string
}

interface PersonQueryData {
  person: Person | null
}

export interface DeletePersonProps {
  personId: string
}

export function usePerson({ projectId, personId }: UsePersonProps) {
  const { toast } = useToast()
  const { attributes } = usePersonsAttributes({ projectId })
  const { getTempPersistenceKey, getTempPersistence, updatePerson } =
    usePersonQueryMutation({ projectId, personId })

  const { data, isLoading, refetch } = useQuery<
    unknown,
    Error,
    PersonQueryData
  >({
    queryKey: [`projects:${projectId}:persons:${personId}`],
    queryFn: async () => {
      if (!projectId || !personId) {
        return {
          person: null,
        }
      }

      const response = await getPersonRequest({
        personId,
        projectId,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        const { person } = response.data

        localstorageFunctions.Set(getTempPersistenceKey(), person.history)

        return {
          person,
        }
      }

      return {
        person: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const person = data?.person ?? null
  const attributesThisPerson =
    attributes?.filter((a) => a.personId === personId) ?? []

  return {
    person,
    attributesThisPerson,
    isLoadingPerson: isLoading,
    refetchPerson: refetch,
    getTempPersistenceKey,
    getTempPersistence,
    updatePerson,
    useAttribute: ({ attributeId }: { attributeId?: string }) =>
      useAttribute({ attributeId, personId, projectId }),
  }
}
