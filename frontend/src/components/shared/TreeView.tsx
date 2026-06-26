import { type ReactNode } from 'react'
export interface TreeNode { id: number; name: string; meta?: string; children: TreeNode[] }

export function TreeView({ nodes, renderActions, depth = 0 }: {
  nodes: TreeNode[]; renderActions?: (n: TreeNode) => ReactNode; depth?: number
}) {
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--bg)]" style={{ marginLeft: depth * 16 }}>
            <span className="font-medium">{n.name}</span>
            {n.meta && <span className="text-xs text-[var(--muted)]">{n.meta}</span>}
            {renderActions && <span className="ml-auto">{renderActions(n)}</span>}
          </div>
          {n.children.length > 0 && <TreeView nodes={n.children} renderActions={renderActions} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  )
}
