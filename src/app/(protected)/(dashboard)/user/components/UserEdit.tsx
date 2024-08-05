import { Button } from '@/components/application/Button'
import { useToast } from '@/components/ui/use-toast'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { z } from 'zod'
import { DropZone } from '@/components/application/DropZone'
import { FieldErrors, useForm } from 'react-hook-form'
import { Input } from '@/components/application/Input'
import { zodResolver } from '@hookform/resolvers/zod'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { updateUserRequest } from '@/services/users/updateUserReqeust'
import { uploadFile } from '@/services/storage/uploadFile'
import { isObject } from 'lodash'

interface UserViewProps {
  setIsEditing: (newState: boolean) => void
}

const userEditFormSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Nome inválido! Evite simbolos.')
    .max(120, 'O nome deve ter menos de 120 caracteres')
    .optional(),
  email: z.string().trim().email(),
})

type UserEditData = z.infer<typeof userEditFormSchema>

export function UserEdit({ setIsEditing }: UserViewProps) {
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { user, refetchUser } = useUser()
  const { toast } = useToast()

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserEditData>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

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

  function onErrors(errors: FieldErrors<UserEditData>) {
    const errorKeys = Object.keys(errors) as (keyof UserEditData)[]

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

  async function handleUpdateUser(data: UserEditData) {
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

    const response = await updateUserRequest({
      ...data,
      imageUrl: imageUrl === null ? null : imageName,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.NO_CONTENT) {
      toast({
        title: `Usuário alterado`,
        description: `O usuário foi alterado com sucesso!`,
      })
      refetchUser()
      reset()
      setIsEditing(false)
    }
  }

  useEffect(() => {
    if (user && user.imageUrl) {
      setImageUrl(user.imageUrl ?? '')
    }

    reset()
  }, [user, reset])

  return (
    <form onSubmit={handleSubmit(handleUpdateUser, onErrors)}>
      <h3 className="text-2xl font-bold font-body px-4 opacity-60">
        Edita minha conta
      </h3>
      <section className="grid grid-cols-2 mt-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-4 p-4 max-sm:items-center">
          <DropZone
            className="h-64 w-64 rounded-full text-xs max-sm:h-48 max-sm:w-48"
            onDrop={handleSelectImage}
            onClear={handleDeleteImage}
            objectSelected={imageUrl ?? ''}
          />
        </div>

        <div className="flex flex-col gap-4 p-4">
          <Input.Root>
            <Input.Header>
              <Input.Label>Nome</Input.Label>
            </Input.Header>

            <Input.Input size="sm">
              <Input.TextInput {...register('name')} />
            </Input.Input>
          </Input.Root>

          <Input.Root>
            <Input.Header>
              <Input.Label>Email</Input.Label>
            </Input.Header>

            <Input.Input size="sm" disabled={user?.isSocialLogin}>
              <Input.TextInput
                {...register('email')}
                disabled={user?.isSocialLogin}
              />
            </Input.Input>

            {user?.isSocialLogin && (
              <Input.Info className="mt-0 text-xs">
                Não é possivel alterar o email para constas com login social.
              </Input.Info>
            )}
          </Input.Root>

          <div className="grid mt-4 grid-cols-2 gap-4">
            <Button.Root type="submit" size="sm" disabled={isSubmitting}>
              <Button.Text>Salvar</Button.Text>
            </Button.Root>

            <Button.Root
              type="button"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <Button.Text>Cancelar</Button.Text>
            </Button.Root>
          </div>
        </div>
      </section>
    </form>
  )
}
