import { useQuery } from '@tanstack/react-query'
import {
  Attribute,
  getPersonAttributeRequest,
} from '@/services/persons/getPersonAttributeRequest'
import { useToast } from '@/components/ui/use-toast'
import { StatusCode } from '@/shared/types/types/StatusCode'

interface UseAttributeProps {
  projectId?: string
  personId?: string
  attributeId?: string
}

interface AttributeQueryData {
  attribute: Attribute | null
}

export function useAttribute({
  projectId,
  personId,
  attributeId,
}: UseAttributeProps) {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery<
    unknown,
    Error,
    AttributeQueryData
  >({
    queryKey: [
      `projects:${projectId}:persons:${personId}:attributes:${attributeId}`,
    ],
    queryFn: async () => {
      if (!projectId || !personId || !attributeId) {
        return {
          attribute: null,
        }
      }

      const response = await getPersonAttributeRequest({
        projectId,
        personId,
        attributeId,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        const { attribute } = response.data

        return {
          attribute,
        }
      }

      return {
        attribute: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const attribute = data?.attribute ?? null

  return {
    attribute,
    isLoadingAttribute: isLoading,
    refetchAttribute: refetch,
  }
}
