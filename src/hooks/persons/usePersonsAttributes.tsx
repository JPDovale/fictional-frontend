import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { getAttributesPreviewRequest } from '@/services/persons/getAttributesPreviweRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'

interface UsePersonsAttributesPreviewProps {
  projectId?: string
}

export function usePersonsAttributes({
  projectId,
}: UsePersonsAttributesPreviewProps) {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}:persons:attributes`],
    queryFn: async () => {
      if (!projectId) {
        return {
          attributes: [],
        }
      }

      const response = await getAttributesPreviewRequest({
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
        return {
          attributes: response.data.attributes,
        }
      }

      return {
        attributes: [],
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    attributes: data?.attributes ?? [],
    isLoading,
    refetchAttributes: refetch,
  }
}
