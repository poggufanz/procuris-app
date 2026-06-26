import { useState } from 'react'
import { usePositions, useDeletePosition, type Position } from './positionApi'
import { PositionForm } from './PositionForm'
import { buildTree } from '@/lib/buildTree'
import { TreeView, type TreeNode } from '@/components/shared/TreeView'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/shared/Skeleton'
import { Button } from '@/components/ui/button'

const LEVELS: Record<number, string> = { 1: 'Staff', 2: 'Supervisor', 3: 'Manager', 4: 'Direktur' }
const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow)]'

export function PositionTab() {
  const { data, isLoading } = usePositions()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Position | null>(null)
  const [deleting, setDeleting] = useState<Position | null>(null)
  const del = useDeletePosition()

  if (isLoading || !data) {
    return (
      <div className={`${cardClass} space-y-2`} role="status" aria-busy="true" aria-label="Memuat jabatan">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9" />)}
      </div>
    )
  }

  const byId = new Map(data.map((p) => [p.id, p]))
  const nodes = buildTree(data, (p) => p.parent_position_id, (p) => ({ name: p.name, meta: `${LEVELS[p.level]} · ${p.division}` }))

  const confirmDelete = async () => {
    if (!deleting) return
    try { await del.mutateAsync(deleting.id) } finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm text-[var(--muted)] tabular-nums">{data.length} jabatan</span>
        <Button onClick={() => setOpen(true)}>Tambah Jabatan</Button>
      </div>

      <div className={`${cardClass} motion-safe:animate-[login-rise_.4s_cubic-bezier(.16,1,.3,1)]`}>
        {data.length === 0
          ? <EmptyState text="Belum ada jabatan" />
          : <TreeView nodes={nodes} renderActions={(n: TreeNode) => {
              const pos = byId.get(n.id)
              if (!pos) return null
              return <>
                <Button variant="ghost" onClick={() => setEditing(pos)}>Edit</Button>
                <Button variant="ghost" onClick={() => setDeleting(pos)}>Hapus</Button>
              </>
            }} />}
      </div>

      <Modal open={open} title="Tambah Jabatan" onClose={() => setOpen(false)}>
        <PositionForm onDone={() => setOpen(false)} />
      </Modal>
      <Modal open={!!editing} title="Edit Jabatan" onClose={() => setEditing(null)}>
        {editing && <PositionForm position={editing} onDone={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog open={!!deleting} title="Hapus jabatan?"
        message={deleting ? `Jabatan "${deleting.name}" akan dihapus.` : undefined}
        onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
    </div>
  )
}
