'use client'
import { Loading } from '@/components/application/Loading'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useRouter()
  const { isLoading, user } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate.push('/login')
    }
  }, [isLoading, user, navigate])

  if (isLoading || !user) return <Loading />
  return <>{children}</>
}
