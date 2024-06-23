import { useInterfaceStore } from '@/stores/useInterfaceStore'

export function useFolderTree() {
  const { setNodeIdSelected, nodeIdSelected } = useInterfaceStore((state) => ({
    nodeIdSelected: state.nodeIdSelected,
    setNodeIdSelected: state.setNodeIdSelected,
  }))

  return {
    nodeIdSelected,
    setNodeIdSelected,
  }
}
