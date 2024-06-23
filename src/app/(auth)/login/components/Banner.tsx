'use client'
import { useTheme } from '@/hooks/useTheme'

export function Banner() {
  const { theme } = useTheme()

  return (
    <section
      data-theme={theme}
      className="bg-gray800 z-10 data-[theme=dark]:bg-gray200 flex flex-col gap-8 px-20 justify-center absolute top-0 left-0 bottom-0 w-1/2"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-7xl font-heading">Fictional</h2>
        <p className="text-lg font-bold">Desbloqueie seu Potencial Criativo!</p>
      </div>

      <hr className="opacity-30" />

      <p className="text-justify">
        Descubra o Fictional, onde escritores transformam ideias em histórias
        memoráveis com facilidade e confiança.
      </p>

      <p className="text-justify">
        Com nossa interface intuitiva e ferramentas avançadas, prometemos
        simplificar seu processo de escrita e elevar sua narrativa a um novo
        nível profissional.
      </p>

      <p className="text-justify">
        Junte-se a nós agora e comece sua jornada para se tornar um autor de
        destaque!
      </p>
    </section>
  )
}
