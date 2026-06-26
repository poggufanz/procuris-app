import { Link } from 'react-router-dom'
import { usePurchasingDashboard } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { Spinner } from '@/components/shared/Spinner'
import { StatusBadge, type POStatus } from '@/components/shared/StatusBadge'
import { format } from '@/lib/format'

const PO_STATUSES: POStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'received', 'cancelled']

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
  </div>
}

export default function DashboardPage() {
  const { data, isError } = usePurchasingDashboard()
  if (isError) return <div className="p-6 text-sm text-[var(--muted)]">Gagal memuat dashboard. Coba muat ulang.</div>
  if (!data) return <Spinner />
  const counts = new Map(data.byStatus.map((b) => [b.status, b.count]))
  return (
    <div>
      <PageHeader title="Dashboard Purchasing" />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="PO bulan ini" value={data.poThisMonth} />
        <Stat label="Menunggu approval" value={data.pendingApproval} />
        <Stat label="Total nilai PO" value={format.rupiah(data.totalValue)} />
      </div>
      <div className="mt-6">
        <h2 className="mb-2 text-xs uppercase tracking-wide text-[var(--muted)]">Breakdown PO per status</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {PO_STATUSES.map((s) => (
            <div key={s} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="mb-1 text-2xl font-bold tracking-tight">{counts.get(s) ?? 0}</div>
              <StatusBadge status={s} />
            </div>
          ))}
        </div>
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
