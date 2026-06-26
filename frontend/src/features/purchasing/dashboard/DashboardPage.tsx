import { Link } from 'react-router-dom'
import { usePurchasingDashboard } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Spinner } from '@/components/shared/Spinner'
import { StatusBadge, type POStatus } from '@/components/shared/StatusBadge'
import { format } from '@/lib/format'

const PO_STATUSES: POStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'received', 'cancelled']

export default function DashboardPage() {
  const { data, isError } = usePurchasingDashboard()
  if (isError) return <div className="p-6 text-sm text-[var(--muted)]">Gagal memuat dashboard. Coba muat ulang.</div>
  if (!data) return <Spinner />
  const counts = new Map(data.byStatus.map((b) => [b.status, b.count]))
  return (
    <div className="motion-safe:animate-[login-rise_.4s_cubic-bezier(.16,1,.3,1)]">
      <PageHeader title="Dashboard Purchasing" subtitle="Ringkasan purchase order dan nilai pengadaan." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="PO bulan ini" value={data.poThisMonth} />
        <StatCard label="Menunggu approval" value={data.pendingApproval} />
        <StatCard label="Total nilai PO" value={format.rupiah(data.totalValue)} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Breakdown PO per status</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {PO_STATUSES.map((s) => (
            <div key={s} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-shadow hover:shadow-[0_6px_20px_rgba(124,58,237,.10)]">
              <div className="mb-2 text-2xl font-semibold tabular-nums tracking-tight text-[var(--text)]">{counts.get(s) ?? 0}</div>
              <StatusBadge status={s} />
            </div>
          ))}
        </div>
      </div>

      <section className="mt-6">
        <h2 id="po-terbaru-heading" className="mb-3 text-sm font-semibold text-[var(--text)]">PO terbaru</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          <table className="w-full text-sm" aria-labelledby="po-terbaru-heading">
            <thead className="border-b border-[var(--border)] bg-[var(--bg)] text-left text-[11px] uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="px-4 py-2.5 font-semibold">No. PO</th>
                <th className="px-4 py-2.5 font-semibold">Cabang</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.recent.map((po) => (
                <tr key={po.id} className="transition-colors hover:bg-[var(--bg)]">
                  <td className="px-4 py-2.5"><Link className="font-mono font-medium text-[var(--accent)] hover:underline" to={`/purchasing/purchase-orders/${po.id}`}>{po.po_number}</Link></td>
                  <td className="px-4 py-2.5 text-[var(--text)]">{po.branch_name}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text)]">{format.rupiah(po.total_amount)}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={po.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
