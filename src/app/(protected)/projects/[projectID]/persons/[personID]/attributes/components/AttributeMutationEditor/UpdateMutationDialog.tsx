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
import { useProject } from '@/hooks/useProject'
import { Mutation } from '@/services/persons/getPersonAttributeRequest'
import { updatePersonAttributeMutationRequest } from '@/services/persons/updatePersonAttributeMutationRequest'
import { ImportanceLevel } from '@/services/timelines/getTimelineRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'

const createMutationWithEventSchema = z.object({
  dateDay: z.coerce
    .number({ invalid_type_error: 'Dia inválido' })
    .max(31, 'Dia inválido')
    .optional()
    .nullable(),
  dateMonth: z.coerce
    .number({ invalid_type_error: 'Mês inválido' })
    .max(12, 'Mês inválido')
    .optional()
    .nullable(),
  dateYear: z.coerce
    .number({ invalid_type_error: 'Ano inválido' })
    .optional()
    .nullable(),
  datePeriod: z.coerce
    .number({ invalid_type_error: 'Periódo inválido' })
    .optional()
    .nullable(),
  dateHour: z.coerce.number().max(23, 'Hora inválida').optional().nullable(),
  dateMinute: z.coerce
    .number()
    .max(59, 'Minuto inválido')
    .optional()
    .nullable(),
  dateSecond: z.coerce
    .number()
    .max(59, 'Segundo inválido')
    .optional()
    .nullable(),
  importanceLevel: z.coerce
    .number()
    .max(10, 'O nível de importância inválido')
    .nullable()
    .optional(),
  title: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Nome inválido! Evite simbolos.')
    .max(120, 'O título deve ter no maximo 120 caracteres')
    .nullable()
    .optional(),
})

type CreateMutationWithEventData = z.infer<typeof createMutationWithEventSchema>

interface CreateAttributeMutationDialogProps {
  mutation: Mutation
}

export function UpdateMutationDialog({
  mutation,
}: CreateAttributeMutationDialogProps) {
  const [isOpenUpdateMutation, setIsOpenUpdateMutation] = useState(false)

  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateMutationWithEventData>({
    resolver: zodResolver(createMutationWithEventSchema),
    defaultValues: {
      datePeriod: mutation.date?.period,
      dateDay: mutation.date?.day,
      dateMonth: mutation.date?.month,
      dateYear: mutation.date?.year,
      dateHour: mutation.date?.hour,
      dateMinute: mutation.date?.minute,
      dateSecond: mutation.date?.second,
      title: mutation.title,
      importanceLevel: mutation.importanceLevel,
    },
  })

  const { toast } = useToast()
  const { usePerson, useTimelines, project } = useProject({
    projectId,
  })
  const { makeEventDate, verifyEventDate } = useTimelines()
  const { useAttribute } = usePerson({ personId })
  const { refetchAttribute } = useAttribute({ attributeId })

  const datePeriod = watch('datePeriod')
  const importanceLevel = watch('importanceLevel')

  async function handleUpdateMutation(data: CreateMutationWithEventData) {
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

    const response = await updatePersonAttributeMutationRequest({
      personId,
      attributeId,
      projectId,
      date,
      ImportanceLevel: (importanceLevel ?? undefined) as
        | ImportanceLevel
        | undefined,
      title: data.title,
      mutationId: mutation.id,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
      return
    }

    if (response.status === StatusCode.NO_CONTENT) {
      toast({
        title: 'Alteração de atributo editada',
        description: `Alteração de atributo "Alteração ${mutation.position}" ${
          mutation.title ? `- ${mutation.title}` : ''
        } alterada com sucesso!`,
      })
      refetchAttribute()
      setIsOpenUpdateMutation(false)
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

  function clearDate() {
    setValue('dateDay', null)
    setValue('dateMonth', null)
    setValue('dateYear', null)
    setValue('dateHour', null)
    setValue('dateMinute', null)
    setValue('dateSecond', null)
    setValue('datePeriod', null)
  }

  return (
    <Dialog open={isOpenUpdateMutation} onOpenChange={setIsOpenUpdateMutation}>
      <DialogTrigger asChild>
        <Button.Root className="shadow-none " size="xs">
          <Button.Icon>
            <Pencil />
          </Button.Icon>
        </Button.Root>
      </DialogTrigger>

      <DialogPortal>
        <DialogContent className="p-4 flex flex-col">
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={handleSubmit(handleUpdateMutation, onErrors)}
          >
            <span className="text-xl font-bold opacity-60">
              Atualizar alteração {mutation.position}{' '}
              {mutation.title && `- ${mutation.title}`}
            </span>

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
                  onClean={clearDate}
                  isWithCleaner
                />

                <ImportanceLevelSelect
                  label="Nível de importância do evento"
                  importanceLevel={importanceLevel}
                  setImportanceLevel={(i) => setValue('importanceLevel', i)}
                />
              </>
            )}

            <Button.Root size="xs" type="submit" disabled={isSubmitting}>
              <Button.Text>Salvar</Button.Text>
            </Button.Root>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
