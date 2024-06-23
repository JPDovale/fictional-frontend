import { NodeTree } from '@/components/application/FolderTree'
import { FileEdit, LucideIcon } from 'lucide-react'

interface MakeFoundationFolderTreeNodeProps {
  icon: LucideIcon
  name: string
  isToShow: boolean
  projectId: string
}

export function makeFoundationFolderTreeNode({
  icon,
  name,
  isToShow,
  projectId,
}: MakeFoundationFolderTreeNodeProps) {
  const foundationNode: NodeTree = {
    id: '4',
    icon,
    name,
    isToShow,
    path: `/projects/${projectId}/foundation`,
    childs: [
      {
        id: '8',
        icon: FileEdit,
        name: 'Fundamento',
        path: `/projects/${projectId}/foundation/base`,
      },
      {
        id: '9',
        icon: FileEdit,
        name: 'O quê acontece?',
        path: `/projects/${projectId}/foundation/whatHappens`,
      },
      {
        id: '10',
        icon: FileEdit,
        name: 'Por que acontece?',
        path: `/projects/${projectId}/foundation/whyHappens`,
      },
      {
        id: '11',
        icon: FileEdit,
        name: 'Onde acontece?',
        path: `/projects/${projectId}/foundation/whereHappens`,
      },
      {
        id: '12',
        icon: FileEdit,
        name: 'Com quem acontece?',
        path: `/projects/${projectId}/foundation/whoHappens`,
      },
    ],
  }

  return foundationNode
}
