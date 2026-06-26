import { useBranches } from './branchApi'
import { buildTree } from '@/lib/buildTree'
import { TreeView } from '@/components/shared/TreeView'

export function BranchTab() {
  const { data, isLoading } = useBranches()
  if (isLoading || !data) return <div className="py-8 text-sm text-[var(--muted)]">Memuat…</div>
  const nodes = buildTree(data, (b) => b.parent_id, (b) => ({ name: b.name, meta: b.code }))
  return <TreeView nodes={nodes} />
}
