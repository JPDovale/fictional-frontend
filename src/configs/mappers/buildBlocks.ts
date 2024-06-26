import { Mapper } from '@/hooks/useMapper'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { Building, Clock, Users } from 'lucide-react'

export const buildBlocksMapper: Mapper<BuildBlock> = {
  [BuildBlock.FOUNDATION]: {
    id: 'f215ac3a',
    translation: 'Fundação',
    icon: Building,
    name: 'foundation',
  },
  [BuildBlock.PERSONS]: {
    id: 'c995d656',
    translation: 'Personagens',
    icon: Users,
    name: 'persons',
  },
  [BuildBlock.TIME_LINES]: {
    id: '3beedae5',
    translation: 'Linhas de tempo',
    icon: Clock,
    name: 'timelines',
  },
}

export type BuildBlocksMapper = typeof buildBlocksMapper
