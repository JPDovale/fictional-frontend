import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gray200 border-b border-b-purple900 px-4 py-2 fixed w-full flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <div className="flex gap-2 items-end">
          <Link
            href="/"
            className="font-bold leading-none text-xl text-gray800"
          >
            Fictional
          </Link>

          <Link
            href="https://vortecxx.com"
            target="_blank"
            className="font-bold leading-none text-xxs text-gray800 opacity-60 relative"
          >
            by Vortecxx
            <span className="text-xxs text-gray800 opacity-60 leading-none rotate-90 absolute -bottom-1.5 right-[5px]">
              {')'}
            </span>
          </Link>
        </div>
      </div>

      <nav className="flex gap-2">
        <Link
          href="/prices"
          className="text-xs text-gray800 font-bold px-4 py-1 rounded-full bg-purple800"
        >
          Preços
        </Link>

        <Link
          href="/projects"
          className="text-xs text-gray800 font-bold px-4 py-1 rounded-full bg-purple800"
        >
          Dashboard
        </Link>
      </nav>
    </header>
  )
}
