import {
  BuildBlock,
  BuildBlocksJson,
} from '@/services/projects/getProjectsRequest'
import { Icon, NoteBlank } from '@phosphor-icons/react'
import { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useMapper } from './useMapper'
import { buildBlocksMapper } from '@/configs/mappers/buildBlocks'
import { IconType } from 'react-icons/lib'

export function useBuildBlocks(buildBlocks: BuildBlocksJson | undefined) {
  const mapper = useMapper(buildBlocksMapper)

  function getIcon(name: keyof BuildBlocksJson): LucideIcon | Icon | IconType {
    return mapper.getIcon(name as BuildBlock) || NoteBlank
  }

  function getName(name: keyof BuildBlocksJson): string {
    return mapper.getName(name as BuildBlock) || name
  }

  const { blocksActives } = useMemo(() => {
    const buildBlocksActives: string[] = []

    if (buildBlocks) {
      Object.entries(buildBlocks).forEach(
        ([k, v]) =>
          v && buildBlocksActives.push(mapper.getName(k as BuildBlock)),
      )
    }

    return { blocksActives: buildBlocksActives }
  }, [buildBlocks, mapper])

  function isBlockActive(name: keyof BuildBlocksJson) {
    return blocksActives.includes(getName(name))
  }

  return {
    getIcon,
    getName,
    isBlockActive,
  }
}
