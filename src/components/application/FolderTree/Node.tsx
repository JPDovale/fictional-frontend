import { useTheme } from '@/hooks/useTheme'
import { Icon } from '@phosphor-icons/react'
import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IconType } from 'react-icons/lib'
import { Tree } from './Tree'
import { NodeContextMenu } from './NodeContextMenu'

export interface Action {
  label: string
  action: () => void | string | Promise<void>
  icon?: LucideIcon | Icon | IconType
  postIcon?: LucideIcon | Icon | IconType
  type?: 'default' | 'danger' | 'input'
}

export interface ActionGroup {
  title: string
  actions: Action[]
}

export interface NodeTree {
  name: string
  path?: string
  closed?: boolean
  isToShow?: boolean
  onInputBlur?: (e?: string) => void | Promise<void>
  id: string
  childs?: NodeTree[]
  icon?: LucideIcon | Icon | IconType
  preIcon?: string
  actions?: Action[]
  acctionGroups?: ActionGroup[]
}

interface NodeProps {
  node: NodeTree
  level?: number
  nodeSelected: string
  setNodeSelected: (node: string) => void
}

export function Node({
  node,
  level = 0,
  nodeSelected,
  setNodeSelected,
}: NodeProps) {
  const { childs, closed: startClosed = true, id, path, isToShow = true } = node

  const [closed, setClosed] = useState(startClosed)
  const { theme } = useTheme()

  const navigate = useRouter()

  function handleNodeClick() {
    if (childs && childs.length > 0) {
      setClosed((prev) => !prev)
      return
    }

    if (path) {
      navigate.push(path)
    }

    setNodeSelected(id)
  }

  if (!isToShow) return null

  return (
    <div
      data-theme={theme}
      className="flex flex-col data-[selected=true]:bg-gray200 data-[selected=true]:data-[theme=light]:bg-gray800"
      data-selected={nodeSelected === id}
    >
      <NodeContextMenu handleNodeClick={handleNodeClick} node={node} />

      {!closed && (
        <div
          style={{
            marginLeft: 14,
          }}
          className="border-l border-gray400"
        >
          {childs && (
            <Tree
              nodes={childs}
              level={level + 1}
              nodeSelected={nodeSelected}
              setNodeSelected={setNodeSelected}
            />
          )}
        </div>
      )}
    </div>
  )
}
