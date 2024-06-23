'use client'
import './styles.css'
import { EditorContent, Editor as EditorTipTap } from '@tiptap/react'
import { tv } from 'tailwind-variants'
import {
  EditorMenuOption,
  FloatingMenuEditor,
} from './components/FloatingMenuEditor'
import { BubbleMenuEditor } from './components/BubbleMenuEditor'
import { EditorSkeleton } from './components/EditorSkeleton'
import { useTheme } from '@/hooks/useTheme'
import { Theme } from '@/styles/theme'

const editorStyles = tv({
  base: 'min-w-[45rem] max-w-[45rem] prose prose-purple group',
  variants: {
    theme: {
      [Theme.DARK]: 'prose-invert',
      [Theme.LIGHT]: '',
      [Theme.SYSTEM]: '',
    },
  },
})

interface EditorProps {
  editor: EditorTipTap | null
  menuOptions: EditorMenuOption[]
  isLoading?: boolean
}

export function Editor({
  editor,
  menuOptions = [],
  isLoading = false,
}: EditorProps) {
  const { theme } = useTheme()

  // const { findPerson } = usePersons((state) => ({
  //   findPerson: state.findPerson,
  // }));

  if (!editor || isLoading) return <EditorSkeleton />

  function handleDoubleClick() {
    // if (!editor) return
    // const { $from } = editor.state.selection
    // const node = $from.nodeBefore?.toString()
    // if (node !== 'mention') return
    // const mention = $from.nodeBefore?.attrs.id as string
    // const idOfMention = mention.split('<==>')[1]
    // const person = findPerson(idOfMention)
    // if (person) {
    //   setPathname({
    //     routerParameterized: RoutesAvailable.projectPerson.to(
    //       person.projectId,
    //       person.id,
    //     ),
    //   })
    // }
  }

  return (
    <>
      <EditorContent
        data-theme={theme}
        className={editorStyles({ theme })}
        editor={editor}
        onDoubleClick={handleDoubleClick}
      />
      <FloatingMenuEditor editor={editor} menuOptions={menuOptions} />
      <BubbleMenuEditor editor={editor} />
    </>
  )
}
