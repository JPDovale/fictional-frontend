'use client'
import { useToast } from '@/components/ui/use-toast'
import { useEffect } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export default function DrawPage() {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: 'ATENÇÃO!',
      description:
        'Os dodos do draw não são vinculados a sua conta e sim ao seu dispositivo. Isso sgnifica que tudo nessa página será perdido caso você acesse em outro dispositivo ou navegador.',
    })
  }, [toast])

  return (
    <main className="w-full absolute h-screen -top-48 pr-8 pt-12">
      <Tldraw className="rounded-xl" persistenceKey="fictional-tl-key" />
    </main>
  )
}
