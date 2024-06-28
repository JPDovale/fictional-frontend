'use client'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { useUser } from '@/hooks/useUser'
import { Theme } from '@/styles/theme'
import { HTMLAttributes } from 'react'
import { FaCrown } from 'react-icons/fa6'
import { tv } from 'tailwind-variants'

const headerStyles = tv({
  base: 'px-2 h-6 flex items-center gap-1 fixed w-full max-w-full top-0 z-50',
  variants: {
    theme: {
      [Theme.DARK]: 'bg-gray200',
      [Theme.LIGHT]: 'bg-gray800 ',
      [Theme.SYSTEM]: '',
    },
  },
})

const pathStyles = tv({
  base: 'text-xxs leading-none font-bold opacity-60 mt-px ',
})

const dividerStyles = tv({
  base: 'font-bold opacity-30 text-sm leading-none ',
})

export interface ProjectPageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  projectId: string
}

export function ProjectPageHeader({
  projectId,
  className,
  ...props
}: ProjectPageHeaderProps) {
  const { user } = useUser()
  const { theme } = useTheme()
  const { useHeader } = useProject({ projectId })
  const { paths } = useHeader()

  return (
    <>
      <header className={headerStyles({ theme, className })} {...props}>
        {user?.isSubscriber && (
          <FaCrown className="fill-importance5 mr-0.5" size={14} />
        )}
        {paths.map((path, i) => (
          <div key={path} className="flex items-center mt-0.5 gap-1">
            <span className={pathStyles()}>{path}</span>
            {i !== paths.length - 1 && (
              <span className={dividerStyles()}>{'>'}</span>
            )}
          </div>
        ))}
      </header>

      <span aria-hidden className="h-6 w-full" />
    </>
  )
}
