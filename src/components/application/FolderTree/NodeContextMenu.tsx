import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { ChevronDown } from 'lucide-react'
import { NodeGroupAction } from './NodeGroupAction'
import { useTheme } from '@/hooks/useTheme'
import { NodeTree } from './Node'
import { NodeAction } from './NodeAction'
import { useState } from 'react'

interface NodeContexMenuProps {
  handleNodeClick: () => void
  node: NodeTree
  closed?: boolean
}

export function NodeContextMenu({
  node: {
    name,
    childs,
    icon: Icon,
    actions = [],
    acctionGroups = [],
    preIcon,
    onInputBlur,
  },
  closed,
  handleNodeClick,
}: NodeContexMenuProps) {
  const [isToShowInput, setIsToShowInput] = useState(false)
  const [value, setValue] = useState('')
  const { theme } = useTheme()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          data-theme={theme}
          type="button"
          onClick={() => !isToShowInput && handleNodeClick()}
          className="text-xs leading-none py-[0.3125rem] flex items-center gap-2 hover:bg-gray200 data-[theme=light]:hover:bg-gray800"
        >
          <div className="w-3.5 h-3.5">
            {childs && childs.length > 0 && (
              <div
                data-closed={closed}
                className="w-full h-full data-[closed=true]:-rotate-90"
              >
                <ChevronDown size={16} className="opacity-40" />
              </div>
            )}
          </div>

          {preIcon && (
            <span className="font-bold opacity-60 text-sm">{preIcon}</span>
          )}

          {Icon && (
            <Icon className="-ml-1 w-3.5 h-3.5 min-w-3.5 min-h-3.5 max-w-3.5 max-h-3.5 font-bold opacity-60 " />
          )}

          {!isToShowInput && (
            <span className="w-full opacity-60 font-bold">{name}</span>
          )}

          {isToShowInput && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (onInputBlur) onInputBlur(value)
                setIsToShowInput(false)
                setValue('')
              }}
            >
              <input
                onBlur={() => {
                  setIsToShowInput(false)
                  setValue('')
                }}
                placeholder="Digite o novo name..."
                className="w-full bg-transparent opacity-60 outline-none font-bold placeholder:opacity-30"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
          )}
        </button>
      </ContextMenuTrigger>

      {(actions.length > 0 || acctionGroups.length > 0) && (
        <ContextMenuContent className="w-56 flex flex-col gap-0 p-0.5">
          {actions.map((action) => (
            <NodeAction
              key={action.label}
              action={action}
              setIsToShowInput={setIsToShowInput}
            />
          ))}

          {actions.length > 0 && <ContextMenuSeparator />}

          {acctionGroups.map((group, i) => (
            <>
              <NodeGroupAction
                group={group}
                setIsToShowInput={setIsToShowInput}
              />
              {i < acctionGroups.length - 1 && <ContextMenuSeparator />}
            </>
          ))}
        </ContextMenuContent>
      )}
    </ContextMenu>
  )
}
