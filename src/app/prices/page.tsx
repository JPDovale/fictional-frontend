import { Header } from '@/components/application/Header'
import { NotFound } from '@/components/application/NotFound'
import { getPricesRequest } from '@/services/products/getPricesRequest'
import { BookCopy, Check, NotebookPen, PencilLine, Power } from 'lucide-react'
import Link from 'next/link'

export default async function PricesPage() {
  const response = await getPricesRequest()

  const prices = (response.data?.prices ?? []).sort(
    (a, b) => a.amount - b.amount,
  )

  if (prices.length < 3) {
    return <NotFound />
  }

  return (
    <section className="bg-gray100 flex flex-col overflow-x-hidden min-h-screen max-h-screen overflow-y-auto">
      <Header />

      <main className="w-full max-w-6xl mx-auto p-4 text-gray800">
        <h1 className="font-extrabold text-3xl pt-16 text-center text-violet-300">
          Venha fazer parte da nossa familia
        </h1>
        <div className="mt-2 p-[2px] w-full bg-purple800 max-w-xl shadow-xl shadow-violet-50 mx-auto rounded-full" />

        <ul className="grid grid-cols-4 gap-4 mt-8">
          <li className="border rounded-lg flex flex-col border-purple800 p-4">
            <h4 className="font-bold text-4xl w-full flex gap-2 items-center text-importance2">
              Sonhador <Power className="min-w-7 font-bold min-h-7 w-7 h-7" />
            </h4>

            <span className="font-bold text-lg opacity-60 mt-1">
              R$ 0,00 / mês
            </span>

            <div className="my-2 mt-6 p-px w-full bg-purple800 max-w-sm shadow-xl shadow-violet-50 mx-auto rounded-full" />

            <p className="mt-4 text-sm mb-4">
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  1 Projeto por conta
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  8 Personagens por projeto
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  80 Atributos de personagens por projeto
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  1 Mutação de atributo para cada atributo
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Blocos essenciais - (Fundação, Personagens, Linhas de tempo)
                </li>
              </ul>
            </p>

            <Link
              href="/login"
              className="bg-purple800 text-sm px-5 py-1.5 flex rounded-full mx-auto mt-auto"
            >
              Começar agora grátis
            </Link>
          </li>

          <li className="border rounded-lg flex flex-col border-purple800 p-4">
            <h4 className="font-bold text-4xl w-full flex gap-2 items-center text-importance1">
              Explorador{' '}
              <PencilLine className="min-w-7 font-bold min-h-7 w-7 h-7" />
            </h4>

            <span className="font-bold text-lg opacity-60 mt-1">
              <s className="font-bold mt-1 text-xxs opacity-60 mr-1">
                De{' '}
                {((prices[0]?.amount + 500) / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}{' '}
              </s>
              {(prices[0]?.amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}{' '}
              / mês
            </span>

            <div className="my-2 mt-6 p-px w-full bg-purple800 max-w-sm shadow-xl shadow-violet-50 mx-auto rounded-full" />

            <p className="mt-4 text-sm mb-4">
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Projetos ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Personagens ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Atributos de personagens ilimitados por projeto
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Mutações de atributo ilimitadas para cada atributo
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Criação de pastas e arquivos avulsos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Todos os Blocos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Acesso a comunidade exclusiva
                </li>
              </ul>
            </p>

            <Link
              href={`/login?priceId=${prices[0]?.id}`}
              className="bg-purple800 text-sm px-5 py-1.5 flex rounded-full mx-auto mt-auto"
            >
              Começar agora
            </Link>
          </li>

          <li className="border rounded-lg border-purple800 flex flex-col p-4">
            <h4 className="font-bold text-4xl w-full flex gap-2 items-center text-importance4">
              Criador{' '}
              <NotebookPen className="min-w-7 font-bold min-h-7 w-7 h-7" />
            </h4>

            <span className="font-bold text-lg opacity-60 mt-1">
              <s className="font-bold mt-1 text-xxs opacity-60 mr-1">
                De{' '}
                {(113.6).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}{' '}
              </s>
              {(prices[1]?.amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}{' '}
              / 6 mês
            </span>

            <div className="my-2 mt-6 p-px w-full bg-purple800 max-w-sm shadow-xl shadow-violet-50 mx-auto rounded-full" />

            <p className="mt-4 text-sm">
              <ul className="flex flex-col gap-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Projetos ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Personagens ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Atributos de personagens ilimitados por projeto
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Mutações de atributo ilimitadas para cada atributo
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Criação de pastas e arquivos avulsos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Todos os Blocos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Acesso a comunidade exclusiva
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Aparecer na timeline da plataforma
                </li>
              </ul>
            </p>

            <Link
              href={`/login?priceId=${prices[1].id}`}
              className="bg-purple800 text-sm px-5 py-1.5 flex rounded-full mx-auto mt-auto"
            >
              Começar agora
            </Link>
          </li>

          <li className="border rounded-lg border-purple800 flex flex-col p-4">
            <h4 className="font-bold text-4xl w-full flex gap-2 items-center text-importance6">
              Realizador{' '}
              <BookCopy className="min-w-7 font-bold min-h-7 w-7 h-7" />
            </h4>
            <span className="font-bold text-lg opacity-60 mt-1">
              <s className="font-bold mt-1 text-xxs opacity-60 mr-1">
                De{' '}
                {(239.54).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}{' '}
              </s>
              {(prices[2]?.amount / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}{' '}
              / ano
            </span>
            <div className="my-2 mt-6 p-px w-full bg-purple800 max-w-sm shadow-xl shadow-violet-50 mx-auto rounded-full" />
            <p className="mt-4 text-sm">
              <ul className="flex flex-col gap-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Projetos ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Personagens ilimitados
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Atributos de personagens ilimitados por projeto
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Mutações de atributo ilimitadas para cada atributo
                </li>

                <li className="flex items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Criação de pastas e arquivos avulsos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Todos os Blocos
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Acesso a comunidade exclusiva
                </li>

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Aparecer na timeline da plataforma
                </li>

                {/* <li className="flex  items-start gap-2"> */}
                {/*   <Check */}
                {/*     className="text-importance2 min-w-5 minh-w-5" */}
                {/*     size={16} */}
                {/*   /> */}
                {/*   Comcorrer a premios anuais */}
                {/* </li> */}

                <li className="flex  items-start gap-2">
                  <Check
                    className="text-importance2 min-w-5 minh-w-5"
                    size={16}
                  />
                  Acesso antecipado a atualizações
                </li>
              </ul>
            </p>
            <Link
              href={`/login?priceId=${prices[2].id}`}
              className="bg-purple800 text-sm px-5 py-1.5 flex rounded-full mx-auto mt-auto"
            >
              Começar agora
            </Link>
          </li>
        </ul>
      </main>
    </section>
  )
}
