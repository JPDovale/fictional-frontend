import { Button } from '@/components/application/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { useProject } from '@/hooks/useProject'
import { useTheme } from '@/hooks/useTheme'
import { normalizeEventDate } from '@/utils/normalizeEventDate'
import { Pen, VenetianMask } from 'lucide-react'
import { useParams } from 'next/navigation'

interface IndentityPersonCardProps {
  onEdit: () => void
}

interface PersonCardSkeletonProps {
  withTimeline?: boolean
}

function IdentityPersonCardSkeleton({
  withTimeline = true,
}: PersonCardSkeletonProps) {
  const { theme } = useTheme()
  return (
    <div
      data-theme={theme}
      className="flex flex-col bg-gray100/30 data-[theme=light]:bg-gray900/30 relative shadow-2xl backdrop-blur-sm rounded-lg gap-4 p-4 mb-4"
    >
      <div className="flex items-center gap-8 max-sm:flex-col">
        <SkeletonBase className="min-h-48 min-w-48 rounded-full" />

        <div className="flex flex-col w-full gap-6 h-full">
          <div className="flex flex-col gap-1">
            <SkeletonBase className="h-3 w-28 rounded-full" />
            <SkeletonBase className="h-4 w-40 rounded-full" />
          </div>

          {withTimeline && (
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <SkeletonBase className="h-3 w-32 rounded-full" />
                <SkeletonBase className="h-4 w-40 rounded-full" />
              </div>
              <div className="flex flex-col gap-1">
                <SkeletonBase className="h-3 w-24 rounded-full" />
                <SkeletonBase className="h-4 w-16 rounded-full" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <SkeletonBase className="h-3 w-24 rounded-full" />
              <SkeletonBase className="h-4 w-44 rounded-full" />
            </div>
            <div className="flex flex-col gap-1">
              <SkeletonBase className="h-3 w-24 rounded-full" />
              <SkeletonBase className="h-4 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function IdentityPersonCard({ onEdit }: IndentityPersonCardProps) {
  const { projectID, personID } = useParams()
  const projectId = projectID as string
  const personId = personID as string

  const { theme } = useTheme()
  const { usePersons, usePerson, project } = useProject({ projectId })
  const { persons } = usePersons()
  const { person, isLoadingPerson } = usePerson({ personId })

  const mother = persons.find((p) => p.id === person?.motherId)
  const father = persons.find((p) => p.id === person?.fatherId)

  if (isLoadingPerson) {
    return (
      <IdentityPersonCardSkeleton
        withTimeline={project?.buildBlocks.TIME_LINES}
      />
    )
  }

  return (
    <div
      data-theme={theme}
      className="flex flex-col bg-gray100/30 data-[theme=light]:bg-gray900/30 relative shadow-2xl backdrop-blur-sm rounded-lg gap-4 p-4"
    >
      <div className="flex items-center max-sm:flex-col gap-8">
        <Avatar className="w-48 h-48 ">
          <AvatarImage
            src={person!.image.url ?? undefined}
            className="object-cover"
          />
          <AvatarFallback className="bg-transparent border border-purple900">
            <VenetianMask />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-4 w-full h-full">
          <div className="flex flex-col">
            <span className="text-xs font-bold opacity-60">Nome completo</span>
            <span className="text-sm">{person!.name}</span>
          </div>

          {project?.buildBlocks.TIME_LINES && (
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-60">
                  Data de nascimento
                </span>
                <span className="text-xs font-bold">
                  {normalizeEventDate(person!.birthDate?.date)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-60">
                  Data de óbito
                </span>
                <span className="text-xs font-bold">
                  {normalizeEventDate(person!.deathDate?.date)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold opacity-60">Nome do Pai</span>
              <span className="text-sm">{father?.name ?? '??????'}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold opacity-60">Nome da Mãe</span>
              <span className="text-sm">{mother?.name ?? '??????'}</span>
            </div>
          </div>
        </div>
      </div>

      <Button.Root
        size="sm"
        width="hug"
        className="absolute  max-sm:top-4 right-4"
        onClick={onEdit}
      >
        <Button.Icon>
          <Pen />
        </Button.Icon>
      </Button.Root>
    </div>
  )
}
