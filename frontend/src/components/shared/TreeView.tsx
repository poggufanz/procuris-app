import { type ReactNode } from 'react'

export interface TreeNode { id: number; name: string; meta?: string; children: TreeNode[] }

export function TreeView({ nodes, renderActions, depth = 0 }: {
  nodes: TreeNode[]; renderActions?: (n: TreeNode) => ReactNode; depth?: number
}) {
  return (
    <ul className={depth === 0 ? 'space-y-0.5' : 'ml-[15px] space-y-0.5 border-l border-[var(--border)] pl-3.5'}>
      {nodes.map((n) => {
        const hasChildren = (n.children?.length ?? 0) > 0
        return (
          <li key={n.id}>
            <div className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--bg)]">
              <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${hasChildren ? 'bg-[var(--accent)]' : 'bg-[var(--muted)]'}`} />
              <span className="truncate font-medium text-[var(--text)]">{n.name}</span>
              {n.meta && (
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] text-[var(--muted)] ring-1 ring-inset ring-[var(--border)]">{n.meta}</span>
              )}
              {renderActions && (
                <span className="ml-auto flex shrink-0 gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                  {renderActions(n)}
                </span>
              )}
            </div>
            {hasChildren && <TreeView nodes={n.children ?? []} renderActions={renderActions} depth={depth + 1} />}
          </li>
        )
      })}
    </ul>
  )
}
