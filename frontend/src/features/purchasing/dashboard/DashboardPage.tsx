import { Link } from 'react-router-dom'
import { usePurchasingDashboard } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { format } from '@/lib/format'

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
  </div>
}

export default function DashboardPage() {
  const { data } = usePurchasingDashboard()
  if (!data) return <div>Memuat…</div>
  return (
    <div>
      <PageHeader title="Dashboard Purchasing" />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="PO bulan ini" value={data.poThisMonth} />
        <Stat label="Menunggu approval" value={data.pendingApproval} />
        <Stat label="Total nilai PO" value={format.rupiah(data.totalValue)} />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg)] text-left text-xs uppercase text-[var(--muted)]">
            <tr><th className="px-4 py-2">No. PO</th><th className="px-4 py-2">Cabang</th><th className="px-4 py-2 text-right">Total</th><th className="px-4 py-2">Status</th></tr>
          </thead>
          <tbody>
            {data.recent.map((po) => (
              <tr key={po.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-2"><Link className="font-mono text-[var(--accent)]" to={`/purchasing/purchase-orders/${po.id}`}>{po.po_number}</Link></td>
                <td className="px-4 py-2">{po.branch_name}</td>
                <td className="px-4 py-2 text-right">{format.rupiah(po.total_amount)}</td>
                <td className="px-4 py-2"><StatusBadge status={po.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
