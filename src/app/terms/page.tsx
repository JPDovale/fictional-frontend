import terms from './terms.json'
import { marked } from 'marked'

export default function TermsPage() {
  const htmlText = marked(terms.content)

  return (
    <main className="h-full flex-col bg-gray200 flex w-full max-h-screen overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto mt-6 mb-16">
        <article
          className="prose prose-invert min-w-full prose-violet text-justify"
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      </div>
    </main>
  )
}
