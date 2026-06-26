import { useParams } from 'react-router-dom'
import { useVendor, useVendorHistory } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge, type POStatus } from '@/components/shared/StatusBadge'
import { format } from '@/lib/format'

export function VendorDetailPage() {
  const id = Number(useParams().id)
  const { data: v } = useVendor(id)
  const { data: history } = useVendorHistory(id)
  if (!v) return <div>Memuat…</div>
  return (
    <div>
      <PageHeader title={v.name} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          <p>Kode: {v.code}</p><p>PIC: {v.contact_person}</p><p>Telepon: {v.phone}</p>
          <p>Email: {v.email ?? '-'}</p><p>NPWP: {v.npwp ?? '-'}</p><p>Termin: {v.payment_term_days} hari</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 font-semibold">Riwayat PO</h3>
          <ul className="text-sm">
            {history?.map((po) => (
              <li key={po.id} className="flex items-center justify-between border-t border-[var(--border)] py-2 first:border-0">
                <span className="font-mono">{po.po_number}</span>
                <span className="flex items-center gap-2"><StatusBadge status={po.status as POStatus} />{format.rupiah(po.total_amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
