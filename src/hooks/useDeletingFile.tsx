import { useToast } from '@/components/ui/use-toast'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { useParams } from './useParams'
import { useFolders } from './useFolders'
import { usePathname, useRouter } from 'next/navigation'
import { deleteFileRequest } from '@/services/files/deleteFileRequest'

export function useDeletingFile() {
  const pathname = usePathname()
  const navigate = useRouter()

  const { projectId } = useParams()
  const { toast } = useToast()
  const { filesWithowtHierarchy, refetchFolders } = useFolders()
  const { deletingFile, setDeletingFile } = useInterfaceStore((state) => ({
    deletingFile: state.deletingFile,
    setDeletingFile: state.setDeletingFile,
  }))

  const file = filesWithowtHierarchy.find((f) => f.id === deletingFile)

  async function deleteFile() {
    if (!projectId || !deletingFile) return

    const response = await deleteFileRequest({
      projectId,
      fileId: deletingFile,
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
        title: 'Arquivo movido para lixeira',
        description: `O arquivo ${file?.title} foi movido para lixeira.`,
      })

      if (pathname.includes(deletingFile)) {
        navigate.push(`/projects/${projectId}`)
      }

      refetchFolders()
      setDeletingFile(null)
    }
  }

  return {
    deleteFile,
    deletingFile,
    setDeletingFile,
    file,
  }
}
