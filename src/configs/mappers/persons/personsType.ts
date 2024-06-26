import { PersonType } from '@/services/persons/getPersonRequest'
import { TbHorseToy } from 'react-icons/tb'
import {
  LiaUsersSolid,
  LiaUserSecretSolid,
  LiaUserShieldSolid,
} from 'react-icons/lia'
import { PiCubeFocus, PiUsersFour } from 'react-icons/pi'
import { GiBattleGear, GiEvilEyes, GiYinYang } from 'react-icons/gi'
import { Mapper } from '@/hooks/useMapper'

export const personsTypesMapper: Mapper<PersonType> = {
  [PersonType.PROTAGONIST]: {
    id: '77f848cc',
    translation: 'Protagonistas',
    name: 'protagonist',
    icon: PiCubeFocus,
  },
  [PersonType.COMIC]: {
    id: '84af70da',
    translation: 'Alivios cômico',
    name: 'comic',
    icon: TbHorseToy,
  },
  [PersonType.EXTRA]: {
    id: '7b5e7f8e',
    translation: 'Figurantes',
    name: 'extra',
    icon: LiaUsersSolid,
  },
  [PersonType.MENTOR]: {
    id: '96e8767e',
    translation: 'Mentores',
    name: 'mentor',
    icon: LiaUserSecretSolid,
  },
  [PersonType.SYMBOLIC]: {
    id: '2b9988a4',
    translation: 'Simbólicos',
    name: 'symbolic',
    icon: GiYinYang,
  },
  [PersonType.ADVERSARY]: {
    id: '3959a186',
    translation: 'Adversár1ios',
    name: 'adversary',
    icon: GiBattleGear,
  },
  [PersonType.SECONDARY]: {
    id: 'c421780e',
    translation: 'Secundarios',
    name: 'secondary',
    icon: PiUsersFour,
  },
  [PersonType.SUPPORTING]: {
    id: '0b5791be',
    translation: 'Suportes',
    name: 'supporting',
    icon: LiaUserShieldSolid,
  },
  [PersonType.ANTAGONIST]: {
    id: '17285a02',
    translation: 'Antagonistas',
    name: 'antagonist',
    icon: GiEvilEyes,
  },
} as const

export type PersonTypeMapepr = typeof personsTypesMapper
