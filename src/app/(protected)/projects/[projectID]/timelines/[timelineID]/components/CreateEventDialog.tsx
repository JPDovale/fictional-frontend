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
import { useUser } from '@/hooks/useUser'
import { createEventRequest } from '@/services/timelines/createEventRequest'
import { ImportanceLevel } from '@/services/timelines/getTimelineRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { FaCrown } from 'react-icons/fa6'
import { z } from 'zod'

const createEventSchema = z.object({
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

type CreateEventData = z.infer<typeof createEventSchema>

export function CreateEventDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const { projectId, timelineId } = useParams()

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateEventData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      datePeriod: undefined,
      importanceLevel: 1,
    },
  })
  const { toast } = useToast()
  const { useTimelines, useTimeline } = useProject({
    projectId,
  })
  const { makeEventDate, verifyEventDate } = useTimelines()
  const { timeline, refetchTimeline } = useTimeline({ timelineId })
  const { user } = useUser()

  const datePeriod = watch('datePeriod')
  const importanceLevel = watch('importanceLevel')

  async function handleCreateEvent(data: CreateEventData) {
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

    const response = await createEventRequest({
      projectId,
      timelineId,
      event: data.event,
      title: data.title,
      date: date as string,
      importanceLevel: data.importanceLevel as ImportanceLevel,
    })

    if (response.status !== StatusCode.CREATED) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.CREATED) {
      refetchTimeline()
      toast({
        title: 'Evento criado',
        description: `Event criado com sucesso para "${timeline?.name}"`,
      })
      reset()
      setIsOpen(false)
    }
  }

  function onErrors(errors: FieldErrors<CreateEventData>) {
    const errorKeys = Object.keys(errors) as (keyof CreateEventData)[]

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
        <Button.Root size="sm">
          <Button.Icon>
            <Plus />
          </Button.Icon>
        </Button.Root>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent isToShowClose={false} className="p-4 flex flex-col">
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleSubmit(handleCreateEvent, onErrors)}
          >
            <span className="text-xl font-bold opacity-60">Criar evento</span>

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

            <Button.Root
              size="xs"
              type="submit"
              disabled={
                isSubmitting ||
                ((timeline?.events.length ?? 0) >= 20 && !user?.isSubscriber)
              }
            >
              <Button.Text>Criar</Button.Text>
              {(timeline?.events.length ?? 0) >= 20 && !user?.isSubscriber && (
                <Button.Icon>
                  <FaCrown className="fill-importance5" />
                </Button.Icon>
              )}
            </Button.Root>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
