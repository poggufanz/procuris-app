import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { usePO, useTransitionPO, useRejectPO } from './api'
import { poActions } from './poActions'
import { Stepper } from './Stepper'
import { RejectDialog } from './RejectDialog'
import { useAuthStore } from '@/stores/auth.store'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/format'
import { getApiError } from '@/lib/apiError'

export function PODetailPage() {
  const id = Number(useParams().id)
  const nav = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: po } = usePO(id)
  const transition = useTransitionPO(id)
  const reject = useRejectPO(id)
  const [rejectOpen, setRejectOpen] = useState(false)
  if (!po || !user) return <div>Memuat…</div>

  const actions = poActions({ status: po.status, branch_id: po.branch_id, requested_by: po.requested_by }, { id: user.id, role: user.role, branch_id: user.branch_id })
  const run = async (a: 'submit' | 'approve' | 'receive' | 'cancel') => {
    try { await transition.mutateAsync(a); toast.success(`PO di-${a}`) } catch (e) { toast.error(getApiError(e).message) }
  }
  const doReject = async (reason: string) => {
    try { await reject.mutateAsync(reason); setRejectOpen(false); toast.success('PO ditolak') } catch (e) { toast.error(getApiError(e).message) }
  }

  return (
    <div>
      <PageHeader title={po.po_number} actions={<span data-testid="po-status"><StatusBadge status={po.status} /></span>} />
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-start gap-6 p-4">
          <div className="text-sm">
            <p>Vendor #{po.vendor_id} · Cabang: {po.branch_name} ({po.branch_code})</p>
            {po.tanggal_dibutuhkan && <p>Dibutuhkan: {format.date(po.tanggal_dibutuhkan)}</p>}
          </div>
          <div className="ml-auto text-right"><div className="text-xs uppercase text-[var(--muted)]">Total</div><div className="text-xl font-bold">{format.rupiah(po.total_amount)}</div></div>
        </div>
        <div className="border-t border-[var(--border)] px-4"><Stepper status={po.status} /></div>
        <table className="w-full border-t border-[var(--border)] text-sm">
          <thead className="bg-[var(--bg)] text-left text-xs uppercase text-[var(--muted)]">
            <tr><th className="px-4 py-2">Item</th><th className="px-4 py-2 text-right">Qty</th><th className="px-4 py-2 text-right">Harga</th><th className="px-4 py-2 text-right">Subtotal</th></tr>
          </thead>
          <tbody>
            {po.items.map((it) => (
              <tr key={it.id ?? it.item_id} className="border-t border-[var(--border)]">
                <td className="px-4 py-2">{it.item_name}</td>
                <td className="px-4 py-2 text-right">{it.quantity} {it.unit}</td>
                <td className="px-4 py-2 text-right">{format.rupiah(it.unit_price)}</td>
                <td className="px-4 py-2 text-right font-mono">{format.rupiah(it.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {po.status === 'rejected' && po.rejection_reason && (
          <div className="border-t border-[var(--border)] bg-red-50 px-4 py-3 text-sm text-red-700">Alasan ditolak: {po.rejection_reason}</div>
        )}
        {actions.length > 0 && (
          <div className="flex gap-2 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3">
            {actions.includes('edit') && <Button variant="ghost" onClick={() => nav(`/purchasing/purchase-orders/${id}/edit`)}>Edit Items</Button>}
            {actions.includes('submit') && <Button onClick={() => run('submit')}>Submit</Button>}
            {actions.includes('approve') && <Button onClick={() => run('approve')}>Approve</Button>}
            {actions.includes('reject') && <Button variant="danger" onClick={() => setRejectOpen(true)}>Reject</Button>}
            {actions.includes('receive') && <Button onClick={() => run('receive')}>Receive</Button>}
            {actions.includes('cancel') && <Button variant="ghost" onClick={() => run('cancel')}>Cancel</Button>}
          </div>
        )}
      </div>
      <RejectDialog open={rejectOpen} onConfirm={doReject} onCancel={() => setRejectOpen(false)} />
    </div>
  )
}
