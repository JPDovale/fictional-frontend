import { useState } from 'react'
import { Input } from '../application/Input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { tv } from 'tailwind-variants'
import { Theme } from '@/styles/theme'
import { useTheme } from '@/hooks/useTheme'
import { Check, VenetianMask } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

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

interface PersonsSelectProps {
  title: string
  personSelectedId?: string
  setPersonSelectedId: (id: string | null) => void
}

export function PersonsSelect({
  title,
  personSelectedId = '',
  setPersonSelectedId,
}: PersonsSelectProps) {
  const [openPersonPicker, setOpenPersonPicker] = useState(false)

  const { projectID, personID } = useParams()
  const projectId = projectID as string
  const personId = personID as string

  const { theme } = useTheme()
  const { usePersons } = useProject({ projectId })
  const { persons } = usePersons()

  const personsSelected = persons?.find((p) => p.id === personSelectedId)

  return (
    <Input.Root>
      <Input.Header>
        <Input.Label>{title}</Input.Label>
      </Input.Header>

      <Popover open={openPersonPicker} onOpenChange={setOpenPersonPicker}>
        <PopoverTrigger>
          <Input.Input size="sm">
            <span className="text-xs">
              {personsSelected?.name ?? 'Selecionar'}
            </span>
          </Input.Input>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-64 max-h-72 overflow-auto overflow-x-hidden">
          {persons
            ?.filter((p) => p.id !== personId)
            .map((p) => (
              <button
                type="button"
                className={itemStyles({ theme })}
                key={p.id}
                onClick={() => {
                  if (p.id === personSelectedId) {
                    setPersonSelectedId(null)
                    setOpenPersonPicker(false)
                    return
                  }
                  setPersonSelectedId(p.id)
                  setOpenPersonPicker(false)
                }}
              >
                <Check
                  data-hidden={personSelectedId !== p.id}
                  className="w-4 h-4 data-[hidden=true]:invisible mr-2"
                />

                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage
                    src={p.image.url ?? undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="border border-purple800 bg-transparent">
                    <VenetianMask className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs">{p.name}</span>
              </button>
            ))}
        </PopoverContent>
      </Popover>
    </Input.Root>
  )
}
