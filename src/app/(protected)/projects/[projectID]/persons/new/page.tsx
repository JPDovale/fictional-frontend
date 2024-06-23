'use client'
import { useToast } from '@/components/ui/use-toast'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { PersonType } from '@/services/persons/getPersonRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'
import imageCompression from 'browser-image-compression'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { NotFound } from '@/components/application/NotFound'
import { Input } from '@/components/application/Input'
import { DropZone } from '@/components/application/DropZone'
import { EventDateInput } from '@/components/timelines/EventDateInput'
import { Button } from '@/components/application/Button'
import { createPersonRequest } from '@/services/persons/createPersonRequest'
import { PersonTypeSelect } from '@/components/persons/PersonTypeSelect'
import { PersonsSelect } from '@/components/persons/PersonsSelect'
import { uploadFile } from '@/services/storage/uploadFile'
import { isObject } from 'lodash'

const createPersonSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@-]+$/, 'Nome inválido! Evite simbolos.')
    .max(255, 'O nome deve ter no máximo 255 caracteres')
    .optional(),
  fatherId: z.string().trim().uuid().optional(),
  motherId: z.string().trim().uuid().optional(),
  birthDateDay: z.coerce.number().max(31, 'Dia inválido').optional(),
  birthDateMonth: z.coerce.number().max(12, 'Mês inválido').optional(),
  birthDateYear: z.coerce.number().optional(),
  birthDatePeriod: z.coerce.number().optional(),
  birthDateHour: z.coerce.number().max(23, 'Hora inválida').optional(),
  birthDateMinute: z.coerce.number().max(59, 'Minuto inválido').optional(),
  birthDateSecond: z.coerce.number().max(59, 'Segundo inválido').optional(),
  deathDateDay: z.coerce.number().max(31, 'Dia inválido').optional(),
  deathDateMonth: z.coerce.number().max(12, 'Mês inválido').optional(),
  deathDateYear: z.coerce.number().optional(),
  deathDatePeriod: z.coerce.number().optional(),
  deathDateHour: z.coerce.number().max(23, 'Hora inválida').optional(),
  deathDateMinute: z.coerce.number().max(59, 'Minuto inválido').optional(),
  deathDateSecond: z.coerce.number().max(59, 'Segundo inválido').optional(),
  type: z.nativeEnum(PersonType).default(PersonType.EXTRA),
  image: z.string().trim().optional(),
})

type CreatePersonData = z.infer<typeof createPersonSchema>

