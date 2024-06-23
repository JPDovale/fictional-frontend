'use client'
import { Button } from '@/components/application/Button'
import { Checkbox } from '@/components/application/Checkbox'
import { DropZone } from '@/components/application/DropZone'
import { Input } from '@/components/application/Input'
import { useToast } from '@/components/ui/use-toast'
import { useProjects } from '@/hooks/useProjects'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { Buildings } from '@phosphor-icons/react'
import { Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'
import imageCompression from 'browser-image-compression'
import { createProjectRequest } from '@/services/projects/createProjectRequest'
import { uploadFile } from '@/services/storage/uploadFile'
import { isObject } from 'lodash'

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Nome inválido! Evite simbolos.')
    .min(3, 'O nome precisa ter pelo menos 3 letras')
    .max(255, 'O nome pode ter no máximo 255 letras'),
  buildBlocks: z
    .array(z.nativeEnum(BuildBlock))
    .default([
      BuildBlock.FOUNDATION,
      BuildBlock.PERSONS,
      BuildBlock.TIME_LINES,
    ]),
  image: z.string().trim().optional(),
})

type CreateProjectData = z.infer<typeof createProjectSchema>

export default function NewProjectPage() {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const navigate = useRouter()

  const { refetchProjects } = useProjects()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    watch,
    reset,
  } = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      buildBlocks: [
        BuildBlock.FOUNDATION,
        BuildBlock.PERSONS,
        BuildBlock.TIME_LINES,
      ],
    },
  })

  const buildBlocks = watch('buildBlocks')

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

  // function addBuildBlock(buildBlock: BuildBlock) {
  //   setValue('buildBlocks', [...buildBlocks, buildBlock]);
  // }
  //
  // function removeBuildBlock(buildBlock: BuildBlock) {
  //   setValue(
  //     'buildBlocks',
  //     buildBlocks.filter((bb) => bb !== buildBlock)
  //   );
  // }

  // function handleToggleBuildBlock(buildBlock: BuildBlock, event: boolean) {
  //   if (event) {
  //     return addBuildBlock(buildBlock);
  //   }
  //
  //   return removeBuildBlock(buildBlock);
  // }

  async function handleCreateProject(data: CreateProjectData) {
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

    const response = await createProjectRequest({
      name: data.name,
      buildBlocks: data.buildBlocks,
      image: imageName,
    })

    if (response.status !== StatusCode.CREATED) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.CREATED) {
      await refetchProjects()
      toast({
        title: 'Projeto criado com sucesso',
        description: `O projeto ${data.name} foi criado com sucesso!`,
      })

      reset()
      navigate.push('/projects')
    }
  }

  function onErrors(errors: FieldErrors<CreateProjectData>) {
    const errorKeys = Object.keys(errors) as (keyof CreateProjectData)[]

    const firstError = errors[errorKeys[0]]

    if (firstError) {
      toast({
        title: 'Erro no formulário',
        description: firstError.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <main className="max-w-6xl mx-auto py-4 h-full flex-col flex w-full">
      <h3 className="text-2xl font-bold font-body px-4 opacity-60">
        Criar um novo projeto
      </h3>

      <form
        className="mt-4 grid grid-cols-2 gap-14 h-full"
        onSubmit={handleSubmit(handleCreateProject, onErrors)}
      >
        <Input.Root className="px-4">
          <Input.Header>
            <Input.Header>
              <Input.Label>Selecione uma imagem</Input.Label>
            </Input.Header>
          </Input.Header>

          <DropZone
            className="h-72 w-full"
            onDrop={handleSelectImage}
            onClear={handleDeleteImage}
            objectSelected={imageUrl ?? ''}
          />

          <Button.Root
            className="mt-4"
            size="sm"
            type="submit"
            disabled={!isDirty || isSubmitting}
          >
            <Button.Text>Criar</Button.Text>
          </Button.Root>
        </Input.Root>

        <div className="flex flex-col gap-4 max-h-full h-full overflow-y-auto px-4">
          <Input.Root>
            <Input.Header>
              <Input.Label>Nome do projeto</Input.Label>
            </Input.Header>

            <Input.Input>
              <Input.TextInput {...register('name')} />
            </Input.Input>
          </Input.Root>

          <Input.Root>
            <Input.Header>
              <Input.Label>Blocos de construção</Input.Label>
            </Input.Header>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <Checkbox.Root>
                <Checkbox.CheckerRoot
                  disabled
                  checked={buildBlocks.includes(BuildBlock.FOUNDATION)}
                  // onCheckedChange={(e) =>
                  //   handleToggleBuildBlock(
                  //     BuildBlock.FOUNDATION,
                  //     e as unknown as boolean
                  //   )
                  // }
                >
                  <Checkbox.CheckerIndicator />
                </Checkbox.CheckerRoot>

                <Checkbox.Label>Fundação</Checkbox.Label>

                <Checkbox.Icon>
                  <Buildings />
                </Checkbox.Icon>
              </Checkbox.Root>

              <Checkbox.Root>
                <Checkbox.CheckerRoot
                  disabled
                  checked={buildBlocks.includes(BuildBlock.PERSONS)}
                  // onCheckedChange={(e) =>
                  //   handleToggleBuildBlock(
                  //     BuildBlock.PERSONS,
                  //     e as unknown as boolean
                  //   )
                  // }
                >
                  <Checkbox.CheckerIndicator />
                </Checkbox.CheckerRoot>

                <Checkbox.Label>Personagens</Checkbox.Label>

                <Checkbox.Icon>
                  <Users />
                </Checkbox.Icon>
              </Checkbox.Root>

              <Checkbox.Root>
                <Checkbox.CheckerRoot
                  checked={buildBlocks.includes(BuildBlock.TIME_LINES)}
                  disabled
                  // onCheckedChange={(e) =>
                  //   handleToggleBuildBlock(
                  //     BuildBlock.TIME_LINES,
                  //     e as unknown as boolean
                  //   )
                  // }
                >
                  <Checkbox.CheckerIndicator />
                </Checkbox.CheckerRoot>

                <Checkbox.Label>Linhas de tempo</Checkbox.Label>

                <Checkbox.Icon>
                  <Clock />
                </Checkbox.Icon>
              </Checkbox.Root>
            </div>
          </Input.Root>
        </div>
      </form>
    </main>
  )
}
