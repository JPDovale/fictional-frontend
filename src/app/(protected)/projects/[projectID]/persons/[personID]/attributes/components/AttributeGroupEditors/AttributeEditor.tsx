import { BlockEditor } from '@/components/application/BlockEditor'
import { Button } from '@/components/application/Button'
import { EditorMenuOption } from '@/components/application/Editor/components/FloatingMenuEditor'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { useToast } from '@/components/ui/use-toast'
import { useEditor } from '@/hooks/useEditor'
import { useProject } from '@/hooks/useProject'
import { updateFileRequest } from '@/services/files/updateFileRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AttributeEditorProps {
  menuOptions: EditorMenuOption[]
}

export function AttributeEditor({ menuOptions }: AttributeEditorProps) {
  const [title, setTitle] = useState('')

  const { attributeID, projectID, personID } = useParams()
  const attributeId = attributeID as string
  const projectId = projectID as string
  const personId = personID as string

  const { toast } = useToast()
  const {
    usePersonsAttributes,
    usePersons,
    useFile,
    usePerson,
    useDeletingPersonAttribute,
  } = useProject({
    projectId,
  })
  const { setDeletingPersonAttribute } = useDeletingPersonAttribute()
  const { persons } = usePersons()
  const { refetchPerson, useAttribute } = usePerson({ personId })
  const { refetchAttributes } = usePersonsAttributes()
  const { attribute } = useAttribute({ attributeId })
  const {
    file,
    getTempPersistenceKey,
    refetchFile,
    isLoadingFile,
    updateFile,
  } = useFile({ fileId: attribute?.fileId })

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
    await refetchAttributes()
    refetchPerson()
  }

  async function handleSave() {
    console.log({ file })

    if (!file || title === file?.title) {
      return
    }

    if (!/^[a-zA-Z0-9\s._@-]+$/.test(file.title)) {
      toast({
        title: 'Error',
        description: 'Titulo inválido! Evite simbolos e acentos',
        variant: 'destructive',
      })
      return
    }

    const response = await updateFileRequest({
      title,
      fileId: file.id,
      projectId,
    })

    if (response.status !== StatusCode.OK) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
      return
    }

    if (response.status === StatusCode.OK) {
      refetchAttributes()
      refetchFile()
      refetchPerson()
    }
  }

  useEffect(() => {
    setTitle(file?.title ?? '')
  }, [file?.title])

  if (!file && !isLoadingFile)
    return (
      <>
        <SkeletonBase className="mb-4 w-64 h-10 rounded-full" />
        <BlockEditor editor={null} />
      </>
    )

  return (
    <>
      {isLoadingFile && (
        <SkeletonBase className="mb-4 w-64 h-10 rounded-full" />
      )}

      {!isLoadingFile && (
        <div className="flex justify-between items-start">
          <input
            className="text-3xl font-bold mb-4 bg-transparent outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
          />

          <Button.Root
            onClick={() => setDeletingPersonAttribute(attribute!.id)}
            className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
            size="xs"
          >
            <Button.Icon>
              <Trash />
            </Button.Icon>
          </Button.Root>
        </div>
      )}

      <BlockEditor
        editor={editor}
        menuOptions={menuOptions}
        isLoading={isLoadingFile}
      />
    </>
  )
}
