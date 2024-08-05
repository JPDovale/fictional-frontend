import { Button } from '@/components/application/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUser } from '@/hooks/useUser'
import { FaCrown } from 'react-icons/fa6'

interface UserViewProps {
  setIsEditing: (newState: boolean) => void
}

export function UserView({ setIsEditing }: UserViewProps) {
  const { user } = useUser()

  return (
    <div>
      <h3 className="text-2xl font-bold font-body px-4 opacity-60">
        Minha conta
      </h3>
      <section className="grid grid-cols-2 mt-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-4 p-4 max-sm:items-center">
          <Avatar className="w-64 h-64 max-sm:w-48 max-sm:h-48">
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
            <span className="font-bold text-sm opacity-60">Nome</span>
            <span className="font-bold text-xl flex gap-2 items-center">
              {user?.name}
              {user?.isSubscriber && <FaCrown className="fill-importance5" />}
            </span>
          </div>

          <div>
            <span className="font-bold text-sm opacity-60">
              Nome de usuário
            </span>
            <span className="font-bold text-xl">{user?.username}</span>
          </div>

          <div>
            <span className="font-bold text-sm opacity-60">Com nós desde</span>
            <span className="font-bold text-xl">
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </span>
          </div>

          {user?.updatedAt && (
            <div>
              <span className="font-bold text-sm opacity-60">
                Última atualização
              </span>
              <span className="font-bold text-xl">
                {new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          <Button.Root
            onClick={() => setIsEditing(true)}
            size="sm"
            className="mt-4"
          >
            <Button.Text>Editar conta</Button.Text>
          </Button.Root>
        </div>
      </section>
    </div>
  )
}
