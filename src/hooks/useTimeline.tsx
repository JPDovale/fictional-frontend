import { useQuery } from '@tanstack/react-query'
import { useTimelineEvents } from './useTimelineEvents'
import { getTimelineRequest } from '@/services/timelines/getTimelineRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { useToast } from '@/components/ui/use-toast'

interface UseTimelineProps {
  projectId?: string
  timelineId?: string
}

export function useTimeline({ projectId, timelineId }: UseTimelineProps) {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}:timelines:${timelineId}`],
    queryFn: async () => {
      if (!projectId || !timelineId) {
        return {
          timeline: null,
        }
      }

      const response = await getTimelineRequest({
        projectId,
        timelineId,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        const { timeline } = response.data

        return {
          timeline,
        }
      }

      return {
        timeline: null,
        attributesThisPerson: [],
      }
    },
    staleTime: 1000,
  })

  const timeline = data?.timeline ?? null

  return {
    timeline,
    isLoadingTimeline: isLoading,
    refetchTimeline: refetch,
    useEvents: () => useTimelineEvents({ events: timeline?.events ?? [] }),
  }
}
