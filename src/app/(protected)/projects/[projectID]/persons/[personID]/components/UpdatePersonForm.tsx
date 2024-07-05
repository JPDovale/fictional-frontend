import { useToast } from '@/components/ui/use-toast'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { PersonType } from '@/services/persons/getPersonRequest'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'
import imageCompression from 'browser-image-compression'
import { NotFound } from '@/components/application/NotFound'
import { Input } from '@/components/application/Input'
import { DropZone } from '@/components/application/DropZone'
import { EventDateInput } from '@/components/timelines/EventDateInput'
import { PersonsSelect } from '@/components/persons/PersonsSelect'
import { PersonTypeSelect } from '@/components/persons/PersonTypeSelect'
import { Button } from '@/components/application/Button'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { uploadFile } from '@/services/storage/uploadFile'
import { isObject } from 'lodash'
import { updatePersonRequest } from '@/services/persons/updatePersonRequest'

const updatePersonSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255, 'O nome deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),
  fatherId: z.string().trim().uuid().optional().nullable(),
  motherId: z.string().trim().uuid().optional().nullable(),
  birthDateDay: z.coerce.number().max(31, 'Dia inválido').optional().nullable(),
  birthDateMonth: z.coerce
    .number()
    .max(12, 'Mês inválido')
    .optional()
    .nullable(),
  birthDateYear: z.coerce.number().optional().nullable(),
  birthDatePeriod: z.coerce.number().optional().nullable(),
  birthDateHour: z.coerce
    .number()
    .max(23, 'Hora inválida')
    .optional()
    .nullable(),
  birthDateMinute: z.coerce
    .number()
    .max(59, 'Minuto inválido')
    .optional()
    .nullable(),
  birthDateSecond: z.coerce
    .number()
    .max(59, 'Segundo inválido')
    .optional()
    .nullable(),
  deathDateDay: z.coerce.number().max(31, 'Dia inválido').optional().nullable(),
  deathDateMonth: z.coerce
    .number()
    .max(12, 'Mês inválido')
    .optional()
    .nullable(),
  deathDateYear: z.coerce.number().optional().nullable(),
  deathDatePeriod: z.coerce.number().optional().nullable(),
  deathDateHour: z.coerce
    .number()
    .max(23, 'Hora inválida')
    .optional()
    .nullable(),
  deathDateMinute: z.coerce
    .number()
    .max(59, 'Minuto inválido')
    .optional()
    .nullable(),
  deathDateSecond: z.coerce
    .number()
    .max(59, 'Segundo inválido')
    .optional()
    .nullable(),
  type: z
    .nativeEnum(PersonType)
    .default(PersonType.EXTRA)
    .optional()
    .nullable(),
  image: z.string().trim().optional().nullable(),
})

type UpdatePersonData = z.infer<typeof updatePersonSchema>

interface UpdatePersonFormProps {
  onEdited: () => void
}

