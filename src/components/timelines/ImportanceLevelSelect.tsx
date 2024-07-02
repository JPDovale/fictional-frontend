import { Check } from 'lucide-react'
import { useState } from 'react'
import { Input } from '../application/Input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { tv } from 'tailwind-variants'
import { Theme } from '@/styles/theme'
import { useTheme } from '@/hooks/useTheme'
import { ImportanceLevel } from '@/services/timelines/getTimelineRequest'

const itemStyles = tv({
  base: 'relative z-[150] flex font-bold cursor-pointer  w-full select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent  data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  variants: {
    theme: {
      [Theme.DARK]: 'aria-selected:bg-gray400 bg-gray200 text-text100 ',
      [Theme.LIGHT]: 'bg-gray800',
      [Theme.SYSTEM]: '',
    },
  },
})

interface ImportanceLevelSelectProps {
  label: string
  importanceLevel?: number | null
  setImportanceLevel: (importanceLevel: ImportanceLevel) => void
}

export const importanceMapper = {
  1: 'a',
  2: 'b',
  3: 'c',
  4: 'd',
  5: 'e',
  6: 'f',
  7: 'g',
  8: 'h',
  9: 'i',
  10: 'j',
} as { [x: number]: string }

export function ImportanceLevelSelect({
  label,
  importanceLevel,
  setImportanceLevel,
}: ImportanceLevelSelectProps) {
  const [openImportanceLevelPicker, setOpenImportanceLevelPicker] =
    useState(false)

  const { theme } = useTheme()

  return (
    <Input.Root>
      <Input.Header>
        <Input.Label>{label}</Input.Label>
      </Input.Header>

      <Popover
        open={openImportanceLevelPicker}
        onOpenChange={setOpenImportanceLevelPicker}
      >
        <PopoverTrigger>
          <Input.Input
            size="sm"
            data-importance={importanceMapper[importanceLevel ?? 0]}
            data-has-importance={!!importanceLevel}
            className="font-bold data-[has-importance=true]:border-r-8 data-[importance=a]:border-r-importance1 data-[importance=b]:border-r-importance2 data-[importance=c]:border-r-importance3 data-[importance=d]:border-r-importance4 data-[importance=e]:border-r-importance5 data-[importance=f]:border-r-importance6 data-[importance=g]:border-r-importance7 data-[importance=h]:border-r-importance8 data-[importance=i]:border-r-importance9 data-[importance=j]:border-r-importance10"
          >
            <span className="text-xs">
              {importanceLevel ? `Nivel ${importanceLevel}` : 'Selecionar'}
            </span>
          </Input.Input>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="p-0 w-96 overflow-y-auto overflow-x-hidden"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              type="button"
              data-importance={importanceMapper[i + 1]}
              className={itemStyles({
                theme,
                className:
                  'font-bold border-r-8 data-[importance=a]:border-r-importance1 data-[importance=b]:border-r-importance2 data-[importance=c]:border-r-importance3 data-[importance=d]:border-r-importance4 data-[importance=e]:border-r-importance5 data-[importance=f]:border-r-importance6 data-[importance=g]:border-r-importance7 data-[importance=h]:border-r-importance8 data-[importance=i]:border-r-importance9 data-[importance=j]:border-r-importance10',
              })}
              onClick={() => {
                setImportanceLevel((i + 1) as ImportanceLevel)
                setOpenImportanceLevelPicker(false)
              }}
            >
              <Check
                data-hidden={importanceLevel !== i + 1}
                className="w-4 h-4 data-[hidden=true]:invisible mr-2"
              />

              <span className="text-xs">Nivel {i + 1}</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </Input.Root>
  )
}
