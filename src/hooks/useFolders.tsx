import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { getFoldersRequest } from '@/services/folders/getFoldersRequest'
import { useParams } from './useParams'
import { createFolderRequest } from '@/services/folders/createFolderRequest'
import { createFileRequest } from '@/services/files/createFileRequest'
import { updateFolderRequest } from '@/services/folders/updateFolderRequest'
import { updateFileRequest } from '@/services/files/updateFileRequest'

export function useFolders() {
  const { toast } = useToast()
  const { projectId } = useParams()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}:folders`],
    queryFn: async () => {
      if (!projectId) {
        return {
          folders: [],
        }
      }
      const response = await getFoldersRequest({ projectId })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        return {
          folders: response.data.folders,
        }
      }

      return {
        folders: [],
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  async function createFolder(parentId?: string) {
    if (!projectId) return

    const response = await createFolderRequest({ parentId, projectId })

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.CREATED) {
      const title = parentId ? 'Subpasta criada' : 'Pasta criada'
      const description = `${parentId ? 'Subpasta criada' : 'Pasta criada'} com sucesso`

      toast({
        title,
        description,
      })
      refetch()
    }
  }

  async function createFile(folderId?: string) {
    if (!projectId) return

    const response = await createFileRequest({ folderId, projectId })

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.CREATED) {
      toast({
        title: 'Arquivo criado',
        description: 'Arquivo criado com sucesso',
      })
      refetch()
    }
  }

  async function updateFolder({
    folderId,
    name,
  }: {
    folderId: string
    name?: string | null
  }) {
    if (!projectId) return

    const response = await updateFolderRequest({ folderId, projectId, name })

    if (response.status !== StatusCode.NO_CONTENT) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.NO_CONTENT) {
      toast({
        title: 'Pasta atualizada',
        description: 'Pasta atualizada com sucesso',
      })
      refetch()
    }
  }

  async function updateFile({
    fileId,
    title,
  }: {
    fileId: string
    title?: string | null
  }) {
    if (!projectId) return

    const response = await updateFileRequest({ projectId, title, fileId })

    if (response.status !== StatusCode.OK) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.OK) {
      toast({
        title: 'Arquivo atualizado',
        description: 'Arquivo atualizado com sucesso',
      })
      refetch()
    }
  }

  return {
    folders: data?.folders ?? [],
    createFolder,
    createFile,
    updateFolder,
    updateFile,
    isLoading,
    refetchFolders: refetch,
  }
}
