import { DeleteMutationDialog } from './DeleteMutationDialog'
import { MutationEditor } from './MutationEditor'
import { UpdateMutationDialog } from './UpdateMutationDialog'
import { EditorMenuOption } from '@/components/application/Editor/components/FloatingMenuEditor'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { Mutation } from '@/services/persons/getPersonAttributeRequest'
import { normalizeEventDate } from '@/utils/normalizeEventDate'
import { ChangePositionMutation } from './ChangePositionMutation'

interface AttributeMutationEditorProps {
  mutation: Mutation
  lastPossition: number
  menuOptions: EditorMenuOption[]
}

export function AttributeMutationEditor({
  mutation,
  lastPossition = 0,
  menuOptions,
}: AttributeMutationEditorProps) {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { project } = useProject({ projectId })

  return (
    <li className="border-b border-b-gray500/60">
      <div className="flex -mb-16 mt-16 justify-between items-center">
        <h3 className="text-2xl font-bold opacity-30">
          Alteração {mutation.position}{' '}
          {mutation.title && `- ${mutation.title}`}
        </h3>

        <div className="flex gap-1">
          <UpdateMutationDialog mutation={mutation} />
          <ChangePositionMutation
            mutation={mutation}
            lastPossition={lastPossition}
          />
          <DeleteMutationDialog mutation={mutation} />
        </div>
      </div>

      {mutation.date && project?.buildBlocks.TIME_LINES && (
        <span className="text-xxs -mb-16 mt-16 opacity-30">
          {normalizeEventDate(mutation.date.date)}
        </span>
      )}

      <MutationEditor menuOptions={menuOptions} mutation={mutation} />
    </li>
  )
}
