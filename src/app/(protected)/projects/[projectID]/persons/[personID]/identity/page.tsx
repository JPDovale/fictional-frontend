'use client'

import { BlockEditor } from '@/components/application/BlockEditor'
import { Button } from '@/components/application/Button'
import { NotFound } from '@/components/application/NotFound'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { useEditor } from '@/hooks/useEditor'
import { useProject } from '@/hooks/useProject'
import { Trash } from '@phosphor-icons/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UpdatePersonForm } from '../components/UpdatePersonForm'
import { IdentityPersonCard } from '../components/IdentityPersonCard'
import { AttributesCards } from '../components/AttributesCards'

export default function PersonPage() {
  const [editIsOpen, setEditIsOpen] = useState(false)
  const { projectID, personID } = useParams()

  const projectId = projectID as string
  const personId = personID as string

  const { usePersons, usePerson, useDeletingPerson } = useProject({
    projectId,
  })
  const { persons: personsWithSelected, refetchPersons } = usePersons()
  const { person, getTempPersistenceKey, updatePerson, isLoadingPerson } =
    usePerson({
      personId,
    })
  const { setDeletingPerson } = useDeletingPerson()

  const { editor } = useEditor({
    preValueKey: getTempPersistenceKey(),
    onDiff: (value) => updatePersonOnDiff(value),
    personsSuggestion: personsWithSelected,
  })

  async function updatePersonOnDiff(value: string) {
    if (isLoadingPerson) return
    if (!person) return
    if (person.history === value) return

    await updatePerson({ history: value })
    refetchPersons()
  }

  useEffect(() => {
    setEditIsOpen(false)
  }, [personId])

  if (!person && !isLoadingPerson) return <NotFound />

  return (
    <main className="flex flex-col max-w-3xl w-full mx-auto -mt-24 py-4">
      {isLoadingPerson && (
        <SkeletonBase className="mb-4 w-64 h-10 rounded-full" />
      )}
      {!isLoadingPerson && (
        <h2 className="text-3xl font-bold mb-4">{person?.name}</h2>
      )}

      {editIsOpen ? (
        <>
          <UpdatePersonForm onEdited={() => setEditIsOpen(false)} />

          <div className="flex flex-col gap-2 py-16">
            <span className="text-xl font-bold opacity-60 text-fullError uppercase">
              Zona de risco
            </span>

            <Button.Root
              onClick={() => setDeletingPerson(person!.id)}
              width="full"
              className="shadow-none bg-fullError data-[disabled=false]:hover:bg-fullError/80"
            >
              <Button.Icon>
                <Trash />
              </Button.Icon>
              <Button.Text>Mover para lixeira</Button.Text>
            </Button.Root>
          </div>
        </>
      ) : (
        <>
          <IdentityPersonCard onEdit={() => setEditIsOpen(true)} />

          <BlockEditor
            title={`História de ${person?.name}`}
            editor={editor}
            isLoading={isLoadingPerson}
          />

          <AttributesCards />
        </>
      )}
    </main>
  )
}
