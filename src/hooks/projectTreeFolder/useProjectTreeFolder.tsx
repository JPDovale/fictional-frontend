import { useFoundationsTreeFodler } from './useFoundationsTreeFolder'
import { usePersonsTreeFolder } from './usePersonsTreeFolder'
import { useHomeTreeFolder } from './useHomeTreeFolder'
import { useTimelinesTreeFolder } from './useTimelinesTreeFolder'
import { useSettingsTreeFolder } from './useSettingsTreeFolder'
import { useQuitProjectTreeFolder } from './useQuitProjectTreeFolder'
import { useFoldersTreeFolder } from './useFoldersTreeFolder'
import { useDrawTreeFolder } from './useDrawTreeFolder'

export function useProjectTreeFolder() {
  const homeNode = useHomeTreeFolder()
  const foundationNode = useFoundationsTreeFodler()
  const personsNode = usePersonsTreeFolder()
  const timelinesNode = useTimelinesTreeFolder()
  const settingsNode = useSettingsTreeFolder()
  const drawNode = useDrawTreeFolder()
  const quitNode = useQuitProjectTreeFolder()
  const foldersNodes = useFoldersTreeFolder()

  return [
    homeNode,
    foundationNode,
    personsNode,
    timelinesNode,
    ...foldersNodes,
    drawNode,
    settingsNode,
    quitNode,
  ]
}
