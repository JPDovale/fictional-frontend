'use client'
import { Button } from '@/components/application/Button'
import { NotFound } from '@/components/application/NotFound'
import { BuildBlockUsing } from '@/components/projects/BuildBlockUsing'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProject } from '@/hooks/useProject'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { useState } from 'react'
import { InfoBlock } from '../components/InfoBlock'
import { BuildBlock } from '@/services/projects/getProjectsRequest'

export default function ProjectConfigPage() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { projectID } = useParams()
  const projectId = projectID as string

  const { project, deleteProject } = useProject({ projectId })

  const navigate = useRouter()

  if (!project) return <NotFound />

  return (
    <main className="flex flex-col max-w-3xl w-full gap-12 pb-16 mx-auto py-4">
      <InfoBlock.Root className="mt-10">
        <InfoBlock.Header>
          <InfoBlock.Title>
            Você está usando os blocos de construção:
          </InfoBlock.Title>
          <InfoBlock.EditButton
            onClick={() =>
              navigate.push(`/projects/${project.id}/edit/buildBlocks`)
            }
          />
        </InfoBlock.Header>

        <InfoBlock.Body className="grid grid-cols-4 gap-4 mt-4 max-sm:grid-cols-2">
          {Object.entries(project.buildBlocks).map(([k, v]) => {
            if (!v) return null
            return <BuildBlockUsing key={k} buildBlock={k as BuildBlock} />
          })}
        </InfoBlock.Body>
      </InfoBlock.Root>

      <InfoBlock.Root className="border-fullError mt-12" id="trash">
        <InfoBlock.Header>
          <InfoBlock.Title className="text-fullError">
            Zona de risco
          </InfoBlock.Title>
        </InfoBlock.Header>

        <InfoBlock.Body>
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <Button.Root
              width="full"
              className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
              asChild
            >
              <DialogTrigger>
                <Button.Icon>
                  <Trash />
                </Button.Icon>
                <Button.Text>Mover para lixeira</Button.Text>
              </DialogTrigger>
            </Button.Root>

            <DialogContent className="p-4">
              <DialogHeader>
                <DialogTitle>Voce tem certeza?</DialogTitle>
                <DialogDescription>
                  Voce tem certeza que deseja mover o projeto para a lixeira?
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button.Root
                  size="sm"
                  className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
                  onClick={deleteProject}
                >
                  <Button.Text>Sim</Button.Text>
                </Button.Root>

                <Button.Root
                  size="sm"
                  className="shadow-none"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  <Button.Text>Cancelar</Button.Text>
                </Button.Root>
              </div>
            </DialogContent>
          </Dialog>
        </InfoBlock.Body>
      </InfoBlock.Root>
    </main>
  )
}
