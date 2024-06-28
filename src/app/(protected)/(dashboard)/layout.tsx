'use client'
import { headerLinks, Header } from '@/components/application/DashboardHeader'
import { Navigation, NavigationLink } from '@/components/application/Navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { useNav } from '@/hooks/useNav'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '@/hooks/useUser'
import { mainStyles } from '@/styles/theme'
import { HelpCircle, Home } from 'lucide-react'
import { FaCrown } from 'react-icons/fa6'

const dashboardLinks: NavigationLink[] = [
  {
    pathname: '/projects',
    Icon: Home,
    label: 'Inicio',
  },
  {
    pathname: '/help',
    Icon: HelpCircle,
    label: 'Ajuda',
  },
  // {
  //   pathname: RoutesAvailable.persons.path,
  //   Icon: PersonStanding,
  //   label: 'Personagens',
  // },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme } = useTheme()
  const { user } = useUser()
  const { navIsOpen, handleChangeOpenNav } = useNav()
  useCheckoutSession()

  return (
    <div
      className={`w-screen max-h-screen overflow-hidden flex  ${mainStyles({
        theme,
      })} `}
    >
      <Navigation.Root navIsOpen={navIsOpen}>
        <Navigation.Header navIsOpen={navIsOpen}>
          <Navigation.Title
            navIsOpen={navIsOpen}
            handleChangeOpenNav={handleChangeOpenNav}
          />
          <Navigation.Close
            navIsOpen={navIsOpen}
            handleChangeOpenNav={handleChangeOpenNav}
          />
        </Navigation.Header>

        <Navigation.Navigator navIsOpen={navIsOpen} links={dashboardLinks} />
        <Navigation.Config isOpen={navIsOpen} />
      </Navigation.Root>
      <div className="w-full min-h-full flex flex-col">
        <Header.Root className="items-center">
          {headerLinks?.map((link) => (
            <Header.Button link={link} key={link.label} />
          ))}

          <span className="ml-auto text-xs -mr-2 font-bold opacity-60">
            {user?.username}
          </span>

          {user?.isSubscriber && <FaCrown className="fill-importance5" />}

          <Avatar className="w-[1.625rem] h-[1.625rem]">
            <AvatarImage src={user?.imageUrl ?? ''} />
            <AvatarFallback className="text-xs">
              {user?.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Header.Root>
        {children}
      </div>
    </div>
  )
}
