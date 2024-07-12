import { Mapper } from '@/hooks/useMapper'
import { Folder, Home, LogOut, Settings, Trash } from 'lucide-react'
import { TbLayoutBoard } from 'react-icons/tb'

export const projectBaseMapper: Mapper<
  'project' | 'settings' | 'home' | 'logout' | 'trash' | 'folders' | 'draw'
> = {
  project: {
    name: 'project',
    translation: 'Projeto',
    id: 'c70e2c29',
  },
  settings: {
    name: 'settings',
    translation: 'Configurações',
    id: 'ef8a0be2',
    icon: Settings,
  },
  draw: {
    name: 'draw',
    translation: 'Desenho',
    id: '45de5a29',
    icon: TbLayoutBoard,
  },

  home: {
    name: 'home',
    translation: 'Inicio',
    id: 'c5879043',
    icon: Home,
  },
  logout: {
    name: 'logout',
    translation: 'Sair',
    id: 'c2c92209',
    icon: LogOut,
  },
  trash: {
    name: 'trash',
    translation: 'Mover para lixeira',
    id: 'a0f0e9d4',
    icon: Trash,
  },
  folders: {
    name: 'folders',
    translation: 'Pastas',
    id: 'f0a9b2e9',
    icon: Folder,
  },
}

export type ProjectBaseMapper = typeof projectBaseMapper
