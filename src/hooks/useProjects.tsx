import { useQuery } from '@tanstack/react-query'
import { getProjectsRequest } from '@/services/projects/getProjectsRequest'
import { useToast } from '@/components/ui/use-toast'
import { StatusCode } from '@/shared/types/types/StatusCode'

export function useProjects() {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await getProjectsRequest()

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        return {
          projects: response.data.projects,
        }
      }

      return {
        projects: [],
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    projects: data?.projects ?? [],
    isLoading,
    refetchProjects: refetch,
  }
}
