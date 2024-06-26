import { Mapper } from '@/hooks/useMapper'
import { FaQuestion } from 'react-icons/fa'
import { MdOutlineLibraryBooks } from 'react-icons/md'

export const foundationMapper: Mapper<
  'base' | 'whatHappens' | 'whyHappens' | 'whereHappens' | 'whoHappens'
> = {
  base: {
    id: '2fa9d346',
    name: 'base',
    translation: 'Fundamento',
    icon: MdOutlineLibraryBooks,
    preIcon: undefined,
  },
  whatHappens: {
    id: 'ad6aef24',
    name: 'whatHappens',
    translation: 'O que acontece?',
    icon: FaQuestion,
    preIcon: '1',
  },
  whyHappens: {
    id: 'dd5870bf',
    name: 'whyHappens',
    translation: 'Por que acontece?',
    icon: FaQuestion,
    preIcon: '2',
  },
  whereHappens: {
    id: 'c0e637d3',
    name: 'whereHappens',
    translation: 'Onde acontece?',
    icon: FaQuestion,
    preIcon: '3',
  },
  whoHappens: {
    id: '09957f88',
    name: 'whoHappens',
    translation: 'Com quem acontece?',
    icon: FaQuestion,
    preIcon: '4',
  },
}

export type FoundationMapper = typeof foundationMapper
