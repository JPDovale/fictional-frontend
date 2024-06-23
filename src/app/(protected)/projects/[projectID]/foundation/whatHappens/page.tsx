'use client'

import { BlockEditor } from '@/components/application/BlockEditor'
import { NotFound } from '@/components/application/NotFound'
import { useEditor } from '@/hooks/useEditor'
import { useProject } from '@/hooks/useProject'
import { useParams } from 'next/navigation'

export default function FoundationWhatHappensPage() {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { useFoundation, usePersons } = useProject({ projectId })
  const {
    foundation,
    updateFoundation,
    isLoadingFoundation,
    getTempPersistenceKey,
  } = useFoundation()
  const { persons } = usePersons()

  function updateFoundationOnDiff(value: string) {
    if (isLoadingFoundation) return
    if (!foundation) return
    if (foundation.whatHappens === value) return

    updateFoundation({ whatHappens: value })
  }

  const { editor } = useEditor({
    preValueKey: getTempPersistenceKey('whatHappens'),
    onDiff: (value) => updateFoundationOnDiff(value),
    personsSuggestion: persons,
  })

  if (!foundation && !isLoadingFoundation) return <NotFound />

  return (
    <main className="flex flex-col max-w-3xl w-full mx-auto py-4">
      <h2 className="text-3xl font-bold mb-4">O que acontece?</h2>

      <BlockEditor
        title="O que acontece?"
        editor={editor}
        isLoading={isLoadingFoundation}
      />
    </main>
  )
}
