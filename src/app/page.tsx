'use client'
import { Loading } from '@/components/application/Loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const navigation = useRouter()

  useEffect(() => {
    navigation.push('/projects')
  }, [navigation])

  return <Loading />
}
