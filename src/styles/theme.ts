// import { Theme } from '@rStores/useInterfaceStore'
import { tv } from 'tailwind-variants'

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

export const mainStyles = tv({
  base: '',
  variants: {
    theme: {
      [Theme.DARK]: 'bg-gray100 text-text100',
      [Theme.LIGHT]: 'bg-gray900 text-text800',
      [Theme.SYSTEM]: '',
    },
  },
})
