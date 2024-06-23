import { importanceMapper } from '@/components/timelines/ImportanceLevelSelect'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { useProject } from '@/hooks/useProject'
import { Event } from '@/services/timelines/getTimelineRequest'
import { normalizeEventDate } from '@/utils/normalizeEventDate'
import { useParams } from 'next/navigation'
import { z } from 'zod'

interface DayProps {
  event: Event
}

export function DayEventSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <SkeletonBase className="w-3 h-3 rounded-full bg-gray400 shadow-defaultDark -ml-1.5 mt-1" />
        <SkeletonBase className="h-3 w-52 rounded-full" />
      </div>
      <SkeletonBase className="ml-3 h-10 w-full rounded-lg mb-6" />
    </div>
  )
}

export function DayEvent({ event }: DayProps) {
  const { projectID } = useParams()
  const projectId = projectID as string

  const { usePersonsAttributes, usePersons } = useProject({ projectId })
  const { attributes } = usePersonsAttributes()
  const { persons } = usePersons()

  const isUUIDSchema = z.string().uuid()

  const ids = event.event
    .split('$=')
    .filter((slc) => isUUIDSchema.safeParse(slc.split('=')[0]).success)
    .map((id) => id.split('='))

  let eventDesc = event.event

  ids.forEach((prop) => {
    const toReplace = `$=${prop[0]}=${prop[1]}$=`

    if (prop[1] === 'attr') {
      const attr = attributes.find((attr) => attr.id === prop[0])
      eventDesc = eventDesc.replace(
        toReplace,
        `"${attr?.file.title ?? 'Untitled'}"`,
      )
    }

    if (prop[1] === 'pers') {
      const pers = persons.find((pers) => pers.id === prop[0])
      eventDesc = eventDesc.replace(toReplace, pers?.name ?? '??????')
    }
  })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div
          className="w-3 h-3 bg-gray400 rounded-full shadow-defaultDark -ml-1.5 mt-1 data-[importance=a]:bg-importance1 data-[importance=b]:bg-importance2 data-[importance=c]:bg-importance3 data-[importance=d]:bg-importance4 data-[importance=e]:bg-importance5 data-[importance=f]:bg-importance6 data-[importance=g]:bg-importance7 data-[importance=h]:bg-importance8 data-[importance=i]:bg-importance9 data-[importance=j]:bg-importance10"
          data-importance={importanceMapper[event.importanceLevel]}
        />

        <span className="text-xs opacity-60 font-bold">
          {normalizeEventDate(event.date)}
        </span>
      </div>

      <p className="ml-3 text-sm text-justify w-full p-2 rounded-lg shadow-defaultDark mb-6">
        {eventDesc}
      </p>
    </div>
  )
}
