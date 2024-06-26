import { Mapper } from '@/hooks/useMapper'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import {
  Apple,
  BedDouble,
  Bike,
  Cigarette,
  Fingerprint,
  HeartCrack,
  Leaf,
  LoaderCircle,
  Route,
  ScanFace,
  Siren,
  Target,
} from 'lucide-react'

export const attributesTypeMapper: Mapper<AttributeType> = {
  [AttributeType.APPEARANCE]: {
    id: 'f0fd5d14',
    name: 'appearances',
    translation: 'Aparências',
    icon: ScanFace,
  },
  [AttributeType.DREAM]: {
    id: '234a7bdd',
    name: 'dreams',
    translation: 'Sonhos',
    icon: BedDouble,
  },
  [AttributeType.OBJECTIVE]: {
    id: 'e1b10162',
    name: 'objectives',
    translation: 'Objetivos',
    icon: Target,
  },
  [AttributeType.PERSONALITY]: {
    id: 'f5f5f5f5',
    name: 'personalities',
    translation: 'Personalidades',
    icon: Fingerprint,
  },
  [AttributeType.TRAUMA]: {
    id: 'f0fd5d34',
    name: 'traumas',
    translation: 'Traumas',
    icon: HeartCrack,
  },
  [AttributeType.VALUE]: {
    id: 'f0fd5d54',
    name: 'values',
    translation: 'Valores',
    icon: Leaf,
  },
  [AttributeType.HOBBY]: {
    id: 'f0fd5d74',
    name: 'hobbies',
    translation: 'Hobbies',
    icon: Bike,
  },
  [AttributeType.FEAR]: {
    id: 'f0fd5d94',
    name: 'fears',
    translation: 'Medos',
    icon: Siren,
  },
  [AttributeType.MOTIVATION]: {
    id: 'f0fd5asdaw',
    name: 'motivations',
    translation: 'Motivações',
    icon: Route,
  },
  [AttributeType.ADDICTION]: {
    id: '100c8c33',
    name: 'addictions',
    translation: 'Vicios',
    icon: Cigarette,
  },
  [AttributeType.DESIRE]: {
    id: '5de2a1e3',
    name: 'desires',
    translation: 'Desejos',
    icon: Apple,
  },
  [AttributeType.HABIT]: {
    id: 'ff47966e',
    name: 'habits',
    translation: 'Haibitos',
    icon: LoaderCircle,
  },
} as const

export type AttributeTypeMapper = typeof attributesTypeMapper
