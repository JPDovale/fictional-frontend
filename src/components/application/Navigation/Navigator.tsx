'use client'
import { VariantProps, tv } from 'tailwind-variants'
import { Button } from '../Button'
import { NavigationLink } from '.'
import { ScrollArea } from '../ScrollArea'
import { useTheme } from '@/hooks/useTheme'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Theme } from '@/styles/theme'

const navigatorStyles = tv({
  base: 'flex gap-3 h-full p-2',
  variants: {
    direction: {
      column: 'flex-col',
      row: 'flex-row p-0 items-center gap-2',
    },
  },
  defaultVariants: {
    direction: 'column',
  },
})

interface NavigationNavigatorProps
  extends VariantProps<typeof navigatorStyles> {
  links: NavigationLink[]
  navIsOpen?: boolean
}

function Nav({ direction, links, navIsOpen }: NavigationNavigatorProps) {
  const { theme } = useTheme()
  const pathname = usePathname()
  return (
    <nav>
      <ul className={navigatorStyles({ direction })}>
        {links.map((link) => (
          <li key={link.pathname}>
            <Button.Root
              className={
                direction === 'row' ? 'shadow-transparent bg-transparent' : ''
              }
              size={direction === 'row' ? 'sm' : 'md'}
              active={pathname === link.pathname}
              align={navIsOpen ? 'start' : 'center'}
              asChild
            >
              <Link href={link.pathname}>
                <Button.Icon
                  className={
                    direction === 'row' && theme === Theme.LIGHT
                      ? 'text-black'
                      : ''
                  }
                >
                  <link.Icon />
                </Button.Icon>

                {navIsOpen && (
                  <Button.Text className="text-xs">{link.label}</Button.Text>
                )}
              </Link>
            </Button.Root>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Navigator({
  navIsOpen = false,
  direction,
  links,
}: NavigationNavigatorProps) {
  if (direction === 'row')
    return <Nav links={links} navIsOpen={navIsOpen} direction={direction} />

  return (
    <ScrollArea>
      <Nav links={links} direction={direction} navIsOpen={navIsOpen} />
    </ScrollArea>
  )
}

Navigator.displayName = 'Navigation.Navigator'
