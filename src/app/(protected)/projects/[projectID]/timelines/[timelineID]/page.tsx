'use client'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Line } from './components/Line'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { NotFound } from '@/components/application/NotFound'
import { SkeletonBase } from '@/components/ui/skeletonBase'
import { Calendar } from '@/components/application/Calendar'
import { monthsMapper } from '@/utils/monthsMapper'
import { CreateEventDialog } from './components/CreateEventDialog'

interface CalendarDate {
  day: number
  month: number
  year: number
  dateString: string
  numberEvents: number
}

interface CalendarDay {
  date: CalendarDate
  disabled: boolean
}

interface CalendarWeek {
  week: number
  days: CalendarDay[]
}

export default function ProjectTimelinePage() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  const { projectID, timelineID } = useParams()
  const projectId = projectID as string
  const timelineId = timelineID as string

  const { useTimeline } = useProject({ projectId })
  const { timeline, isLoadingTimeline, useEvents } = useTimeline({
    timelineId,
  })

  const { dates, datesInCronologicalOrder } = useEvents()

  const monthsWeenExistsEvent = datesInCronologicalOrder.filter(
    (event, i, self) =>
      i ===
      self.findIndex(
        (obj) =>
          obj.dateObject.month === event.dateObject.month &&
          obj.dateObject.year === event.dateObject.year,
      ),
  )

  const currentEvent = monthsWeenExistsEvent[currentEventIndex]

  const { calendarWeeks } = useMemo(() => {
    if (!currentEvent) {
      return {
        calendarWeeks: [],
      }
    }

    const currentDate = dayjs()
      .set('date', 1)
      .set('month', currentEvent.dateObject.month - 1)
      .set(
        'year',
        currentEvent.dateObject.year *
          (currentEvent.dateObject.period === -1 ? -1 : 1),
      )

    const daysInMonth = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => currentDate.set('date', i + 1))

    const firstDayOfWeek = currentDate.get('day')
    const previousMonthFillArray = Array.from({
      length: firstDayOfWeek,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - lastWeekDay - 1,
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        const year = date.get('year')
        const month = date.get('month') + 1
        const day = date.get('date')
        const dateString = `${date.get('date')}:${date.get('month') + 1}:${date
          .get('year')
          .toString()
          .replaceAll('-', '')}:${
          date.get('year').toString().includes('-') ? '-1' : '0'
        }`

        return {
          date: {
            year,
            month,
            day,
            dateString,
            numberEvents: datesInCronologicalOrder.filter(
              (dico) =>
                dico.dateObject.year *
                  (dico.dateObject.period === -1 ? -1 : 1) ===
                  year &&
                dico.dateObject.month === month &&
                dico.dateObject.day === day,
            ).length,
          },
          disabled: true,
        }
      }),
      ...daysInMonth.map((date) => {
        const year = date.get('year')
        const month = date.get('month') + 1
        const day = date.get('date')
        const dateString = `${date.get('date')}:${date.get('month') + 1}:${date
          .get('year')
          .toString()
          .replaceAll('-', '')}:${
          date.get('year').toString().includes('-') ? '-1' : '0'
        }`

        return {
          date: {
            year,
            month,
            day,
            dateString,
            numberEvents: datesInCronologicalOrder.filter(
              (dico) =>
                dico.dateObject.year *
                  (dico.dateObject.period === -1 ? -1 : 1) ===
                  year &&
                dico.dateObject.month === month &&
                dico.dateObject.day === day,
            ).length,
          },
          disabled: false,
        }
      }),
      ...nextMonthFillArray.map((date) => {
        const year = date.get('year')
        const month = date.get('month') + 1
        const day = date.get('date')
        const dateString = `${date.get('date')}:${date.get('month') + 1}:${date
          .get('year')
          .toString()
          .replaceAll('-', '')}:${
          date.get('year').toString().includes('-') ? '-1' : '0'
        }`

        return {
          date: {
            year,
            month,
            day,
            dateString,
            numberEvents: datesInCronologicalOrder.filter(
              (dico) =>
                dico.dateObject.year *
                  (dico.dateObject.period === -1 ? -1 : 1) ===
                  year &&
                dico.dateObject.month === month &&
                dico.dateObject.day === day,
            ).length,
          },
          disabled: true,
        }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeek[]>(
      (weeks, _, i, self) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: self.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return {
      calendarWeeks,
    }
  }, [currentEvent, datesInCronologicalOrder])

  function onSelectEvent(date: CalendarDate) {
    const element = document.getElementById(date.dateString)
    if (element) element.scrollIntoView()
  }

  function handleNextEvent() {
    const nextEventIndex = currentEventIndex + 1

    if (nextEventIndex >= monthsWeenExistsEvent.length) {
      setCurrentEventIndex(0)
      return
    }

    setCurrentEventIndex(nextEventIndex)
  }

  function handlePreviousEvent() {
    const previousEventIndex = currentEventIndex - 1

    if (previousEventIndex < 0) {
      setCurrentEventIndex(monthsWeenExistsEvent.length - 1)
      return
    }
    setCurrentEventIndex(previousEventIndex)
  }

  if (!timeline && !isLoadingTimeline) return <NotFound />

  return (
    <main className="flex flex-col max-w-4xl w-full mx-auto px-2 -mt-20 py-4">
      <span className="text-sm font-bold">
        Nivel de importancia dos eventos:
      </span>
      <div className="flex gap-8 w-full">
        <div className="flex flex-col w-2/3 max-lg:w-full">
          <div className="grid grid-cols-10 gap-1 mb-4 mt-1">
            <span className="text-xxs font-bold ">Nivel 1</span>
            <span className="text-xxs font-bold ">Nivel 2</span>
            <span className="text-xxs font-bold ">Nivel 3</span>
            <span className="text-xxs font-bold ">Nivel 4</span>
            <span className="text-xxs font-bold ">Nivel 5</span>
            <span className="text-xxs font-bold ">Nivel 6</span>
            <span className="text-xxs font-bold ">Nivel 7</span>
            <span className="text-xxs font-bold ">Nivel 8</span>
            <span className="text-xxs font-bold ">Nivel 9</span>
            <span className="text-xxs font-bold ">Nivel 10</span>
            <div className="h-2 bg-importance1"></div>
            <div className="h-2 bg-importance2"></div>
            <div className="h-2 bg-importance3"></div>
            <div className="h-2 bg-importance4"></div>
            <div className="h-2 bg-importance5"></div>
            <div className="h-2 bg-importance6"></div>
            <div className="h-2 bg-importance7"></div>
            <div className="h-2 bg-importance8"></div>
            <div className="h-2 bg-importance9"></div>
            <div className="h-2 bg-importance10"></div>
          </div>

          {isLoadingTimeline && (
            <SkeletonBase className="h-8 w-48 rounded-full my-6" />
          )}

          {!isLoadingTimeline && (
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold my-6">{timeline!.name}</h2>
              <CreateEventDialog />
            </div>
          )}

          <Line years={dates} isLoading={isLoadingTimeline} />
        </div>

        <div className="flex relative flex-col w-1/3 max-lg:hidden">
          <div className="fixed px-6 top-28 max-w-[19.5rem]">
            <Calendar
              title={
                currentEvent
                  ? `${currentEvent?.dateObject.year} ${
                      currentEvent?.dateObject.period === -1 ? 'A.C.' : 'D.C.'
                    } ${monthsMapper[currentEvent?.dateObject.month]}`
                  : 'Nada por aqui'
              }
              onNext={handleNextEvent}
              onPrev={handlePreviousEvent}
              calendarWeeks={calendarWeeks}
              onSelectAvailable={onSelectEvent}
              isLoading={isLoadingTimeline}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
