import { getUserRequest } from '@/services/users/getUserRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { useQuery } from '@tanstack/react-query'

export function useUser() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUserRequest()

      if (response.status === StatusCode.OK && response.data) {
        return {
          user: response.data.user,
        }
      }

      return {
        user: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return {
    user: data?.user,
    isLoading,
    refetchUser: refetch,
  }
}
