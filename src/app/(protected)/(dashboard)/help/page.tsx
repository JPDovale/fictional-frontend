'use client'
import { marked } from 'marked'
import helpText from './help.json'
import { useTheme } from '@/hooks/useTheme'

export default function HelpPage() {
  const { theme } = useTheme()
  const htmlText = marked(helpText.content)

  return (
    <main className="h-full flex-col flex w-full overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto mt-6 mb-16">
        <article
          data-theme={theme}
          className="prose data-[theme=dark]:prose-invert min-w-full prose-violet text-justify"
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      </div>
    </main>
  )
}
