import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'

export interface MapperItem {
  name: string
  translation: string
  preIcon?: string
  icon?: LucideIcon | IconType
  id: string
}

export type Mapper<K extends string = string> = {
  [P in K]: MapperItem
}

export function useMapper<T>(mapper: T extends Mapper ? T : never) {
  function getName(key: keyof T) {
    return mapper[key].name
  }

  function getIcon(key: keyof T) {
    return mapper[key].icon
  }

  function getId(key: keyof T) {
    return mapper[key].id
  }

  function getTranslation(key: keyof T) {
    return mapper[key].translation
  }

  function getPreIcon(key: keyof T) {
    return mapper[key].preIcon
  }

  return { getName, getIcon, getId, getTranslation, getPreIcon }
}
