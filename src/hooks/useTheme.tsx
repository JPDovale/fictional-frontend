import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { Theme } from '@/styles/theme'

export function useTheme() {
  const { theme, changeTheme } = useInterfaceStore((state) => ({
    theme: state.theme,
    changeTheme: state.changeTheme,
  }))

  const graphBaseColor = theme === Theme.DARK ? '#EFEFEF' : '#242432'

  return {
    theme,
    changeTheme,
    graphBaseColor,
  }
}
