import { Node, NodeTree } from './Node'

interface TreeProps {
  nodes: NodeTree[]
  level?: number
}

export function Tree({ nodes, level = 0 }: TreeProps) {
  return (
    <>
      {nodes.map((node) => (
        <Node key={node.id} node={node} level={level} />
      ))}
    </>
  )
}
