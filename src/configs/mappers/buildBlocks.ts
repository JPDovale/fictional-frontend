import { Mapper } from '@/hooks/useMapper'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { Building, Clock, Users } from 'lucide-react'
import { BsFillKanbanFill } from 'react-icons/bs'

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
  [BuildBlock.SCENES_BOARD]: {
    id: 'a1a1a1a1',
    translation: 'Quadro de cenas',
    icon: BsFillKanbanFill,
    name: 'scenesBoard',
  },
}

export type BuildBlocksMapper = typeof buildBlocksMapper
