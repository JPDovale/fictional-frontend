import { BlockEditor } from '@/components/application/BlockEditor'
import { EditorMenuOption } from '@/components/application/Editor/components/FloatingMenuEditor'
import { useEditor } from '@/hooks/useEditor'
import { useProject } from '@/hooks/useProject'
import { Mutation } from '@/services/persons/getPersonAttributeRequest'
import { useParams } from 'next/navigation'

interface MutationEditorProps {
  mutation: Mutation
  menuOptions: EditorMenuOption[]
}

export function MutationEditor({ mutation, menuOptions }: MutationEditorProps) {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { usePersons, useFile } = useProject({
    projectId,
  })
  const { persons } = usePersons()
  const { file, getTempPersistenceKey, isLoadingFile, updateFile } = useFile({
    fileId: mutation.fileId,
  })

  const { editor } = useEditor({
    preValueKey: getTempPersistenceKey(),
    onDiff: (value) => updateFileOnDiff(value),
    personsSuggestion: persons,
  })

  async function updateFileOnDiff(value: string) {
    if (isLoadingFile) return
    if (!file) return
    if (file.content === value) return

    await updateFile({ content: value })
  }

  return (
    <BlockEditor
      editor={editor}
      menuOptions={menuOptions}
      isLoading={isLoadingFile}
    />
  )
}
