import { useToast } from '@/components/ui/use-toast'
import { LocalStorageKeys } from '@/configs/localstorageKeys'
import { AttributePreview } from '@/services/persons/getAttributesPreviweRequest'
import { Person } from '@/services/persons/getPersonRequest'
import {
  UpdatePersonReq,
  updatePersonRequest,
} from '@/services/persons/updatePersonRequest'
import { Optional } from '@/shared/types/types/Optional'
import { StatusCode } from '@/shared/types/types/StatusCode'
import localstorageFunctions from '@/utils/localstorageFunctions'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UsePersonQueryMutationProps {
  projectId?: string
  personId?: string
}

interface PersonQueryData {
  person: Person | null
  attributesThisPerson: AttributePreview[]
}

export function usePersonQueryMutation({
  projectId,
  personId,
}: UsePersonQueryMutationProps) {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync: updatePerson } = useMutation<
    void,
    Error,
    Optional<UpdatePersonReq, 'personId' | 'projectId'>
  >({
    mutationFn: async (variables) => {
      if (!projectId || !personId) return

      const response = await updatePersonRequest({
        personId,
        projectId,
        ...variables,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }
    },
    onSuccess: (
      _,
      { name, history, type, image, birthDate, deathDate, fatherId, motherId },
    ) => {
      queryClient.setQueryData(
        [`projects:${projectId}:persons:${personId}`],
        (cachedData: PersonQueryData) => {
          return {
            person: {
              id: cachedData.person?.id,
              projectId: cachedData.person?.projectId,
              createdAt: cachedData.person?.createdAt,
              updatedAt: cachedData.person?.updatedAt,
              name: name === undefined ? cachedData.person?.name : name,
              history:
                history === undefined ? cachedData.person?.history : history,
              type: type === undefined ? cachedData.person?.type : type,
              image: image === undefined ? cachedData.person?.image : image,
              birthDate:
                birthDate === undefined
                  ? cachedData.person?.birthDate
                  : birthDate,
              deathDate:
                deathDate === undefined
                  ? cachedData.person?.deathDate
                  : deathDate,
              fatherId:
                fatherId === undefined ? cachedData.person?.fatherId : fatherId,
              motherId:
                motherId === undefined ? cachedData.person?.motherId : motherId,
            },
            attributesThisPerson: cachedData.attributesThisPerson,
          }
        },
      )
    },
  })

  function getTempPersistenceKey() {
    return `${LocalStorageKeys.EDITOR_TEMP_PERSISTENCE}:projects:${projectId}:persons:${personId}` as LocalStorageKeys
  }

  function getTempPersistence() {
    const value = localstorageFunctions.Get<string>(getTempPersistenceKey())
    return value ?? ''
  }

  return { updatePerson, getTempPersistence, getTempPersistenceKey }
}
