import {
  RxFontBold,
  RxFontItalic,
  RxLink1,
  RxQuote,
  RxStrikethrough,
} from 'react-icons/rx'
import { Editor } from '@tiptap/react'
import { tv } from 'tailwind-variants'
import { BubbleOption } from './BubbleOption'
import { Theme } from '@/styles/theme'
import { useTheme } from '@/hooks/useTheme'
import { useToast } from '@/components/ui/use-toast'
import { z } from 'zod'

const groupStyles = tv({
  base: 'flex border-r ',
  variants: {
    theme: {
      [Theme.DARK]: 'border-r-gray400',
      [Theme.LIGHT]: 'border-r-gray600',
      [Theme.SYSTEM]: '',
    },
  },
})

interface TextAlignersProps {
  editor: Editor
}

export function TextAligners({ editor }: TextAlignersProps) {
  const { theme } = useTheme()
  const { toast } = useToast()

  return (
    <div className={groupStyles({ theme })}>
      <BubbleOption
        icon={<RxFontBold className="w-4 h-4" />}
        isActive={editor.isActive('bold')}
        handler={() => editor.chain().focus().toggleBold().run()}
      />

      <BubbleOption
        icon={<RxFontItalic className="w-4 h-4" />}
        isActive={editor.isActive('italic')}
        handler={() => editor.chain().focus().toggleItalic().run()}
      />

      <BubbleOption
        icon={<RxStrikethrough className="w-4 h-4" />}
        isActive={editor.isActive('strike')}
        handler={() => editor.chain().focus().toggleStrike().run()}
      />

      <BubbleOption
        icon={<RxQuote className="w-4 h-4" />}
        isActive={editor.isActive('blockquote')}
        handler={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <BubbleOption
        isActive={editor.isActive('link')}
        icon={<RxLink1 className="w-4 h-4" />}
        handler={() => {
          const { state } = editor
          const { from, to } = state.selection

          const isLink = editor.isActive('link')

          if (isLink) {
            editor.chain().focus().unsetLink().run()
            return
          }

          const textSelected = state.doc.textBetween(from, to, '')
          const urlValidation = z.string().url()
          const isValidUrl = urlValidation.safeParse(textSelected)

          if (!isValidUrl.success) {
            toast({
              title: 'Invalid URL',
              description:
                'O link é inválido. Tente adicionar https:// na frente do texto',
              variant: 'destructive',
            })
            return
          }

          editor.chain().focus().toggleLink({ href: textSelected }).run()
        }}
      />
    </div>
  )
}
