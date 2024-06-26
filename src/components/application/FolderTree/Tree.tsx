import { Node, NodeTree } from './Node'

interface TreeProps {
  nodes: NodeTree[]
  level?: number
  nodeSelected: string
  setNodeSelected: (node: string) => void
}

export function Tree({
  nodes,
  level = 0,
  nodeSelected,
  setNodeSelected,
}: TreeProps) {
  return (
    <>
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          level={level}
          nodeSelected={nodeSelected}
          setNodeSelected={setNodeSelected}
        />
      ))}
    </>
  )
}
