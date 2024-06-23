import { useToast } from '@/components/ui/use-toast'
import { LocalStorageKeys } from '@/configs/localstorageKeys'
import { File, getFileRequest } from '@/services/files/getFileRequest'
import {
  UpdateFileReq,
  updateFileRequest,
} from '@/services/files/updateFileRequest'
import { Optional } from '@/shared/types/types/Optional'
import { StatusCode } from '@/shared/types/types/StatusCode'
import localstorageFunctions from '@/utils/localstorageFunctions'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface UseFileProps {
  fileId?: string
  projectId?: string
}

interface FileQueryData {
  file: File | null
}

export function useFile({ projectId, fileId }: UseFileProps) {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery<unknown, Error, FileQueryData>({
    queryKey: [`projects:${projectId}:files:${fileId}`],
    queryFn: async () => {
      if (!fileId || !projectId) {
        return {
          file: null,
        }
      }

      const response = await getFileRequest({
        projectId,
        fileId,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        const { file } = response.data

        localstorageFunctions.Set(getTempPersistenceKey(), file.content)

        return {
          file,
        }
      }

      return {
        file: null,
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const file = data?.file ?? null

  const { mutateAsync: updateFile } = useMutation<
    void,
    Error,
    Optional<UpdateFileReq, 'fileId' | 'projectId'>
  >({
    mutationFn: async (variables) => {
      if (!fileId || !projectId) return

      const response = await updateFileRequest({
        projectId,
        fileId,
        ...variables,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }
    },
    onSuccess: (_, { title, content }) => {
      queryClient.setQueryData(
        [`projects:${projectId}:files:${fileId}`],
        (cachedData: FileQueryData) => {
          return {
            file: {
              id: cachedData.file?.id,
              projectId: cachedData.file?.projectId,
              createdAt: cachedData.file?.createdAt,
              updatedAt: cachedData.file?.updatedAt,
              title: title === undefined ? cachedData.file?.title : title,
              content:
                content === undefined ? cachedData.file?.content : content,
            },
          }
        },
      )
    },
  })

  function getTempPersistenceKey() {
    return `${LocalStorageKeys.EDITOR_TEMP_PERSISTENCE}:projects:${projectId}:files:${fileId}` as LocalStorageKeys
  }

  function getTempPersistence() {
    const value = localstorageFunctions.Get<string>(getTempPersistenceKey())
    return value ?? ''
  }

  return {
    file,
    isLoadingFile: isLoading,
    updateFile,
    refetchFile: refetch,
    getTempPersistenceKey,
    getTempPersistence,
  }
}
