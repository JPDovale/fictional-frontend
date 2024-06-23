'use client'
import { useTheme } from '@/hooks/useTheme'
import { mainStyles } from '@/styles/theme'
import { useEffect, useState } from 'react'
import { Banner } from './components/Banner'
import { RegisterForm } from './components/RegisterForm'
import { LoginForm } from './components/LoginForm'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/application/Loading'
import { connection } from '@/services/fcapi/axios'
import { CookiesKeys, useCookies } from '@/hooks/useCookies'
import { socialLoginUserRequest } from '@/services/users/socialLoginUserReqeust'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { auth } from '@/services/firebase'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false)

  const { theme } = useTheme()
  const { user, isLoading, refetchUser } = useUser()
  const { set } = useCookies()
  const { toast } = useToast()

  const navigate = useRouter()

  async function handleLoginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      if (!result.user) {
        toast({
          title: 'Erro no login',
          description: 'Erro ao logar com o google',
          variant: 'destructive',
        })
        return
      }

      const token = await result.user.getIdToken()

      const response = await socialLoginUserRequest({
        token,
      })

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

        navigate.push('/projects')
      }
    } catch (err) {
      toast({
        title: 'Erro no login',
        description: 'Erro ao logar com o google',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (user && !isLoading) {
      navigate.push('/projects')
    }
  }, [user, isLoading, navigate])

  if (isLoading) return <Loading />

  return (
    <main
      data-theme={theme}
      className={mainStyles({
        theme,
        className:
          'grid grid-cols-2 h-screen w-screen bg-gray900 data-[theme=dark]:bg-gray100 relative',
      })}
    >
      <Banner />

      <LoginForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleLoginWithGoogle={handleLoginWithGoogle}
      />
      <RegisterForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleLoginWithGoogle={handleLoginWithGoogle}
      />
    </main>
  )
}
