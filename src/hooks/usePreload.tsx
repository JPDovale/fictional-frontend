// import { usePersons } from '@store/Persons'
// import { useProjects } from '@store/Projects'
// import { useRoutes } from '@store/Routes'
import { useEffect } from 'react'
// import { useUser } from './useUser'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { CookiesKeys, useCookies } from './useCookies'
import { connection } from '@/services/fcapi/axios'
import { useUser } from './useUser'
// import { useToast } from '@/components/ui/use-toast'

export function usePreload() {
  const { get } = useCookies()
  const { isLoading, refetchUser } = useUser()
  // const { toast } = useToast()
  const { loadConfig } = useInterfaceStore((state) => ({
    loadConfig: state.loadConfig,
  }))

  const token = get<string>(CookiesKeys.TOKEN)
  if (token) {
    connection.setDefaultBearerToken(token)
  }

  useEffect(() => {
    // localStorage.setItem(localStorageKeys.navigationHistory, '[]')

    loadConfig()
    // recoveryHistory()
    // if (!isLoading) {
    //   loadProjects()
    //   loadPersons()
    // }
  }, [
    // recoveryHistory, isLoading, loadProjects, loadPersons,
    loadConfig,
  ])

  // useEffect(() => {
  //   function onAuthSuccess() {
  //     refetchUser()
  //   }

  //   function onAuthError() {
  //     toast({
  //       title: 'Error',
  //       description:
  //         'Houve um erro com o seu login, tente novamente mais tarde!',
  //       variant: 'destructive',
  //     })
  //   }
  // }, [refetchUser, toast])
  // const { recoveryHistory } = useRoutes((state) => ({
  //   recoveryHistory: state.recoveryHistory,
  // }))

  // const { loadProjects } = useProjects((state) => ({
  //   loadProjects: state.loadProjects,
  // }))

  // const { loadPersons } = usePersons((state) => ({
  //   loadPersons: state.loadPersons,
  // }))

  async function reload() {
    await Promise.all([refetchUser(), loadConfig()])
  }

  return {
    isLoading,
    reload,
  }
}
