import { Button } from '@/components/application/Button'
import { Input } from '@/components/application/Input'
import { EventDateInput } from '@/components/timelines/EventDateInput'
import { ImportanceLevelSelect } from '@/components/timelines/ImportanceLevelSelect'
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useParams } from '@/hooks/useParams'
import { useProject } from '@/hooks/useProject'
import { ImportanceLevel } from '@/services/timelines/getTimelineRequest'
import { updateEventRequest } from '@/services/timelines/updateEventRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'

const updateEventSchema = z.object({
  dateDay: z.coerce
    .number({ invalid_type_error: 'Dia inválido' })
    .max(31, 'Dia inválido')
    .min(1, 'Dia inválido'),
  dateMonth: z.coerce
    .number({ invalid_type_error: 'Mês inválido' })
    .max(12, 'Mês inválido')
    .min(1, 'Mês inválido'),
  dateYear: z.coerce
    .number({ invalid_type_error: 'Ano inválido' })
    .min(1, 'Ano inválido'),
  datePeriod: z.coerce.number({ invalid_type_error: 'Periódo inválido' }),
  dateHour: z.coerce.number().max(23, 'Hora inválida').optional(),
  dateMinute: z.coerce.number().max(59, 'Minuto inválido').optional(),
  dateSecond: z.coerce.number().max(59, 'Segundo inválido').optional(),
  importanceLevel: z.coerce.number().max(10, 'O nível de importância inválido'),
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Nome inválido! Evite simbolos.')
    .min(1, 'O título deve ser preenchido')
    .max(120, 'O título deve ter no maximo 120 caracteres'),
  event: z.string().trim().min(1, 'O evento deve ser preenchido'),
})

type UpdateEventData = z.infer<typeof updateEventSchema>

interface UpdateEventDialogProps {
  eventId: string
}

export function UpdateEventDialog({ eventId }: UpdateEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { projectId, timelineId } = useParams()

  const { toast } = useToast()
  const { useTimelines, useTimeline } = useProject({
    projectId,
  })
  const { makeEventDate, verifyEventDate } = useTimelines()
  const { timeline, refetchTimeline } = useTimeline({ timelineId })

  const event = timeline?.events.find((e) => e.id === eventId)

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdateEventData>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      datePeriod: event?.dateObject.period,
      dateDay: event?.dateObject.day,
      dateMonth: event?.dateObject.month,
      dateYear: event?.dateObject.year,
      dateHour: event?.dateObject.hour,
      dateMinute: event?.dateObject.minute,
      dateSecond: event?.dateObject.second,
      importanceLevel: event?.importanceLevel,
      event: event?.event,
      title: event?.title,
    },
  })

  const datePeriod = watch('datePeriod')
  const importanceLevel = watch('importanceLevel')

  async function handleCreateEvent(data: UpdateEventData) {
    const errorOfDate = verifyEventDate({
      day: data.dateDay,
      month: data.dateMonth,
      year: data.dateYear,
      period: data.datePeriod,
      hour: data.dateHour,
      minute: data.dateMinute,
      second: data.dateSecond,
    })

    if (errorOfDate) {
      toastError(errorOfDate)
      return
    }

    const date = makeEventDate({
      day: data.dateDay,
      month: data.dateMonth,
      year: data.dateYear,
      period: data.datePeriod,
      hour: data.dateHour,
      minute: data.dateMinute,
      second: data.dateSecond,
    })

    const response = await updateEventRequest({
      projectId,
      timelineId,
      eventId,
      event: data.event,
      title: data.title,
      date: date as string,
      importanceLevel: data.importanceLevel as ImportanceLevel,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.NO_CONTENT) {
      refetchTimeline()
      toast({
        title: 'Evento atualizado',
        description: `Event "${event?.title}" atualizado com sucesso`,
      })
      reset()
      setIsOpen(false)
    }
  }

  function onErrors(errors: FieldErrors<UpdateEventData>) {
    const errorKeys = Object.keys(errors) as (keyof UpdateEventData)[]

    const firstError = errors[errorKeys[0]]

    if (firstError) {
      toastError(firstError.message ?? '')
    }
  }

  function toastError(message: string) {
    toast({
      title: 'Erro no formulário',
      description: message,
      variant: 'destructive',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button.Root size="xxs" className="shadow-none w-4 h-4">
          <Button.Icon>
            <Pencil />
          </Button.Icon>
        </Button.Root>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent isToShowClose={false} className="p-4 flex flex-col">
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleSubmit(handleCreateEvent, onErrors)}
          >
            <span className="text-xl font-bold opacity-60">
              Atualizar evento {event?.title}
            </span>

            <button
              type="button"
              className="absolute right-4 top-4 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>

            <Input.Root>
              <Input.Header>
                <Input.Label>Título</Input.Label>
              </Input.Header>

              <Input.Input size="sm">
                <Input.TextInput {...register('title')} />
              </Input.Input>
            </Input.Root>

            <Input.Root>
              <Input.Header>
                <Input.Label>Evento</Input.Label>
              </Input.Header>

              <Input.Input size="sm">
                <Input.Textarea {...register('event')} />
              </Input.Input>
            </Input.Root>

            <EventDateInput
              label="Data do event"
              day={register('dateDay')}
              month={register('dateMonth')}
              year={register('dateYear')}
              hour={register('dateHour')}
              minute={register('dateMinute')}
              second={register('dateSecond')}
              period={datePeriod}
              setPeriod={(prd) => setValue('datePeriod', prd)}
            />

            <ImportanceLevelSelect
              label="Nível de importância do evento"
              importanceLevel={importanceLevel}
              setImportanceLevel={(i) => setValue('importanceLevel', i)}
            />

            <Button.Root size="xs" type="submit" disabled={isSubmitting}>
              <Button.Text>Atualizar</Button.Text>
            </Button.Root>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
