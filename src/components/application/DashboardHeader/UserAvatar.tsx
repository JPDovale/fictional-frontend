import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { CookiesKeys, useCookies } from '@/hooks/useCookies'
import { useUser } from '@/hooks/useUser'
import { connection } from '@/services/fcapi/axios'
import { deleteUserSessionsRequest } from '@/services/users/deleteUserSessionsRequest'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FaCrown } from 'react-icons/fa6'

export function UserAvatar() {
  const { remove } = useCookies()
  const { user, refetchUser } = useUser()

  const navigate = useRouter()
  const queryClient = useQueryClient()

  async function handleLogout() {
    await deleteUserSessionsRequest()
    connection.setDefaultBearerToken('')
    remove(CookiesKeys.TOKEN)
    remove(CookiesKeys.REFRESH)
    await refetchUser()
    queryClient.clear()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex ml-auto items-center gap-2">
        <span className="text-xs font-bold opacity-60">{user?.username}</span>
        {user?.isSubscriber && <FaCrown className="fill-importance5" />}
        <Avatar className="w-[1.625rem] h-[1.625rem]">
          <AvatarImage src={user?.imageUrl ?? ''} />
          <AvatarFallback className="text-xs">
            {user?.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="text-sm font-bold opacity-60">
          {user?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="w-full flex gap-2"
          onClick={() => navigate.push('/user')}
        >
          <User size={16} />
          Conta
        </DropdownMenuItem>

        <DropdownMenuItem
          className="w-full flex gap-2"
          onClick={() => handleLogout()}
        >
          <LogOut size={16} />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
