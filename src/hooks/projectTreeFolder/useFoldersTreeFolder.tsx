import { useFolders } from '../useFolders'
import { FileIcon, FolderIcon } from 'lucide-react'
import { useBaseGroupActions } from './useBaseGroupActions'
import { Folder } from '@/services/folders/getFoldersRequest'
import { NodeTree } from '@/components/application/FolderTree/Node'

export function useFoldersTreeFolder() {
  const { folders, createFolder, createFile, updateFolder, updateFile } =
    useFolders()
  const baseGroupActions = useBaseGroupActions()

  function makeFolderNode(folder: Folder): NodeTree {
    return {
      id: folder.id,
      name: folder.name,
      icon: FolderIcon,
      onInputBlur: (e) => {
        updateFolder({ folderId: folder.id, name: e })
      },
      childs: [
        ...folder.files.map(
          (file): NodeTree => ({
            id: file.id,
            name: file.title,
            acctionGroups: baseGroupActions,
            path: `/projects/${folder.projectId}/files/${file.id}`,
            onInputBlur: (e: string | undefined) => {
              updateFile({ fileId: file.id, title: e })
            },
            actions: [
              {
                label: 'Criar subpasta',
                action: () => createFolder(folder.id),
                icon: FolderIcon,
              },
              {
                label: 'Criar arquivo',
                action: () => createFile(folder.id),
                icon: FileIcon,
              },
              {
                label: 'Renomear arquivo',
                action: () => 'input',
                icon: FileIcon,
              },
            ],

            icon: FileIcon,
          }),
        ),
        ...folder.childs.map(makeFolderNode),
      ],
      acctionGroups: baseGroupActions,
      actions: [
        {
          label: 'Criar subpasta',
          action: () => createFolder(folder.id),
          icon: FolderIcon,
        },
        {
          label: 'Criar arquivo',
          action: () => createFile(folder.id),
          icon: FileIcon,
        },
        {
          label: 'Renomear pasta',
          action: () => 'input',
          icon: FolderIcon,
        },
      ],
    }
  }

  const foldersNodes: NodeTree[] = folders.map(makeFolderNode)

  return foldersNodes
}
