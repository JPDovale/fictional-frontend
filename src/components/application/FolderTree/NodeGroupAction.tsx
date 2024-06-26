import {
  ContextMenuGroup,
  ContextMenuLabel,
} from '@/components/ui/context-menu'
import { ActionGroup } from './Node'
import { NodeAction } from './NodeAction'

interface NodeGroupActionProps {
  group: ActionGroup
  setIsToShowInput: (value: boolean) => void
}

export function NodeGroupAction({
  group,
  setIsToShowInput,
}: NodeGroupActionProps) {
  return (
    <ContextMenuGroup key={group.title}>
      <ContextMenuLabel className="py-0.5 px-1.5">
        {group.title}
      </ContextMenuLabel>

      {group.actions.map((action) => (
        <NodeAction
          key={action.label}
          action={action}
          setIsToShowInput={setIsToShowInput}
        />
      ))}
    </ContextMenuGroup>
  )
}
