import { Year, YearProps, YearSkeleton } from './Year'

interface LineProps {
  years: YearProps[]
  isLoading?: boolean
}

export function Line({ years, isLoading }: LineProps) {
  if (isLoading) return <YearSkeleton />
  return (
    <>
      {years.length > 0 ? (
        years.map((year, i) => (
          <Year
            yearName={year.yearName}
            months={year.months}
            key={`${year.yearName}-${i}`}
          />
        ))
      ) : (
        <span className="text-lg font-bold opacity-60 mx-auto my-32">
          Não há eventos registrados
        </span>
      )}
    </>
  )
}
