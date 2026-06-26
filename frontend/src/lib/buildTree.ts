import type { TreeNode } from '@/components/shared/TreeView'
export function buildTree<T extends { id: number }>(
  rows: T[], parentOf: (r: T) => number | null, label: (r: T) => { name: string; meta?: string },
): TreeNode[] {
  const byParent = new Map<number | null, T[]>()
  for (const r of rows) { const p = parentOf(r); byParent.set(p, [...(byParent.get(p) ?? []), r]) }
  const make = (parent: number | null): TreeNode[] =>
    (byParent.get(parent) ?? []).map((r) => ({ id: r.id, ...label(r), children: make(r.id) }))
  return make(null)
}
