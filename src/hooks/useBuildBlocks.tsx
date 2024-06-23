import { BuildBlocksJson } from '@/services/projects/getProjectsRequest'
import { NoteBlank } from '@phosphor-icons/react'
import { Building, Clock, LucideIcon, Users } from 'lucide-react'
import { useMemo } from 'react'

const BuildBlocksIconsMap = {
  FOUNDATION: Building,
  PERSONS: Users,
  TIME_LINES: Clock,
} as const

const BuildBlocksNamesMap = {
  FOUNDATION: 'Fundação',
  PERSONS: 'Personagens',
  TIME_LINES: 'Linhas de tempo',
} as const

export function useBuildBlocks(buildBlocks: BuildBlocksJson | undefined) {
  function getIcon(name: keyof BuildBlocksJson): LucideIcon {
    return BuildBlocksIconsMap[name] || NoteBlank
  }

  function getName(name: keyof BuildBlocksJson): string {
    return BuildBlocksNamesMap[name] || name
  }

  const { blocksActives } = useMemo(() => {
    const buildBlocksActives: string[] = []

    if (buildBlocks) {
      Object.entries(buildBlocks).forEach(
        ([k, v]) =>
          v && buildBlocksActives.push(getName(k as keyof BuildBlocksJson)),
      )
    }

    return { blocksActives: buildBlocksActives }
  }, [buildBlocks])

  function isBlockActive(name: keyof BuildBlocksJson) {
    return blocksActives.includes(getName(name))
  }

  return {
    getIcon,
    getName,
    isBlockActive,
  }
}
