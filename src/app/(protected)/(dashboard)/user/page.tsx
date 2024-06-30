'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/useUser'
import { FaCrown } from 'react-icons/fa6'

export default function UserPage() {
  const { user } = useUser()

  return (
    <main className="max-w-3xl mx-auto py-4 h-full flex-col flex w-full">
      <h3 className="text-2xl font-bold font-body px-4 opacity-60">
        Minha conta
      </h3>

      <section className="grid grid-cols-2 mt-4">
        <div className="flex flex-col gap-4 p-4">
          <Avatar className="w-64 h-64">
            <AvatarImage src={user?.imageUrl ?? ''} alt="Your profile" />
            <AvatarFallback>
              <span className="text-6xl font-bold opacity-60">
                {user?.name.split('')[0]?.toUpperCase() ?? 'A'}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div>
            <span className="font-bold opacity-60">Nome</span>
            <span className="font-bold text-xl flex gap-2 items-center">
              {user?.name}
              {user?.isSubscriber && <FaCrown className="fill-importance5" />}
            </span>
          </div>

          <div>
            <span className="font-bold opacity-60">Nome de usuário</span>
            <span className="font-bold text-xl">{user?.username}</span>
          </div>

          <div>
            <span className="font-bold opacity-60">Com nós desde</span>
            <span className="font-bold text-xl">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </span>
          </div>

          <div>
            <span className="font-bold opacity-60">Última atualização</span>
            <span className="font-bold text-xl">
              {user?.updatedAt &&
                new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
