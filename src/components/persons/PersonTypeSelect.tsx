import { tv } from 'tailwind-variants'
import { Input } from '../application/Input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Theme } from '@/styles/theme'
import { useState } from 'react'
import { PersonType } from '@/services/persons/getPersonRequest'
import { useTheme } from '@/hooks/useTheme'
import { Check } from 'lucide-react'

const itemStyles = tv({
  base: 'relative flex font-bold cursor-pointer bg-gray200 w-full select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent  data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  variants: {
    theme: {
      [Theme.DARK]: 'aria-selected:bg-gray400 text-text100 ',
      [Theme.LIGHT]: '',
      [Theme.SYSTEM]: '',
    },
  },
})

export type PersonTypeValue = {
  label: string
  value: PersonType
}

const types: PersonTypeValue[] = [
  {
    label: 'Protagonista',
    value: PersonType.PROTAGONIST,
  },
  {
    label: 'Antagonista',
    value: PersonType.ANTAGONIST,
  },
  {
    label: 'Alivio comico',
    value: PersonType.COMIC,
  },
  {
    label: 'Figurante',
    value: PersonType.EXTRA,
  },
  {
    label: 'Suporte',
    value: PersonType.SUPPORTING,
  },
  {
    label: 'Secundário',
    value: PersonType.SECONDARY,
  },
  {
    label: 'Adversário',
    value: PersonType.ADVERSARY,
  },
  {
    label: 'Simbólico',
    value: PersonType.SYMBOLIC,
  },
  {
    label: 'Mentor',
    value: PersonType.MENTOR,
  },
]

interface PersonTypeSelectProps {
  typeSelected: PersonType
  setTypeSelected: (type: PersonType) => void
}

export function PersonTypeSelect({
  typeSelected,
  setTypeSelected,
}: PersonTypeSelectProps) {
  const [openTypePicker, setOpenTypePicker] = useState(false)

  const { theme } = useTheme()

  const personTypeSelected =
    types.find((t) => t.value === typeSelected) ?? types[3]

  return (
    <Input.Root>
      <Input.Header>
        <Input.Label>Tipo do personagem</Input.Label>
      </Input.Header>

      <Popover open={openTypePicker} onOpenChange={setOpenTypePicker}>
        <PopoverTrigger>
          <Input.Input size="sm">
            <span className="text-xs">{personTypeSelected?.label}</span>
          </Input.Input>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-64 max-h-80 overflow-auto overflow-x-hidden">
          {types.map((t) => (
            <button
              type="button"
              key={t.label}
              className={itemStyles({ theme })}
              onClick={() => {
                const v = t.label.toUpperCase() as PersonType

                setTypeSelected(
                  v === personTypeSelected.label ? PersonType.EXTRA : t.value,
                )
                setOpenTypePicker(false)
              }}
            >
              <Check
                data-hidden={typeSelected !== t.value.toUpperCase()}
                className="w-4 h-4 data-[hidden=true]:invisible mr-2"
              />

              {t.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </Input.Root>
  )
}
