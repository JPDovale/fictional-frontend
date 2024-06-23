import { Button } from '@/components/application/Button'
import { Input } from '@/components/application/Input'
import { useToast } from '@/components/ui/use-toast'
import { CookiesKeys, useCookies } from '@/hooks/useCookies'
import { useUser } from '@/hooks/useUser'
import { connection } from '@/services/fcapi/axios'
import { loginUserRequest } from '@/services/users/loginUserReqeust'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { zodResolver } from '@hookform/resolvers/zod'
import { Envelope, GoogleLogo } from '@phosphor-icons/react'
import { Key, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FieldErrors, useForm } from 'react-hook-form'
import { z } from 'zod'

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9\s._@\-À-ÿ]+$/,
      'Email inválido! Evite simbolos.',
    )
    .email('Email inválido'),
  password: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9\s._@\-À-ÿ]+$/,
      'Senha inválida! Evite simbolos.',
    )
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(255, 'A senha deve ter no maximo 255 caracteres'),
})

type LoginFormData = z.infer<typeof loginFormSchema>

interface LoginFormProps {
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
  handleLoginWithGoogle: () => Promise<void>
}

export function LoginForm({
  isLogin,
  setIsLogin,
  handleLoginWithGoogle,
}: LoginFormProps) {
  const navigate = useRouter()

  const { refetchUser } = useUser()
  const { toast } = useToast()
  const { set } = useCookies()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  async function handleLoginUser(data: LoginFormData) {
    const response = await loginUserRequest(data)

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.CREATED && response.data) {
      setIsLogin(true)
      set(CookiesKeys.REFRESH, response.data.refreshToken)
      set(CookiesKeys.TOKEN, response.data.accessToken)
      connection.setDefaultBearerToken(response.data.accessToken)

      await refetchUser()
      reset()

      navigate.push('/projects')
    }
  }

  function onErrors(errors: FieldErrors<LoginFormData>) {
    const errorKeys = Object.keys(errors) as (keyof LoginFormData)[]

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
      onSubmit={handleSubmit(handleLoginUser, onErrors)}
      data-is-login={isLogin}
      className="h-full w-full flex flex-col py-4 px-20 justify-center items-center data-[is-login=true]:translate-x-[100%] ease-in-out duration-150"
    >
      <div className="flex flex-col w-full gap-2">
        <span className="text-3xl font-bold opacity-60 mb-4">Entrar</span>

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

        <Button.Root
          type="submit"
          className="mt-2"
          disabled={isSubmitting}
          // onClick={handleCreateLimitedUser}
        >
          <Button.Icon>
            <LogIn />
          </Button.Icon>

          <Button.Text>Entrar</Button.Text>
        </Button.Root>

        <button
          className="font-bold opacity-60 hover:text-violet-600 text-sm mt-2"
          type="button"
          onClick={() => setIsLogin(false)}
        >
          Não tenho registro!
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
