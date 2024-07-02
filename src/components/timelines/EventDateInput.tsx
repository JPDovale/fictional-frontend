import { Check, Trash } from 'lucide-react'
import { useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '../application/Input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../application/Button'
import { Theme } from '@/styles/theme'
import { tv } from 'tailwind-variants'
import { useTheme } from '@/hooks/useTheme'

const itemStyles = tv({
  base: 'relative flex font-bold cursor-pointer  w-full select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent  data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  variants: {
    theme: {
      [Theme.DARK]: 'aria-selected:bg-gray400 bg-gray200 text-text100 ',
      [Theme.LIGHT]: 'bg-gray800',
      [Theme.SYSTEM]: '',
    },
  },
})

interface EventDateInputProps {
  label: string
  day: UseFormRegisterReturn
  month: UseFormRegisterReturn
  year: UseFormRegisterReturn
  hour: UseFormRegisterReturn
  minute: UseFormRegisterReturn
  second: UseFormRegisterReturn
  setPeriod: (period: -1 | 0) => void
  period?: number | null
  isWithCleaner?: boolean
  onClean?: () => void
}

export function EventDateInput({
  label,
  setPeriod,
  period,
  minute,
  second,
  hour,
  year,
  month,
  day,
  isWithCleaner = false,
  onClean,
}: EventDateInputProps) {
  const [openDatePeriodPicker, setOpenDatePeriodPicker] = useState(false)

  const { theme } = useTheme()

  return (
    <Input.Root>
      <Input.Header>
        <Input.Label>{label}</Input.Label>
      </Input.Header>

      <div
        data-with-clear={isWithCleaner}
        className="grid grid-cols-7 gap-1 data-[with-clear=true]:grid-cols-8"
      >
        <Input.Input size="sm">
          <Input.TextInput {...day} />
        </Input.Input>

        <Input.Input size="sm">
          <Input.TextInput {...month} />
        </Input.Input>

        <Input.Input size="sm">
          <Input.TextInput {...year} />
        </Input.Input>

        <Popover
          open={openDatePeriodPicker}
          onOpenChange={setOpenDatePeriodPicker}
        >
          <PopoverTrigger>
            <Input.Input size="sm">
              <span className="text-xs">
                {period === -1 ? 'A.C.' : period === 0 ? 'D.C.' : 'Selecionar'}
              </span>
            </Input.Input>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-64 max-h-36 flex flex-col overflow-x-hidden">
            <button
              className={itemStyles({ theme })}
              type="button"
              onClick={() => {
                setPeriod(-1)
                setOpenDatePeriodPicker(false)
              }}
            >
              <Check
                data-hidden={period !== -1}
                className="w-4 h-4 data-[hidden=true]:invisible mr-2"
              />

              <span className="text-xs">Antes de Cristo</span>
            </button>

            <button
              className={itemStyles({ theme })}
              type="button"
              onClick={() => {
                setPeriod(0)
                setOpenDatePeriodPicker(false)
              }}
            >
              <Check
                data-hidden={period !== 0}
                className="w-4 h-4 data-[hidden=true]:invisible mr-2"
              />

              <span className="text-xs">Depois de Cristo</span>
            </button>
          </PopoverContent>
        </Popover>

        <Input.Input size="sm">
          <Input.TextInput {...hour} />
        </Input.Input>

        <Input.Input size="sm">
          <Input.TextInput {...minute} />
        </Input.Input>

        <Input.Input size="sm">
          <Input.TextInput {...second} />
        </Input.Input>

        {isWithCleaner && (
          <Button.Root
            type="button"
            size="sm"
            className="shadow-none"
            onClick={() => onClean?.()}
          >
            <Button.Icon>
              <Trash />
            </Button.Icon>
          </Button.Root>
        )}

        <span className="text-xs font-bold opacity-60">Dia</span>
        <span className="text-xs font-bold opacity-60">Mês</span>
        <span className="text-xs font-bold opacity-60">Ano</span>
        <span className="text-xs font-bold opacity-60">Prd</span>
        <span className="text-xs font-bold opacity-60">Hora</span>
        <span className="text-xs font-bold opacity-60">Min</span>
        <span className="text-xs font-bold opacity-60">Sec</span>
      </div>
    </Input.Root>
  )
}
