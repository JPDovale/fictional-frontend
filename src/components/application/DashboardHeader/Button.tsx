'use client'
import * as HoverCard from '@radix-ui/react-hover-card'
import { tv } from 'tailwind-variants'
import { HeaderLink } from '.'
import { Button as ButtonDefault } from '../Button'
import { Theme } from '@/styles/theme'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'

interface ButtonProps {
  link: HeaderLink
}

const hoverCardContentStyles = tv({
  base: 'p-2 border-[1px] rounded-lg max-w-xs shadow-lg shadow-semiTransparentBack',
  variants: {
    theme: {
      [Theme.DARK]: 'bg-gray200 border-purple500 text-text100',
      [Theme.LIGHT]: 'bg-gray800  border-purple900 text-text800',
      [Theme.SYSTEM]: '',
    },
  },
})

export function Button({ link }: ButtonProps) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const navigate = useRouter()

  return (
    <HoverCard.Root openDelay={2000}>
      <HoverCard.Trigger>
        <ButtonDefault.Root
          className="shadow-none"
          size="sm"
          active={pathname === link.pathname}
          disabled={link.disabled}
          onClick={() => navigate.push(link.pathname)}
        >
          <ButtonDefault.Icon>
            <link.Icon />
          </ButtonDefault.Icon>
        </ButtonDefault.Root>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content className={hoverCardContentStyles({ theme })}>
          <div>
            {link.existesTo && (
              <p className="text-xs text-justify mt-1">{link.existesTo}</p>
            )}

            {link.infos && link.infos[0] && (
              <>
                {link.infos.map(({ content, title }) => (
                  <div key={content}>
                    {title && (
                      <h2 className="font-heading text-xs font-bold opacity-95 mt-4">
                        {title}
                      </h2>
                    )}
                    {content && (
                      <p className="text-xs text-justify mt-1">{content}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <HoverCard.Arrow className="fill-purple900" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
