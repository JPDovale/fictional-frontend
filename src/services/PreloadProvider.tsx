'use client'
import { Loading } from '@/components/application/Loading'
import { usePreload } from '@/hooks/usePreload'

interface PreloadProviderProps {
  children: React.ReactNode
}

export function PreloadProvider({ children }: PreloadProviderProps) {
  const { isLoading } = usePreload()

  return <section>{isLoading ? <Loading /> : children}</section>
}
