'use client'
import { BlockEditor } from '@/components/application/BlockEditor'
import { NotFound } from '@/components/application/NotFound'
import { useEditor } from '@/hooks/useEditor'
import { useProject } from '@/hooks/useProject'
import { useParams } from 'next/navigation'

export default function FoundationFoundationPage() {
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
    if (foundation.foundation === value) return

    updateFoundation({ foundation: value })
  }

  const { editor } = useEditor({
    preValueKey: getTempPersistenceKey('foundation'),
    onDiff: (value) => updateFoundationOnDiff(value),
    personsSuggestion: persons,
  })

  if (!foundation && !isLoadingFoundation) return <NotFound />

  return (
    <main className="flex flex-col max-w-3xl w-full mx-auto py-4">
      <h2 className="text-3xl font-bold mb-4">Fundamento</h2>
      {/* <span className="text-sm text-justify bg-white/10 p-4 rounded-lg backdrop-blur-[3px] shadow-xl border border-white/30 border-b-black/30 border-r-black/30 font-bold"> */}
      {/*   A fundação é primeiro e mais importante bloco de uma história, uma vez */}
      {/*   que basta uma fundação bem definida, o resto gira em torno dessa */}
      {/*   fundação de uma forma elementar. Personagens, acontecimentos, mundos */}
      {/*   inteiros derivam da fundação de uma história e se essa fundação estiver */}
      {/*   mal definida, todo está comprometido. */}
      {/* </span> */}

      <BlockEditor
        title="Fundamento"
        content={
          <span className="text-sm text-justify">
            Se refere ao princípio ou razão básica que serve de alicerce para
            uma teoria, argumento, crença ou prática. Neste sentido, um
            fundamento é a base lógica ou o motivo pelo qual algo existe ou é
            feito.
            <br />
            <br />
            Considerando que o fundamento é o bloco base da Fundação, devemos o
            deixar claro, objetivo, conciso e direto ao ponto, sem fazer menções
            a personagens, a mundos ou cenas específicas...
            <br /> <br />
            Dê uma causa para a ideia central, um motivo do porquê aquilo é do
            jeito que é. Então coloque um verbo que motive a busca por algo,
            seja o que for e assim essa frase terá vida própria.
            <br /> <br />A ideia é se concentrar na filosofia da história.
          </span>
        }
        isLoading={isLoadingFoundation}
        editor={editor}
      />
    </main>
  )
}
