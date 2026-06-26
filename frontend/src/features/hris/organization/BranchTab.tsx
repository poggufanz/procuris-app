import { useState } from 'react'
import { useBranches, useDeactivateBranch, type Branch } from './branchApi'
import { BranchForm } from './BranchForm'
import { buildTree } from '@/lib/buildTree'
import { TreeView, type TreeNode } from '@/components/shared/TreeView'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/shared/Skeleton'
import { Button } from '@/components/ui/button'

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow)]'

export function BranchTab() {
  const { data, isLoading } = useBranches()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [deactivating, setDeactivating] = useState<Branch | null>(null)
  const deactivate = useDeactivateBranch()

  if (isLoading || !data) {
    return (
      <div className={`${cardClass} space-y-2`} role="status" aria-busy="true" aria-label="Memuat cabang">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9" />)}
      </div>
    )
  }

  const byId = new Map(data.map((b) => [b.id, b]))
  const nodes = buildTree(data, (b) => b.parent_id, (b) => ({ name: b.name, meta: b.code }))

  const confirmDeactivate = async () => {
    if (!deactivating) return
    try { await deactivate.mutateAsync(deactivating.id) } finally { setDeactivating(null) }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm text-[var(--muted)] tabular-nums">{data.length} cabang</span>
        <Button onClick={() => setOpen(true)}>Tambah Cabang</Button>
      </div>

      <div className={`${cardClass} motion-safe:animate-[login-rise_.4s_cubic-bezier(.16,1,.3,1)]`}>
        {data.length === 0
          ? <EmptyState text="Belum ada cabang" />
          : <TreeView nodes={nodes} renderActions={(n: TreeNode) => {
              const branch = byId.get(n.id)
              if (!branch) return null
              return <>
                <Button variant="ghost" onClick={() => setEditing(branch)}>Edit</Button>
                <Button variant="ghost" onClick={() => setDeactivating(branch)}>Nonaktifkan</Button>
              </>
            }} />}
      </div>

      <Modal open={open} title="Tambah Cabang" onClose={() => setOpen(false)}>
        <BranchForm onDone={() => setOpen(false)} />
      </Modal>
      <Modal open={!!editing} title="Edit Cabang" onClose={() => setEditing(null)}>
        {editing && <BranchForm branch={editing} onDone={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog open={!!deactivating} title="Nonaktifkan cabang?"
        message={deactivating ? `Cabang "${deactivating.name}" akan dinonaktifkan.` : undefined}
        onConfirm={confirmDeactivate} onCancel={() => setDeactivating(null)} />
    </div>
  )
}
