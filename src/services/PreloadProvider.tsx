'use client'
import { Loading } from '@/components/application/Loading'
import { usePreload } from '@/hooks/usePreload'
import { QueryProvider } from './QueryProvider'
import { useSearchParams } from 'next/navigation'
import localstorageFunctions from '@/utils/localstorageFunctions'
import { LocalStorageKeys } from '@/configs/localstorageKeys'
import { Suspense } from 'react'

interface PreloadProviderProps {
  children: React.ReactNode
}

function Wrapper({ children }: PreloadProviderProps) {
  const { isLoading } = usePreload()
  const params = useSearchParams()

  const priceId = params?.get('priceId')

  if (priceId) {
    localstorageFunctions.Set(LocalStorageKeys.PRICE_ID, priceId)
  }

  return isLoading ? <Loading /> : children
}

export function PreloadProvider({ children }: PreloadProviderProps) {
  return (
    <QueryProvider>
      <Suspense>
        <Wrapper>{children}</Wrapper>
      </Suspense>
    </QueryProvider>
  )
}
