'use client'

import { Loading } from '@/components/application/Loading'
import { NotFound } from '@/components/application/NotFound'
import { useUser } from '@/hooks/useUser'
import { FaCrown } from 'react-icons/fa6'

export default function SuccessSubscrptionPage() {
  const { user, isLoading } = useUser()

  if (isLoading) return <Loading />

  if (!user?.isSubscriber) return <NotFound />

  return (
    <main className="h-full flex-col flex w-full overflow-y-auto items-center justify-center">
      <p className="text-3xl text-center">
        Parabéns <strong className="text-violet-200">{user?.name}</strong>,{' '}
        <br /> você está um passo mais perto de ser um grande escritor!
      </p>

      <div className="my-8 p-px w-full bg-purple800 max-w-sm shadow-xl shadow-violet-50 mx-auto rounded-full" />
      <p className="text-sm mb-16">
        Esperamos que faça o melhor proveito de todas as nosssa mais avançadas
        ferramentas!
      </p>

      <div className="w-full max-w-4xl mx-auto mt-6 mb-16 flex flex-col items-center justify-center shadow-2xl shadow-purple900 rounded-full">
        <h1 className="text-5xl font-bold text-purple900 flex items-center justify-center gap-2 shadow-2xl shadow-importance5 py-4 w-full rounded-full">
          Bem vindo ao premium <FaCrown className="fill-importance5 " />
        </h1>
      </div>
    </main>
  )
}
