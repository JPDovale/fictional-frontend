import { useToast } from '@/components/ui/use-toast'
import { getTimelinesRequest } from '@/services/timelines/getTimelinesRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { maxDayForMonthsMapper } from '@/utils/maxDaysForMonthsMapper'
import { verifyIsLeapYear } from '@/utils/verifyIsLeepYear'
import { useQuery } from '@tanstack/react-query'

interface UseTimelinesProps {
  projectId?: string
}

export function useTimelines({ projectId }: UseTimelinesProps) {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}:timelines`],
    queryFn: async () => {
      if (!projectId) {
        return {
          timelines: [],
        }
      }

      const response = await getTimelinesRequest({
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
          timelines: response.data.timelines,
        }
      }

      return {
        timelines: [],
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  function verifyEventDate(props: {
    day?: number | null
    month?: number | null
    year?: number | null
    hour?: number | null
    minute?: number | null
    second?: number | null
    period?: number | null
  }): string | null {
    let day: number | null = null
    let month: number | null = null
    let year: number | null = null
    let period: -1 | 0 | null = null
    let hour: number | null = null
    let minute: number | null = null
    let second: number | null = null

    if (props.day && props.day !== 0) day = props.day
    if (props.month && props.month !== 0) month = props.month
    if (props.year && props.year !== 0) year = props.year
    if (props.period === -1 || props.period === 0) period = props.period
    if (props.hour) hour = props.hour
    if (props.minute) minute = props.minute
    if (props.second) second = props.second

    if (!!day || !!month || !!year || !!hour || !!minute || !!second) {
      if (!day || !month || !year) {
        return 'Ao preencher um campo da data, os campo "Dia", "Mês", "Ano" e "Periodo" devem ser preenchidos"'
      }

      if (period !== -1 && period !== 0) return 'Periodo inválido'
      if (day && day <= 0) return 'Dia inválido'
      if (month && month <= 0) return 'Mes inválido'
      if (year && year <= 0) return 'Ano inválido'
      if (hour && hour < 0) return 'Hora inválido'
      if (minute && minute < 0) return 'Minuto inválido'
      if (second && second < 0) return 'Segundo inválido'

      if (month === 2) {
        const isLeapYear = verifyIsLeapYear(year!)

        if (isLeapYear && day! > 29) return 'Dia inválido'
        if (!isLeapYear && day! > 28) return 'Dia inválido'
      } else {
        const daysInMonth = maxDayForMonthsMapper[month!]

        if (day! > daysInMonth) return 'Dia inválido'
      }
    }

    return null
  }

  function makeEventDate({
    day,
    month,
    year,
    hour,
    minute,
    second,
    period,
  }: {
    day?: number | null
    month?: number | null
    year?: number | null
    hour?: number | null
    minute?: number | null
    second?: number | null
    period?: number | null
  }): string | null {
    if (
      day === 0 ||
      month === 0 ||
      year === 0 ||
      (period !== -1 && period !== 0)
    ) {
      return null
    }

    return `${day}:${month}:${year}:${period}:${hour ?? 0}:${minute ?? 0}:${
      second ?? 0
    }`
  }

  return {
    timelines: data?.timelines ?? [],
    isLoading,
    refetchTimelines: refetch,
    verifyEventDate,
    makeEventDate,
  }
}
