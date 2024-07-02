import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/application/Button'
import { Trash } from 'lucide-react'
import { useParams } from '@/hooks/useParams'
import { useTimeline } from '@/hooks/useTimeline'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { deleteEventRequest } from '@/services/timelines/deleteEventRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'

interface DeletingEventModalProps {
  eventId: string
}

export function DeletingEventModal({ eventId }: DeletingEventModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()
  const { projectId, timelineId } = useParams()
  const { timeline, refetchTimeline } = useTimeline({ projectId, timelineId })

  const event = timeline?.events.find((event) => event.id === eventId)

  async function handleDeleteEvent() {
    const response = await deleteEventRequest({
      projectId,
      timelineId,
      eventId,
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
      refetchTimeline()
      toast({
        title: 'Evento deletado',
        description: `O evento ${event?.title} foi deletado com sucesso.`,
      })
      setIsOpen(false)
    }
  }

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button.Root size="xxs" className="shadow-none w-4 h-4 bg-fullError">
          <Button.Icon>
            <Trash />
          </Button.Icon>
        </Button.Root>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Voce tem certeza?</DialogTitle>
          <DialogDescription>
            Voce tem certeza que deseja mover o evento {event.title} para a
            lixeira?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button.Root
            size="sm"
            className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
            onClick={handleDeleteEvent}
          >
            <Button.Text>Sim</Button.Text>
          </Button.Root>

          <Button.Root
            size="sm"
            className="shadow-none"
            onClick={() => setIsOpen(false)}
          >
            <Button.Text>Cancelar</Button.Text>
          </Button.Root>
        </div>
      </DialogContent>
    </Dialog>
  )
}
