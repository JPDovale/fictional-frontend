'use client'

import { FolderTree } from '@/components/application/FolderTree'
import { Loading } from '@/components/application/Loading'
import { DeletingPersonAttributeModal } from '@/components/persons/DeletingPersonAttributeModal'
import { DeletingPersonModal } from '@/components/persons/DeletingPersonModal'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useFolderTree } from '@/hooks/useFolderTree'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { Theme, mainStyles } from '@/styles/theme'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { tv } from 'tailwind-variants'

const overlayImageStyles = tv({
  base: 'absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t to-transparent ease-in-out duration-300 ',
  variants: {
    theme: {
      [Theme.DARK]: 'from-gray100 via-gray100/80',
      [Theme.LIGHT]: 'from-gray900 via-gray900/30',
      [Theme.SYSTEM]: '',
    },
  },
})

interface ProjectLayoutProps {
  children: React.ReactNode
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { theme } = useTheme()
  const { projectID } = useParams()
  const projectId = projectID as string

  const { nodeIdSelected, setNodeIdSelected } = useFolderTree()
  const {
    isLoadingProject,
    project,
    useHeader,
    useTreeFolder,
    usePersons,
    usePersonsAttributes,
    useFoundation,
  } = useProject({ projectId })
  const { isLoading: isLoadingPersons } = usePersons()
  const { isLoadingFoundation } = useFoundation()
  const { isLoading: isLoadingPersonsAttributes } = usePersonsAttributes()
  const { paths, Header } = useHeader()
  const projectTree = useTreeFolder()

  const isLoading =
    isLoadingProject ||
    isLoadingPersons ||
    isLoadingPersonsAttributes ||
    isLoadingFoundation

  if (isLoading) return <Loading />

  const imageUrl = project?.image.url
  const imageAlt = project?.image.alt

  return (
    <div
      className={`w-screen max-h-screen h-screen overflow-hidden flex  ${mainStyles(
        {
          theme,
        },
      )} `}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="animate-none transition-none"
      >
        <ResizablePanel
          defaultSize={15}
          className="animate-none transition-none"
        >
          <FolderTree
            nodes={[
              ...projectTree.childs,
              { id: '1', name: 'Sair', path: '/projects', icon: LogOut },
            ]}
            title={project?.name}
            nodeSelected={nodeIdSelected}
            setNodeSelected={setNodeIdSelected}
          />

          <DeletingPersonModal projectId={projectId} />
          <DeletingPersonAttributeModal projectId={projectId} />
        </ResizablePanel>

        <ResizableHandle withHandle className="p-px" />

        <ResizablePanel
          defaultSize={60}
          className="animate-none transition-none"
        >
          <div className="w-full min-h-full max-h-full overflow-y-auto relative flex flex-col ">
            <Header />

            <div className="w-full max-h-[38rem] min-h-[38rem] relative flex items-center overflow-hidden z-0">
              {imageUrl && (
                <Image
                  id="back"
                  width={1000}
                  height={600}
                  className="w-full h-full object-cover blur-sm opacity-80"
                  src={imageUrl}
                  alt={imageAlt ?? ''}
                />
              )}
              <div className={overlayImageStyles({ theme })} />
            </div>

            <div
              data-has-title={paths.includes('Configurações')}
              data-has-image={!!imageUrl}
              className="relative -mt-[17.5rem] data-[has-image=false]:-mt-[28rem] z-10 w-full flex flex-col data-[has-image=true]:data-[has-title=false]:-mt-[28rem]"
            >
              {paths.includes('Configurações') && (
                <h1 className="text-5xl text-center font-title min-w-[45rem] mx-auto max-w-[45rem] font-bold text-text600">
                  {project?.name}
                </h1>
              )}

              <div className="flex justify-between">{children} </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
