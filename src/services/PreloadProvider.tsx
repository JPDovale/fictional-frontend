'use client'
import { Loading } from '@/components/application/Loading'
import { usePreload } from '@/hooks/usePreload'
import { QueryProvider } from './QueryProvider'

interface PreloadProviderProps {
  children: React.ReactNode
}

function Wrapper({ children }: PreloadProviderProps) {
  const { isLoading } = usePreload()

  return isLoading ? <Loading /> : children
}

export function PreloadProvider({ children }: PreloadProviderProps) {
  return (
    <QueryProvider>
      <Wrapper>{children}</Wrapper>
    </QueryProvider>
  )
}