export function UpdatePersonForm({ onEdited }: UpdatePersonFormProps) {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { projectID, personID } = useParams()
  const projectId = projectID as string
  const personId = personID as string

  const { toast } = useToast()
  const { theme } = useTheme()
  const { project, usePersons, usePerson, useTimelines } = useProject({
    projectId,
  })
  const { refetchPersons } = usePersons()
  const { person, refetchPerson } = usePerson({ personId })
  const { makeEventDate, verifyEventDate } = useTimelines()

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<UpdatePersonData>({
    resolver: zodResolver(updatePersonSchema),
    defaultValues: {
      type: person?.type,
      name: person?.name,
      image: person?.image.url,
      fatherId: person?.fatherId,
      motherId: person?.motherId,
      birthDateDay: person?.birthDate?.day,
      birthDateMonth: person?.birthDate?.month,
      birthDateYear: person?.birthDate?.year,
      birthDatePeriod: person?.birthDate?.period,
      birthDateHour: person?.birthDate?.hour,
      birthDateMinute: person?.birthDate?.minute,
      birthDateSecond: person?.birthDate?.second,
      deathDateDay: person?.deathDate?.day,
      deathDateMonth: person?.deathDate?.month,
      deathDateYear: person?.deathDate?.year,
      deathDatePeriod: person?.deathDate?.period,
      deathDateHour: person?.deathDate?.hour,
      deathDateMinute: person?.deathDate?.minute,
      deathDateSecond: person?.deathDate?.second,
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

  useEffect(() => {
    if (person && person.image.url) {
      setImageUrl(person.image.url ?? '')
    }

    reset()
  }, [person, reset])

  function clearDate(type: 'birth' | 'death') {
    setValue(`${type}DateDay`, null)
    setValue(`${type}DateMonth`, null)
    setValue(`${type}DateYear`, null)
    setValue(`${type}DatePeriod`, null)
    setValue(`${type}DateHour`, null)
    setValue(`${type}DateMinute`, null)
    setValue(`${type}DateSecond`, null)
  }

  async function handleUpdatePerson(data: UpdatePersonData) {
    if (!projectId) return
    if (!personId) return

    if (fatherId === motherId && (fatherId || motherId)) {
      toastError('A mãe deve ser diferente do pai')
      return
    }

    const {
      birthDateDay,
      birthDateMonth,
      birthDateYear,
      birthDatePeriod,
      birthDateHour,
      birthDateMinute,
      birthDateSecond,
      deathDateDay,
      deathDateMonth,
      deathDateYear,
      deathDatePeriod,
      deathDateHour,
      deathDateMinute,
      deathDateSecond,
      ...rest
    } = data

    let birthDate: string | null | undefined
    let deathDate: string | null | undefined

    const verificationOfBirthDateError = verifyEventDate({
      day: birthDateDay,
      month: birthDateMonth,
      year: birthDateYear,
      period: birthDatePeriod,
      hour: birthDateHour,
      minute: birthDateMinute,
      second: birthDateSecond,
    })

    const verificationOfDeathDateError = verifyEventDate({
      day: deathDateDay,
      month: deathDateMonth,
      year: deathDateYear,
      period: deathDatePeriod,
      hour: deathDateHour,
      minute: deathDateMinute,
      second: deathDateSecond,
    })

    if (verificationOfBirthDateError) {
      toastError(verificationOfBirthDateError)
      return
    }

    if (verificationOfDeathDateError) {
      toastError(verificationOfDeathDateError)
      return
    }

    birthDate = makeEventDate({
      day: birthDateDay,
      month: birthDateMonth,
      year: birthDateYear,
      period: birthDatePeriod,
      hour: birthDateHour,
      minute: birthDateMinute,
      second: birthDateSecond,
    })

    deathDate = makeEventDate({
      day: deathDateDay,
      month: deathDateMonth,
      year: deathDateYear,
      period: deathDatePeriod,
      hour: deathDateHour,
      minute: deathDateMinute,
      second: deathDateSecond,
    })

    if (birthDate === person?.birthDate?.date) {
      birthDate = undefined
    }

    if (deathDate === person?.deathDate?.date) {
      deathDate = undefined
    }

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

    const response = await updatePersonRequest({
      personId,
      projectId,
      birthDate,
      deathDate,
      image: imageUrl === null ? null : imageName,
      name: rest.name,
      fatherId,
      motherId,
      type: rest.type ?? undefined,
    })

    if (response.status !== StatusCode.OK) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.OK) {
      toast({
        title: `Personagem alterado(a)`,
        description: `O personagem ${person?.name} foi alterado(a) com sucesso!`,
      })
      refetchPersons()
      refetchPerson()
      onEdited()
      reset()
    }
  }

  function onErrors(errors: FieldErrors<UpdatePersonData>) {
    const errorKeys = Object.keys(errors) as (keyof UpdatePersonData)[]

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

  if (!person || !project) return <NotFound />

  return (
    <form
      data-theme={theme}
      className="flex flex-col bg-gray100/30 data-[theme=light]:bg-gray900/30 relative shadow-2xl backdrop-blur-sm rounded-lg gap-4 p-4"
      onSubmit={handleSubmit(handleUpdatePerson, onErrors)}
    >
      <span className="text-xs absolute top-2 font-bold opacity-60 right-4">
        Apenas o tipo é obrigatório
      </span>

      <div className="flex max-lg:flex-col items-center gap-8">
        <Input.Root className="h-full max-lg:w-full">
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
                onClean={() => clearDate('birth')}
                isWithCleaner
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
                onClean={() => clearDate('death')}
                isWithCleaner
              />
            </>
          )}
          <div className="grid grid-cols-2 gap-4">
            <PersonsSelect
              personSelectedId={fatherId ?? undefined}
              setPersonSelectedId={(id) =>
                setValue('fatherId', id ?? undefined)
              }
              title="Pai"
            />

            <PersonsSelect
              personSelectedId={motherId ?? undefined}
              setPersonSelectedId={(id) =>
                setValue('motherId', id ?? undefined)
              }
              title="Mãe"
            />
          </div>
          <PersonTypeSelect
            typeSelected={personType ?? PersonType.EXTRA}
            setTypeSelected={(type) => setValue('type', type)}
          />
        </div>
      </div>

      <div className="mt-4 w-full flex gap-4">
        <Button.Root
          type="submit"
          size="sm"
          width="full"
          disabled={isSubmitting}
        >
          <Button.Text>Salvar</Button.Text>
        </Button.Root>

        <Button.Root className="w-5 h-5" size="sm" onClick={onEdited}>
          <Button.Icon>
            <X />
          </Button.Icon>
        </Button.Root>
      </div>
    </form>
  )
}
