import { useToast } from '@/components/ui/use-toast'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { deleteFolderRequest } from '@/services/folders/deleteFolderRequest'
import { useParams } from './useParams'
import { useFolders } from './useFolders'

export function useDeletingFolder() {
  const { projectId } = useParams()
  const { toast } = useToast()
  const { foldersWithowtHierarchy, refetchFolders } = useFolders()
  const { deletingFolder, setDeletingFolder } = useInterfaceStore((state) => ({
    deletingFolder: state.deletingFolder,
    setDeletingFolder: state.setDeletingFolder,
  }))

  const folder = foldersWithowtHierarchy.find((f) => f.id === deletingFolder)

  async function deleteFolder() {
    if (!projectId || !deletingFolder) return

    const response = await deleteFolderRequest({
      projectId,
      folderId: deletingFolder,
    })

    if (response.status !== StatusCode.NO_CONTENT) {
      return toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.NO_CONTENT) {
      toast({
        title: 'Pasta movida para lixeira',
        description: `A pasta ${folder?.name} foi movido para lixeira.`,
      })

      refetchFolders()

      setDeletingFolder(null)
    }
  }

  return {
    deleteFolder,
    deletingFolder,
    setDeletingFolder,
    folder,
  }
}
