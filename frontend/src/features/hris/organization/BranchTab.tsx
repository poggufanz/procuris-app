import { useState } from 'react'
import { useBranches, useDeactivateBranch, type Branch } from './branchApi'
import { BranchForm } from './BranchForm'
import { buildTree } from '@/lib/buildTree'
import { TreeView, type TreeNode } from '@/components/shared/TreeView'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'

export function BranchTab() {
  const { data, isLoading } = useBranches()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [deactivating, setDeactivating] = useState<Branch | null>(null)
  const deactivate = useDeactivateBranch()

  if (isLoading || !data) return <div className="py-8 text-sm text-[var(--muted)]">Memuat…</div>
  const byId = new Map(data.map((b) => [b.id, b]))
  const nodes = buildTree(data, (b) => b.parent_id, (b) => ({ name: b.name, meta: b.code }))

  const confirmDeactivate = async () => {
    if (!deactivating) return
    try { await deactivate.mutateAsync(deactivating.id) } finally { setDeactivating(null) }
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => setOpen(true)}>Tambah Cabang</Button>
      </div>
      <TreeView nodes={nodes} renderActions={(n: TreeNode) => {
        const branch = byId.get(n.id)
        if (!branch) return null
        return <span className="flex gap-1">
          <Button variant="ghost" onClick={() => setEditing(branch)}>Edit</Button>
          <Button variant="ghost" onClick={() => setDeactivating(branch)}>Nonaktifkan</Button>
        </span>
      }} />
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
