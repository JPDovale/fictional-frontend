import { Button } from '@/components/application/Button'
import { useToast } from '@/components/ui/use-toast'
import { useProject } from '@/hooks/useProject'
import { changePositionPersonAttributeMuttationRequest } from '@/services/persons/changePositionPersonAttributeMutationRequest'
import { Mutation } from '@/services/persons/getPersonAttributeRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from 'lucide-react'
import { useParams } from 'next/navigation'

interface ChangePositionMutationProps {
  mutation: Mutation
  lastPossition: number
}

export function ChangePositionMutation({
  mutation,
  lastPossition,
}: ChangePositionMutationProps) {
  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const { toast } = useToast()
  const { usePerson } = useProject({ projectId })
  const { useAttribute } = usePerson({ personId })
  const { refetchAttribute } = useAttribute({ attributeId })

  async function handleChangePositionMutation(
    direction: 'UP' | 'DOWN' | 'TOP' | 'BOTTOM',
  ) {
    if (!projectId || !attributeId || !personId) return

    const response = await changePositionPersonAttributeMuttationRequest({
      projectId,
      attributeId,
      personId,
      mutationId: mutation.id,
      direction,
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
      refetchAttribute()
    }
  }

  return (
    <>
      <Button.Root
        className="shadow-none "
        size="xs"
        disabled={mutation.position === 1}
        onClick={() => handleChangePositionMutation('TOP')}
      >
        <Button.Icon>
          <ChevronsUp />
        </Button.Icon>
      </Button.Root>

      <Button.Root
        className="shadow-none "
        size="xs"
        disabled={mutation.position === 1}
        onClick={() => handleChangePositionMutation('UP')}
      >
        <Button.Icon>
          <ChevronUp />
        </Button.Icon>
      </Button.Root>

      <Button.Root
        className="shadow-none "
        size="xs"
        disabled={lastPossition === mutation.position}
        onClick={() => handleChangePositionMutation('DOWN')}
      >
        <Button.Icon>
          <ChevronDown />
        </Button.Icon>
      </Button.Root>

      <Button.Root
        className="shadow-none "
        size="xs"
        disabled={lastPossition === mutation.position}
        onClick={() => handleChangePositionMutation('BOTTOM')}
      >
        <Button.Icon>
          <ChevronsDown />
        </Button.Icon>
      </Button.Root>
    </>
  )
}
