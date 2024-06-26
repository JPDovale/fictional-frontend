import { Mapper } from '@/hooks/useMapper'
import { Trash, UserPlus } from 'lucide-react'

export const personActionsMapper: Mapper<'new' | 'trash'> = {
  new: {
    id: 'd1d426c3',
    translation: 'Novo personagem',
    icon: UserPlus,
    name: 'new person',
  },
  trash: {
    id: '9a23be24',
    translation: 'Mover para lixeira',
    icon: Trash,
    name: 'trash',
  },
}

export type PersonActionsMapper = keyof typeof personActionsMapper
