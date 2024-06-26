import type { Metadata } from 'next'
import {
  Cinzel,
  Cinzel_Decorative,
  Fira_Code,
  Roboto,
  Uncial_Antiqua,
} from 'next/font/google'
import '../styles/globals.css'
import { QueryProvider } from '@/services/QueryProvider'
import { Toaster } from '@/components/ui/toaster'
import { PreloadProvider } from '@/services/PreloadProvider'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true,
  variable: '--font-roboto',
})
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true,
  variable: '--font-fira-code',
})
const uncialAntiqua = Uncial_Antiqua({
  subsets: ['latin'],
  weight: ['400'],
  preload: true,
  variable: '--font-uncial-antiqua',
})
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true,
  variable: '--font-cinzel',
})
const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400'],
  preload: true,
  variable: '--font-cinzel-decorative',
})

const fonts = [roboto, uncialAntiqua, cinzel, cinzelDecorative, firaCode]

export const metadata: Metadata = {
  title: 'Fictional',
  description: 'The magic occurs in here',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={fonts.map((f) => f.variable).join(' ')}>
        <QueryProvider>
          <PreloadProvider>{children}</PreloadProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
