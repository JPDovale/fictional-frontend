import { useRouter } from 'next/navigation'
import { Action } from './Node'
import { isString } from 'lodash'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { useTheme } from '@/hooks/useTheme'

interface NodeActionProps {
  action: Action
  setIsToShowInput: (b: boolean) => void
}

export function NodeAction({ action, setIsToShowInput }: NodeActionProps) {
  const { theme } = useTheme()
  const navigate = useRouter()

  function handleClick() {
    const res = action.action()

    if (res === 'input') {
      setIsToShowInput(true)
      return
    }

    if (res && isString(res)) {
      navigate.push(res)
    }
  }

  return (
    <ContextMenuItem
      disabled={action.disabled ?? false}
      onClick={handleClick}
      data-theme={theme}
      key={action.label}
      className="w-full flex text-text800 gap-2 items-center hover:bg-gray700 cursor-pointer font-body data-[theme=dark]:hover:bg-gray300 px-2 py-0.5 data-[theme=dark]:text-text100"
    >
      {action.icon && (
        <action.icon
          size={16}
          data-type={action.type}
          className=" font-bold opacity-60  data-[type=danger]:fill-fullError/80"
        />
      )}

      <span
        data-type={action.type}
        className="opacity-60 w-full data-[type=danger]:text-fullError"
      >
        {action.label}
      </span>

      {action.postIcon && <action.postIcon className="fill-importance5" />}
    </ContextMenuItem>
  )
}
