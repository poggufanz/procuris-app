import { usePositions } from './positionApi'
import { buildTree } from '@/lib/buildTree'
import { TreeView } from '@/components/shared/TreeView'

const LEVELS: Record<number, string> = { 1: 'Staff', 2: 'Supervisor', 3: 'Manager', 4: 'Direktur' }

export function PositionTab() {
  const { data, isLoading } = usePositions()
  if (isLoading || !data) return <div className="py-8 text-sm text-[var(--muted)]">Memuat…</div>
  const nodes = buildTree(data, (p) => p.parent_position_id, (p) => ({ name: p.name, meta: `${LEVELS[p.level]} · ${p.division}` }))
  return <TreeView nodes={nodes} />
}
