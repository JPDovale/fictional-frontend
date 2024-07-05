import { FolderTree } from '@/components/application/FolderTree'
import { NodeTree } from '@/components/application/FolderTree/Node'
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface FolderTreePopoverProps {
  projectTree: NodeTree[]
  name?: string
}

export function FolderTreePopover({
  name,
  projectTree,
}: FolderTreePopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-6 h-6 hidden max-sm:flex absolute right-0 top-0.5 z-[150]">
        <Menu size={20} />
      </DialogTrigger>

      <DialogPortal>
        <DialogContent className="w-full h-full p-0 z-[200]">
          <FolderTree nodes={projectTree} title={name} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
