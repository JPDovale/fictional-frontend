import { useQuery } from '@tanstack/react-query'
import { useProjectHeader } from './useProjectHeader'
import { useFoundation } from './useFoundation'
import { usePersons } from './persons/usePersons'
import { usePersonsAttributes } from './persons/usePersonsAttributes'
import { useFile } from './useFile'
import { usePerson } from './persons/usePerson'
import { useTimelines } from './useTimelines'
import { useTimeline } from './useTimeline'
import { useProjects } from './useProjects'
import { useDeletingPerson } from './persons/useDeletingPerson'
import { useDeletingPersonAttribute } from './persons/useDeletingPersonAttribute'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { getProjectRequest } from '@/services/projects/getProjectRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { deleteProjectRequest } from '@/services/projects/deleteProjectRequest'

interface UseProjectProps {
  projectId?: string
}

export function useProject({ projectId }: UseProjectProps) {
  const { refetchProjects } = useProjects()
  const { toast } = useToast()

  const navigate = useRouter()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}`],
    queryFn: async () => {
      if (!projectId) {
        return {
          project: null,
        }
      }

      const response = await getProjectRequest({ projectId })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        return {
          project: response.data.project,
        }
      }

      return {
        project: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const project = data?.project ?? null

  async function deleteProject() {
    if (!projectId) return

    const response = await deleteProjectRequest({
      projectId,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.NO_CONTENT) {
      await refetchProjects()
      toast({
        title: 'Projecto movido para lixeira',
        description: `O projeto ${project?.name} foi movido para lixeira.`,
      })

      navigate.push('/projects')
    }
  }

  return {
    project,
    isLoadingProject: isLoading,
    refetchProject: refetch,
    deleteProject,
    useHeader: useProjectHeader,
    useFoundation: () => useFoundation({ projectId }),
    usePersons: () => usePersons({ projectId }),
    usePersonsAttributes: () => usePersonsAttributes({ projectId }),
    useFile: ({ fileId }: { fileId?: string }) =>
      useFile({ fileId, projectId }),
    usePerson: ({ personId }: { personId?: string }) =>
      usePerson({ projectId, personId }),
    useTimelines: () => useTimelines({ projectId }),
    useTimeline: ({ timelineId }: { timelineId?: string }) =>
      useTimeline({ timelineId, projectId }),
    useDeletingPerson: () => useDeletingPerson({ projectId }),
    useDeletingPersonAttribute: () => useDeletingPersonAttribute({ projectId }),
  }
}
