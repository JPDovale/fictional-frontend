import { useToast } from '@/components/ui/use-toast'
import { LocalStorageKeys } from '@/configs/localstorageKeys'
import {
  Foundation,
  getFoundationRequest,
} from '@/services/foundations/getFoundationRequest'
import {
  UpdateFoundationReq,
  updateFoundationRequest,
} from '@/services/foundations/updateFoundationRequest'
import { Optional } from '@/shared/types/types/Optional'
import { StatusCode } from '@/shared/types/types/StatusCode'
import localstorageFunctions from '@/utils/localstorageFunctions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseFoundationProps {
  projectId?: string
}

interface FoundationQueryData {
  foundation: Foundation | null
}

export function useFoundation({ projectId }: UseFoundationProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery<
    unknown,
    Error,
    FoundationQueryData
  >({
    queryKey: [`projects:${projectId}:foundation`],
    queryFn: async () => {
      if (!projectId) {
        return {
          foundation: null,
        }
      }

      const response = await getFoundationRequest({
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
        const { foundation } = response.data

        if (foundation) {
          localstorageFunctions.Set(
            getTempPersistenceKey('foundation'),
            foundation.foundation,
          )

          localstorageFunctions.Set(
            getTempPersistenceKey('whereHappens'),
            foundation.whereHappens,
          )

          localstorageFunctions.Set(
            getTempPersistenceKey('whoHappens'),
            foundation.whoHappens,
          )

          localstorageFunctions.Set(
            getTempPersistenceKey('whatHappens'),
            foundation.whatHappens,
          )

          localstorageFunctions.Set(
            getTempPersistenceKey('whyHappens'),
            foundation.whyHappens,
          )
        }

        return {
          foundation,
        }
      }

      return {
        foundation: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const foundation = data?.foundation ?? null

  const { mutateAsync: updateFoundation } = useMutation<
    void,
    Error,
    Optional<UpdateFoundationReq, 'projectId' | 'foundationId'>
  >({
    mutationFn: async (variables) => {
      if (!projectId || !foundation) return

      const response = await updateFoundationRequest({
        foundationId: foundation.id,
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
      {
        whoHappens,
        whatHappens,
        whereHappens,
        foundation: foundationText,
        whyHappens,
      },
    ) => {
      queryClient.setQueryData(
        [`projects:${projectId}:foundation`],
        (cachedData: FoundationQueryData) => {
          return {
            foundation: {
              projectId: cachedData.foundation?.projectId,
              id: cachedData.foundation?.id,
              createdAt: cachedData.foundation?.createdAt,
              updatedAt: cachedData.foundation?.updatedAt,
              whoHappens:
                whoHappens === undefined
                  ? cachedData.foundation?.whoHappens
                  : whoHappens,
              whatHappens:
                whatHappens === undefined
                  ? cachedData.foundation?.whatHappens
                  : whatHappens,
              whereHappens:
                whereHappens === undefined
                  ? cachedData.foundation?.whereHappens
                  : whereHappens,
              foundation:
                foundationText === undefined
                  ? cachedData.foundation?.foundation
                  : foundationText,
              whyHappens:
                whyHappens === undefined
                  ? cachedData.foundation?.whyHappens
                  : whyHappens,
            },
          }
        },
      )
    },
  })

  function getTempPersistenceKey(
    to:
      | 'foundation'
      | 'whoHappens'
      | 'whatHappens'
      | 'whereHappens'
      | 'whyHappens',
  ) {
    return `${LocalStorageKeys.EDITOR_TEMP_PERSISTENCE}:projects:${projectId}:foundation:${to}` as LocalStorageKeys
  }

  function getTempPersistence(
    to:
      | 'foundation'
      | 'whoHappens'
      | 'whatHappens'
      | 'whereHappens'
      | 'whyHappens',
  ) {
    const value = localstorageFunctions.Get<string>(getTempPersistenceKey(to))
    return value ?? ''
  }

  return {
    foundation,
    isLoadingFoundation: isLoading,
    refetchFoundation: refetch,
    updateFoundation,
    getTempPersistenceKey,
    getTempPersistence,
  }
}
