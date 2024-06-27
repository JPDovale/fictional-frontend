import { useTheme } from '@/hooks/useTheme'
import { Folder } from 'lucide-react'
import { Tree } from './Tree'
import { NodeTree } from './Node'

interface FolderTreeProps {
  nodes: NodeTree[]
  title?: string
}

export function FolderTree({ nodes, title = '' }: FolderTreeProps) {
  const { theme } = useTheme()

  return (
    <div className="relative overflow-x-hidden max-h-screen overflow-y-auto w-full pb-8">
      <div className="w-full min-w-[24rem] ">
        <div
          data-theme={theme}
          className="text-xs z-[3] fixed p-[0.3125rem] w-full font-bold border-b border-b-gray400 flex items-center bg-gray200 gap-2.5 pl-5 data-[theme=light]:bg-gray800"
        >
          <Folder size={16} className="opacity-60" />
          <span className="opacity-60">Explorador: {title}</span>
        </div>
        <span className="text-xs p-[0.3125rem] font-bold opacity-0 border-b border-b-gray600 flex items-center gap-2.5 pl-5">
          <Folder size={16} />
          Explorador: {title}
        </span>
        <section className="ml-1">
          <Tree nodes={nodes} />
        </section>
      </div>
    </div>
  )
}
