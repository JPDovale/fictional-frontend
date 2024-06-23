import { Button } from '@/components/application/Button'
import { Input } from '@/components/application/Input'
import { EventDateInput } from '@/components/timelines/EventDateInput'
import { ImportanceLevelSelect } from '@/components/timelines/ImportanceLevelSelect'
import { Dialog, DialogContent, DialogPortal } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useProject } from '@/hooks/useProject'
import { createPersonAttributeMutationRequest } from '@/services/persons/createPersonAttributeMutationRequest'
import { ImportanceLevel } from '@/services/timelines/getTimelineRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'

const createMutationWithEventSchema = z.object({
  dateDay: z.coerce
    .number({ invalid_type_error: 'Dia inválido' })
    .max(31, 'Dia inválido')
    .optional(),
  dateMonth: z.coerce
    .number({ invalid_type_error: 'Mês inválido' })
    .max(12, 'Mês inválido')
    .optional(),
  dateYear: z.coerce.number({ invalid_type_error: 'Ano inválido' }).optional(),
  datePeriod: z.coerce
    .number({ invalid_type_error: 'Periódo inválido' })
    .optional(),
  dateHour: z.coerce.number().max(23, 'Hora inválida').optional(),
  dateMinute: z.coerce.number().max(59, 'Minuto inválido').optional(),
  dateSecond: z.coerce.number().max(59, 'Segundo inválido').optional(),
  importanceLevel: z.coerce
    .number()
    .max(10, 'O nível de importância inválido')
    .optional(),
  title: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9\s._@-\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]+$/,
      'Nome inválido! Evite simbolos.',
    )
    .max(120, 'O título deve ter no maximo 120 caracteres')
    .optional(),
})

type CreateMutationWithEventData = z.infer<typeof createMutationWithEventSchema>

interface CreateAttributeMutationDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function CreateAttributeMutationDialog({
  isOpen,
  setIsOpen,
}: CreateAttributeMutationDialogProps) {
  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateMutationWithEventData>({
    resolver: zodResolver(createMutationWithEventSchema),
    defaultValues: {
      datePeriod: undefined,
    },
  })
  const { toast } = useToast()
  const { usePerson, useTimelines, useFile, project } = useProject({
    projectId,
  })
  const { makeEventDate, verifyEventDate } = useTimelines()
  const { useAttribute } = usePerson({ personId })
  const { attribute, refetchAttribute } = useAttribute({ attributeId })
  const { file } = useFile({ fileId: attribute?.fileId })

  const datePeriod = watch('datePeriod')
  const importanceLevel = watch('importanceLevel')

  async function handleCreateMutation(data: CreateMutationWithEventData) {
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

    const response = await createPersonAttributeMutationRequest({
      attributeId,
      personId,
      projectId,
      title: data.title,
      date: date ?? undefined,
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
      toast({
        title: 'Alteração de atributo criada',
        description: `Alteração de atributo criada com sucesso para "${file?.title}"`,
      })
      refetchAttribute()
      reset()
      setIsOpen(false)
    }
  }

  function onErrors(errors: FieldErrors<CreateMutationWithEventData>) {
    const errorKeys = Object.keys(
      errors,
    ) as (keyof CreateMutationWithEventData)[]

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
      <DialogPortal>
        <DialogContent isToShowClose={false} className="p-4 flex flex-col">
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleSubmit(handleCreateMutation, onErrors)}
          >
            <span className="text-xl font-bold opacity-60">
              Criar alteração com evento
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

            {project?.buildBlocks.TIME_LINES && (
              <>
                <EventDateInput
                  label="Data da alteração"
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
              </>
            )}

            <Button.Root size="xs" type="submit" disabled={isSubmitting}>
              <Button.Text>Criar</Button.Text>
            </Button.Root>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
