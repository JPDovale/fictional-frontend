import { Button } from '@/components/application/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useProject } from '@/hooks/useProject'
import { deletePersonAttributeMuttationRequest } from '@/services/persons/deletePersonAttributeMutationRequest'
import { Mutation } from '@/services/persons/getPersonAttributeRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

interface DeleteDialogMutationProps {
  mutation: Mutation
}
export function DeleteMutationDialog({ mutation }: DeleteDialogMutationProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const { toast } = useToast()
  const { usePerson } = useProject({ projectId })
  const { useAttribute } = usePerson({ personId })
  const { refetchAttribute } = useAttribute({ attributeId })

  async function handleDeleteMutation() {
    if (!projectId || !attributeId || !personId) return

    const response = await deletePersonAttributeMuttationRequest({
      mutationId: mutation.id,
      projectId,
      personId,
      attributeId,
    })

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
        title: 'Alteração movida para lixeira!',
        description: 'A alteração foi movida para a lixeira com sucesso.',
      })

      refetchAttribute()
      setIsDeleteOpen(false)
    }
  }
  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogTrigger asChild>
        <Button.Root
          className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
          size="xs"
        >
          <Button.Icon>
            <Trash />
          </Button.Icon>
        </Button.Root>
      </DialogTrigger>

      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Voce tem certeza?</DialogTitle>
          <DialogDescription>
            Voce tem certeza que deseja mover a alteração de atributo para a
            lixeira?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button.Root
            size="sm"
            className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
            onClick={handleDeleteMutation}
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
  )
}
