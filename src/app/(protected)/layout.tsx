'use client'
import { Loading } from '@/components/application/Loading'
import { useUser } from '@/hooks/useUser'
import { PreloadProvider } from '@/services/PreloadProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

function Wrapper({ children }: ProtectedLayoutProps) {
  const navigate = useRouter()
  const { isLoading, user } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate.push('/login')
    }
  }, [isLoading, user, navigate])

  if (isLoading || !user) return <Loading />

  return children
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <PreloadProvider>
      <Wrapper>{children}</Wrapper>
    </PreloadProvider>
  )
}
