import { useTheme } from '@/hooks/useTheme'
import { Theme } from '@/styles/theme'
import { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const menuOptionWrapperStyles = tv({
  base: 'flex gap-2 items-center justify-between min-w-[280px] py-0.5 ease-in-out duration-300 rounded-md ',
  variants: {
    theme: {
      [Theme.DARK]: 'hover:bg-gray400 focus:bg-gray400',
      [Theme.LIGHT]: 'hover:bg-gray500 focus:bg-gray500',
      [Theme.SYSTEM]: '',
    },
  },
})

interface MenuOptionProps {
  icon: ReactNode
  title: string
  description: string
  handler: () => void
}

export function MenuOption({
  icon,
  description,
  title,
  handler,
}: MenuOptionProps) {
  const { theme } = useTheme()

  return (
    <button
      type="button"
      className={menuOptionWrapperStyles({ theme })}
      onClick={handler}
    >
      {icon}
      <div className="flex-1 pr-2">
        <span className="text-sm font-bold">{title}</span>
        <span className="text-xs">{description}</span>
      </div>
    </button>
  )
}