export default function ProjectNewPersonPage() {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { projectID } = useParams()
  const projectId = projectID as string

  const { toast } = useToast()
  const { theme } = useTheme()
  const { usePersons, project, useTimelines } = useProject({ projectId })
  const { refetchPersons } = usePersons()
  const { verifyEventDate, makeEventDate } = useTimelines()

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<CreatePersonData>({
    resolver: zodResolver(createPersonSchema),
    defaultValues: {
      type: PersonType.EXTRA,
      birthDatePeriod: undefined,
      deathDatePeriod: undefined,
    },
  })

  const personType = watch('type')
  const birthDatePeriod = watch('birthDatePeriod')
  const deathDatePeriod = watch('deathDatePeriod')
  const fatherId = watch('fatherId')
  const motherId = watch('motherId')

  async function handleSelectImage(files: File[]) {
    const image = files[0]

    if (!image) return

    if (image.type === 'image/gif') {
      setImage(image)
      setImageUrl(URL.createObjectURL(image))
      return
    }

    try {
      const compressedFileObject = await imageCompression(image, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: 0.3,
      })

      setImage(compressedFileObject)
      setImageUrl(URL.createObjectURL(compressedFileObject))
    } catch (error) {
      toast({
        title: 'Erro ao carregar imagem',
        description: 'Por favor, tente novamente',
        variant: 'destructive',
      })
    }
  }

  function handleDeleteImage() {
    setImageUrl(null)
    setImage(null)
  }

  async function handleCreatePerson(data: CreatePersonData) {
    if (fatherId === motherId && (fatherId || motherId)) {
      toastError('A mãe deve ser diferente do pai')
      return
    }

    const verificationOfBirthDateError = verifyEventDate({
      day: data.birthDateDay,
      month: data.birthDateMonth,
      year: data.birthDateYear,
      period: data.birthDatePeriod,
      hour: data.birthDateHour,
      minute: data.birthDateMinute,
      second: data.birthDateSecond,
    })

    const verificationOfDeathDateError = verifyEventDate({
      day: data.deathDateDay,
      month: data.deathDateMonth,
      year: data.deathDateYear,
      period: data.deathDatePeriod,
      hour: data.deathDateHour,
      minute: data.deathDateMinute,
      second: data.deathDateSecond,
    })

    if (verificationOfBirthDateError) {
      toastError(verificationOfBirthDateError)
      return
    }

    if (verificationOfDeathDateError) {
      toastError(verificationOfDeathDateError)
      return
    }

    const birthDate: string | undefined =
      makeEventDate({
        day: data.birthDateDay,
        month: data.birthDateMonth,
        year: data.birthDateYear,
        period: data.birthDatePeriod,
        hour: data.birthDateHour,
        minute: data.birthDateMinute,
        second: data.birthDateSecond,
      }) ?? undefined

    const deathDate: string | undefined =
      makeEventDate({
        day: data.deathDateDay,
        month: data.deathDateMonth,
        year: data.deathDateYear,
        period: data.deathDatePeriod,
        hour: data.deathDateHour,
        minute: data.deathDateMinute,
        second: data.deathDateSecond,
      }) ?? undefined

    let imageName: string | undefined

    if (image) {
      const response = await uploadFile(image)

      if (isObject(response)) {
        toast({
          ...response,
          variant: 'destructive',
        })
        return
      }

      imageName = response
    }

    const response = await createPersonRequest({
      name: data.name,
      fatherId,
      motherId,
      birthDate,
      deathDate,
      image: imageName,
      projectId,
      type: data.type,
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
        title: 'Personagem criado(a) com sucesso',
        description: `O personagem ${data.name} foi criado(a) com sucesso!`,
      })

      reset()
      setImage(null)
      setImageUrl(null)
      refetchPersons()
    }
  }

  function onErrors(errors: FieldErrors<CreatePersonData>) {
    const errorKeys = Object.keys(errors) as (keyof CreatePersonData)[]

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

  if (!project?.buildBlocks.PERSONS) {
    return <NotFound />
  }

  return (
    <main className="flex flex-col max-w-3xl w-full mx-auto -mt-24 py-4">
      <h2 className="text-3xl font-bold mb-4">Novo(a) Personagem</h2>

      <form
        data-theme={theme}
        className="flex flex-col bg-gray100/30 data-[theme=light]:bg-gray900/30 relative shadow-2xl backdrop-blur-sm rounded-lg gap-4 p-4"
        onSubmit={handleSubmit(handleCreatePerson, onErrors)}
      >
        <span className="text-xs absolute top-2 font-bold opacity-60 right-4">
          Apenas o tipo é obrigatório
        </span>

        <div className="flex items-center gap-8">
          <Input.Root className="h-full">
            <Input.Header>
              <Input.Header>
                <Input.Label>Imagem</Input.Label>
              </Input.Header>
            </Input.Header>

            <DropZone
              className="h-48 w-48 rounded-full text-center text-xs my-auto"
              onDrop={handleSelectImage}
              onClear={handleDeleteImage}
              objectSelected={imageUrl ?? ''}
            />
          </Input.Root>

          <div className="flex flex-col gap-4 w-full">
            <Input.Root>
              <Input.Header>
                <Input.Label>Nome completo</Input.Label>
              </Input.Header>

              <Input.Input size="sm">
                <Input.TextInput {...register('name')} />
              </Input.Input>
            </Input.Root>

            {project.buildBlocks.TIME_LINES && (
              <>
                <EventDateInput
                  label="Data de nascimento"
                  day={register('birthDateDay')}
                  month={register('birthDateMonth')}
                  year={register('birthDateYear')}
                  hour={register('birthDateHour')}
                  minute={register('birthDateMinute')}
                  second={register('birthDateSecond')}
                  period={birthDatePeriod}
                  setPeriod={(prd) => setValue('birthDatePeriod', prd)}
                />

                <EventDateInput
                  label="Data de óbito"
                  day={register('deathDateDay')}
                  month={register('deathDateMonth')}
                  year={register('deathDateYear')}
                  hour={register('deathDateHour')}
                  minute={register('deathDateMinute')}
                  second={register('deathDateSecond')}
                  period={deathDatePeriod}
                  setPeriod={(prd) => setValue('deathDatePeriod', prd)}
                />
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <PersonsSelect
                personSelectedId={fatherId}
                setPersonSelectedId={(id) =>
                  setValue('fatherId', id ?? undefined)
                }
                title="Pai"
              />

              <PersonsSelect
                personSelectedId={motherId}
                setPersonSelectedId={(id) =>
                  setValue('motherId', id ?? undefined)
                }
                title="Mãe"
              />
            </div>

            <PersonTypeSelect
              typeSelected={personType}
              setTypeSelected={(type) => setValue('type', type)}
            />
          </div>
        </div>

        <Button.Root
          type="submit"
          size="sm"
          className="mt-4"
          disabled={isSubmitting}
        >
          <Button.Icon>
            <UserPlus />
          </Button.Icon>
          <Button.Text>Criar</Button.Text>
        </Button.Root>
      </form>
    </main>
  )
}
