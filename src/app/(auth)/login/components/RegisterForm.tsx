import { Button } from '@/components/application/Button'
import { Input } from '@/components/application/Input'
import { Envelope, GoogleLogo } from '@phosphor-icons/react'
import { Key, LogIn, User } from 'lucide-react'
import { FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { createUserRequest } from '@/services/users/createUserReqeust'
import { StatusCode } from '@/shared/types/types/StatusCode'

const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Nome inválido! Evite simbolos.')
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(255, 'O nome deve ter no maximo 255 caracteres'),
  email: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Email inválido! Evite simbolos.')
    .email('Email inválido'),
  password: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Senha inválida! Evite simbolos.')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(255, 'A senha deve ter no maximo 255 caracteres'),
  confirmPassword: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s._@\-À-ÿ]+$/, 'Senha inválida! Evite simbolos.')
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(255, 'A senha deve ter no maximo 255 caracteres'),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

interface RegisterFormProps {
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
  handleLoginWithGoogle: () => Promise<void>
}

export function RegisterForm({
  isLogin,
  setIsLogin,
  handleLoginWithGoogle,
}: RegisterFormProps) {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  async function handleCreateUser(data: RegisterFormData) {
    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Erro no formulário',
        description: 'As senhas devem ser iguais',
        variant: 'destructive',
      })
      return
    }

    const response = await createUserRequest(data)

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.CREATED) {
      setIsLogin(true)
      toast({
        title: 'Sucesso',
        description:
          'Registro efetuado com sucesso! Faça o login para acessar seus projetos',
      })
      reset()
    }
  }

  function onErrors(errors: FieldErrors<RegisterFormData>) {
    const errorKeys = Object.keys(errors) as (keyof RegisterFormData)[]

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
    <form
      onSubmit={handleSubmit(handleCreateUser, onErrors)}
      data-is-login={isLogin}
      className="h-full w-full max-lg:w-screen flex flex-col py-4 px-20 justify-center max-sm:px-4 max-lg:px-10 items-center data-[is-login=true]:translate-x-[100%] max-lg:data-[is-login=false]:-translate-x-[50%] max-lg:data-[is-login=true]:translate-x-[150%] ease-in-out duration-150"
    >
      <div className="flex flex-col w-full gap-2">
        <span className="text-3xl font-bold opacity-60 mb-4">Registro</span>

        <Input.Root>
          <Input.Header>
            <Input.Label>Nome</Input.Label>
          </Input.Header>

          <Input.Input>
            <Input.Icon>
              <User />
            </Input.Icon>
            <Input.TextInput {...register('name')} />
          </Input.Input>
        </Input.Root>

        <Input.Root>
          <Input.Header>
            <Input.Label>Email</Input.Label>
          </Input.Header>

          <Input.Input>
            <Input.Icon>
              <Envelope />
            </Input.Icon>
            <Input.TextInput {...register('email')} />
          </Input.Input>
        </Input.Root>

        <Input.Root>
          <Input.Header>
            <Input.Label>Senha</Input.Label>
          </Input.Header>

          <Input.Input>
            <Input.Icon>
              <Key />
            </Input.Icon>
            <Input.TextInput type="password" {...register('password')} />
          </Input.Input>
        </Input.Root>

        <Input.Root>
          <Input.Header>
            <Input.Label>Confirmar senha</Input.Label>
          </Input.Header>

          <Input.Input>
            <Input.Icon>
              <Key />
            </Input.Icon>
            <Input.TextInput type="password" {...register('confirmPassword')} />
          </Input.Input>
        </Input.Root>

        <span className="text-xs opacity-60 mt-2">
          Ao se registrar, concordo com os{' '}
          <Link href="/terms" className="underline text-violet-500">
            termos de uso e condicoes
          </Link>{' '}
          do site.
        </span>
        <Button.Root
          disabled={isSubmitting}
          type="submit"
          // onClick={handleCreateLimitedUser}
        >
          <Button.Icon>
            <LogIn />
          </Button.Icon>

          <Button.Text>Executar registro</Button.Text>
        </Button.Root>

        <button
          className="font-bold opacity-60 hover:text-violet-500 text-sm mt-2"
          type="button"
          onClick={() => setIsLogin(true)}
        >
          Já tenho registro!
        </button>

        <hr className="w-full opacity-30 py-1" />
        <Button.Root type="button" onClick={handleLoginWithGoogle}>
          <Button.Icon>
            <GoogleLogo />
          </Button.Icon>

          <Button.Text>Login com o Google</Button.Text>
        </Button.Root>
      </div>
    </form>
  )
}
