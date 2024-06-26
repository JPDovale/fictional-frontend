'use client'

import { BlockEditor } from '@/components/application/BlockEditor'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { useToast } from '@/components/ui/use-toast'
import { usePersons } from '@/hooks/persons/usePersons'
import { useEditor } from '@/hooks/useEditor'
import { useFile } from '@/hooks/useFile'
import { useFolders } from '@/hooks/useFolders'
import { useParams } from '@/hooks/useParams'
import { updateFileRequest } from '@/services/files/updateFileRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { useEffect, useState } from 'react'

export default function FilePage() {
  const [title, setTitle] = useState('')

  const { projectId, fileId } = useParams()

  const { toast } = useToast()
  const { persons } = usePersons({ projectId })
  const { refetchFolders } = useFolders()
  const {
    file,
    getTempPersistenceKey,
    refetchFile,
    isLoadingFile,
    updateFile,
  } = useFile({ fileId, projectId })

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

  async function handleSave() {
    if (!file || title === file?.title) {
      return
    }

    if (!/^[a-zA-Z0-9\s._@\-À-ÿ]+$/.test(file.title)) {
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
      refetchFile()
      refetchFolders()
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
    <main className="flex flex-col max-w-3xl w-full mx-auto -mt-24 py-4">
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
        </div>
      )}

      <BlockEditor editor={editor} isLoading={isLoadingFile} />
    </main>
  )
}
