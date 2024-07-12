import { useFoundationsTreeFodler } from './useFoundationsTreeFolder'
import { usePersonsTreeFolder } from './usePersonsTreeFolder'
import { useHomeTreeFolder } from './useHomeTreeFolder'
import { useTimelinesTreeFolder } from './useTimelinesTreeFolder'
import { useSettingsTreeFolder } from './useSettingsTreeFolder'
import { useQuitProjectTreeFolder } from './useQuitProjectTreeFolder'
import { useFoldersTreeFolder } from './useFoldersTreeFolder'

export function useProjectTreeFolder() {
  const homeNode = useHomeTreeFolder()
  const foundationNode = useFoundationsTreeFodler()
  const personsNode = usePersonsTreeFolder()
  const timelinesNode = useTimelinesTreeFolder()
  const settingsNode = useSettingsTreeFolder()
  const quitNode = useQuitProjectTreeFolder()
  const foldersNodes = useFoldersTreeFolder()

  return [
    homeNode,
    foundationNode,
    personsNode,
    timelinesNode,
    ...foldersNodes,
    settingsNode,
    quitNode,
  ]
}
