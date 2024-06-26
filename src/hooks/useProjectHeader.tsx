import { useMemo, useState } from 'react'
import { z } from 'zod'

import { useProject } from './useProject'
import { usePathname } from 'next/navigation'
import { Optional } from '@/shared/types/types/Optional'
import {
  ProjectPageHeader,
  ProjectPageHeaderProps,
} from '@/components/projects/ProjectPageHeader'

export function useProjectHeader() {
  const [projectId, setProjectId] = useState<string>('')
  const [personId, setPersonId] = useState<string>('')
  const [attributeId, setAttributeId] = useState<string>('')
  const [timelineId, setTimelineId] = useState<string>('')
  const [fileId, setFileId] = useState<string>('')

  const { project, usePerson, useFile, useTimeline } = useProject({
    projectId,
  })
  const { person, useAttribute } = usePerson({ personId })
  const { attribute } = useAttribute({ attributeId })
  const { file } = useFile({ fileId: attribute?.fileId ?? fileId })
  const { timeline } = useTimeline({ timelineId })

  const pathname = usePathname()

  const { paths } = useMemo(() => {
    const _paths: string[] = []

    const pathsMapper: { [x: string]: string } = {
      projects: 'Projeto',
      foundation: 'Fundação',
      persons: 'Personagens',
      timelines: 'Linhas de tempo',
      config: 'Configurações',
      base: 'Fundamento',
      whatHappens: 'O quê acontece?',
      whereHappens: 'Onde acontece?',
      whyHappens: 'Por que acontece?',
      whoHappens: 'Com quem acontece?',
      new: 'Novo(a)',
      identity: 'Identidade',
      appearances: 'Aparências',
      dreams: 'Sonhos',
      objectives: 'Objetivos',
      personalities: 'Personalidades',
      traumas: 'Traumas',
      values: 'Valores',
      hobbies: 'Hobbies',
      fears: 'Medos',
      motivations: 'Motivações',
      addictions: 'Vicios',
      desires: 'Desejos',
      habits: 'Habitos',
      edit: 'Editar',
      'build-blocks': 'Bloco de construção',
      attributes: 'Atributos',
      files: 'Arquivos',
    }

    const uuidsPathsMapper: { [x: string]: string } = {
      projects: project?.name ?? '',
      persons: person?.name ?? '',
      appearances: file?.title ?? '',
      dreams: file?.title ?? '',
      objectives: file?.title ?? '',
      personalities: file?.title ?? '',
      traumas: file?.title ?? '',
      values: file?.title ?? '',
      hobbies: file?.title ?? '',
      fears: file?.title ?? '',
      motivations: file?.title ?? '',
      addictions: file?.title ?? '',
      desires: file?.title ?? '',
      habits: file?.title ?? '',
      timelines: timeline?.name ?? '',
      files: file?.title ?? '',
    }

    function makePath(rawPath: string, rawPaths: string[], index: number) {
      const path = pathsMapper[rawPath] ?? rawPath

      const isUUIDSchema = z.string().uuid()
      const isUUID = isUUIDSchema.safeParse(rawPath).success

      if (!isUUID) return path

      const previousRawPath = rawPaths[index - 1]
      const pathMapped = uuidsPathsMapper[previousRawPath] ?? ''

      if (previousRawPath === 'projects') {
        setProjectId(rawPath)
      }

      if (previousRawPath === 'persons') {
        setPersonId(rawPath)
      }

      if (previousRawPath === 'files') {
        setFileId(rawPath)
      }

      const prevForFile = [
        'appearances',
        'dreams',
        'objectives',
        'personalities',
        'traumas',
        'values',
        'hobbies',
        'fears',
        'motivations',
        'addictions',
        'desires',
        'habits',
      ]

      if (prevForFile.includes(previousRawPath)) {
        setAttributeId(rawPath)
      }

      if (previousRawPath === 'timelines') {
        setTimelineId(rawPath)
      }

      return pathMapped
    }

    const rawPaths = pathname.split('/').slice(1)
    const mappedPaths = rawPaths.map((rawPath, index) =>
      makePath(rawPath, rawPaths, index),
    )

    _paths.push(...mappedPaths)

    return { paths: _paths }
  }, [pathname, project?.name, person?.name, file?.title, timeline?.name])

  return {
    paths,
    Header: ({ ...props }: Optional<ProjectPageHeaderProps, 'projectId'>) => (
      <ProjectPageHeader projectId={projectId} {...props} />
    ),
  }
}
