'use client'
import { headerLinks, Header } from '@/components/application/DashboardHeader'
import { Navigation, NavigationLink } from '@/components/application/Navigation'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { useNav } from '@/hooks/useNav'
import { useTheme } from '@/hooks/useTheme'
import { mainStyles } from '@/styles/theme'
import { HelpCircle, Home, User } from 'lucide-react'

const dashboardLinks: NavigationLink[] = [
  {
    pathname: '/projects',
    Icon: Home,
    label: 'Inicio',
  },
  {
    pathname: '/user',
    Icon: User,
    label: 'Minha conta',
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

          <Header.UserAvatar />
        </Header.Root>
        {children}
      </div>
    </div>
  )
}
