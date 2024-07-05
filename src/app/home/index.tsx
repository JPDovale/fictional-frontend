import { Header } from '@/components/application/Header'
import {
  Anvil,
  ArrowUpFromLine,
  ArrowUpRight,
  BicepsFlexed,
  Blocks,
  CircleHelp,
  Cloud,
  Headset,
  Milestone,
  ScanText,
  Sprout,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="bg-gray100 flex flex-col overflow-x-hidden min-h-screen max-h-screen overflow-y-auto pb-16">
      <Header />

      <main className="w-full max-w-6xl mx-auto p-4 text-gray800">
        <h1 className="font-extrabold text-8xl pt-40 text-center text-violet-300 leading-[6rem] max-lg:text-7xl">
          O lugar onde sua <br />
          história se torna real
        </h1>
        <div className="mt-6 p-[2px] w-full bg-purple800 max-w-xl shadow-xl shadow-violet-50 mx-auto rounded-full" />
        <h2 className="text-2xl font-semibold text-center mt-14 max-md:text-xl">
          Feito para escritores de espírito incontrolável,
          <br /> grandes mentes e artistas inesquecíveis
        </h2>
        <Link
          className="bg-purple800 px-4 py-2 rounded-full w-fit text-sm flex gap-2 items-center mt-12 mx-auto"
          href="/login"
        >
          Começe grátis agora <ArrowUpRight size={14} />
        </Link>
        <section className="mt-40 text-gray800 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <div className="max-lg:hidden"></div>
          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl font-bold flex gap-2 items-start">
              Bem-vindo à Fictional! <Cloud className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Aqui, a paixão pela escrita se une à inovação tecnológica para
              oferecer uma plataforma revolucionária. Nossa equipe, liderada por
              um escritor visionário e programador autodidata, está comprometida
              em transformar a maneira como escritores criam e compartilham suas
              histórias.
            </p>
          </div>
          <h4 className="text-3xl font-bold flex self-end border-b pb-4 border-b-purple800 gap-2 items-start pt-32">
            Por que Escolher a Fictional?{' '}
            <CircleHelp className="min-w-8 min-h-8" />
          </h4>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Experiência Pessoal <BicepsFlexed className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Nosso fundador, um escritor apaixonado e autor de cinco livros,
              entende os desafios que escritores enfrentam. Esta experiência
              pessoal nos impulsiona a criar soluções verdadeiramente inovadoras
              para você.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Compromisso com a Excelência <Anvil className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Na Fictional, buscamos sempre os mais altos padrões de qualidade.
              Nossa missão é garantir que sua experiência com nossa plataforma
              seja excepcional.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Comunidade Vibrante <Users className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Ao se juntar à Fictional, você faz parte de uma comunidade global
              de escritores apaixonados e visionários. Encontre suporte,
              inspiração e oportunidades ilimitadas para crescer e prosperar
              como escritor.
            </p>
          </div>

          <h4 className="text-3xl font-bold flex self-end border-b pb-4 border-b-purple800 gap-2 items-start pt-32">
            O que podemos oferecer? <CircleHelp className="min-w-8 min-h-8" />
          </h4>
          <div />
          <div />

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Simplicidade e Eficiência{' '}
              <Milestone className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              O Fictional oferece uma interface intuitiva e amigável que
              simplifica o processo de escrita. Com uma plataforma organizada,
              você pode focar no que realmente importa: sua criatividade.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 overflow-hidden">
            <Image
              src="/exemplo1.png"
              width={1200}
              height={1200}
              alt="exemplo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border rounded-lg border-purple800 overflow-hidden">
            <Image
              src="/exemplo2.png"
              width={1200}
              height={1200}
              alt="exemplo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border rounded-lg border-purple800 overflow-hidden">
            <Image
              src="/exemplo3.png"
              width={1200}
              height={1200}
              alt="exemplo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Resultados Profissionais <ScanText className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Recursos avançados, como um editor de texto moderno. Ainda
              adicionaremos verificação de gramática e sugestões estilísticas,
              que elevam a qualidade da sua escrita a um nível profissional.
              Garantindo uma narrativa impecável que prende a atenção do leitor
              do início ao fim.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Suporte Personalizado <Headset className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Além de uma plataforma robusta, oferecemos suporte contínuo e
              personalizado. Nossa equipe está sempre disponível para ajudar,
              garantindo que suas necessidades sejam atendidas em cada etapa do
              processo.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Inovação Constante <ArrowUpFromLine className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Estamos sempre explorando novas maneiras de aprimorar nossa
              plataforma. Desde a implementação de inteligência artificial até a
              criação de mapas interativos, estamos comprometidos em fornecer as
              ferramentas mais avançadas para escritores.
            </p>
          </div>

          <div className="border rounded-lg border-purple800 p-4">
            <h4 className="text-3xl flex font-bold gap-2 items-start">
              Fictional Flow <Blocks className="min-w-8 min-h-8" />
            </h4>
            <p className="mt-4 max-w-md">
              Uma estrutura organizacional e criativa baseada em blocos, o
              Fictional Flow guia você em cada passo do processo de escrita.
              Planeje personagens, cenários e enredos de maneira integrada e
              coesa.
            </p>
          </div>
        </section>

        <h3 className="text-4xl font-bold mt-24 flex gap-2 items-start">
          Seu Futuro na Escrita Começa Aqui{' '}
          <Sprout className="min-w-10 min-h-10" />
        </h3>
        <p className="mt-4 max-w-lg text-lg">
          Não espere mais para realizar seu potencial como escritor. Junte-se a
          nós na Fictional e descubra um mundo de possibilidades emocionantes
          para sua escrita. Seu futuro na escrita começa aqui - e estamos
          ansiosos para fazer parte dessa jornada ao seu lado.
        </p>
        <h2 className="text-6xl font-bold  mt-40 text-center">
          Junte-se à Revolução <br /> Literária
        </h2>

        <p className="mt-4 text-center max-w-lg text-xl mx-auto">
          Transforme suas ideias em realidade com a Fictional. A revolução
          literária começa agora - e você está convidado a fazer parte dela.
        </p>
        <Link
          className="bg-purple800 px-4 py-2 rounded-full w-fit text-sm flex gap-2 items-center mt-12 mx-auto"
          href="/login"
        >
          Começe grátis agora <ArrowUpRight size={14} />
        </Link>
      </main>
    </section>
  )
}
