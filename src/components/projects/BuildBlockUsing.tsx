import { useBuildBlocks } from '@/hooks/useBuildBlocks'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { BuildBlock } from '@/services/projects/getProjectsRequest'
import { Theme } from '@/styles/theme'
import { useParams } from 'next/navigation'
import { tv } from 'tailwind-variants'

const buildBlockUsingStyles = tv({
  base: 'flex flex-col items-center gap-1.5  p-2 rounded-md',
  variants: {
    theme: {
      [Theme.DARK]: 'bg-gray300 shadow-defaultDark',
      [Theme.LIGHT]: 'bg-gray700 shadow-default',
      [Theme.SYSTEM]: '',
    },
  },
})

interface BuildBlockUsingProps {
  buildBlock: BuildBlock
}

export function BuildBlockUsing({ buildBlock }: BuildBlockUsingProps) {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { theme } = useTheme()
  const { project } = useProject({ projectId })
  const { getIcon, getName } = useBuildBlocks(project?.buildBlocks)

  const Icon = getIcon(buildBlock)
  const name = getName(buildBlock)

  return (
    <div className={buildBlockUsingStyles({ theme })}>
      <Icon className="fill-purple900 w-8 h-8" />

      <span className="text-sm uppercase font-bold text-center opacity-70">
        {name}
      </span>
    </div>
  )
}
