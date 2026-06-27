import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePOList, type PurchaseOrder } from './api'
import { useBranchScope } from '../useBranchScope'
import { useBranchOptions } from '@/features/hris/employees/api'
import { useVendors } from '@/features/purchasing/vendors/api'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/format'

export function POListPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [branchFilter, setBranchFilter] = useState<number | ''>('')
  const [vendorFilter, setVendorFilter] = useState<number | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { scoped, branchId } = useBranchScope()
  const branches = useBranchOptions()
  const vendors = useVendors({})
  const { data, isLoading } = usePOList({
    page,
    status: status || undefined,
    branch_id: scoped ? (branchId ?? undefined) : (branchFilter || undefined),
    vendor_id: vendorFilter || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })
  const columns: ColumnDef<PurchaseOrder>[] = [
    { accessorKey: 'po_number', header: 'No. PO', cell: ({ row }) => <Link className="font-mono text-[var(--accent)]" to={`/purchasing/purchase-orders/${row.original.id}`}>{row.original.po_number}</Link> },
    { accessorKey: 'branch_name', header: 'Cabang' },
    { id: 'total', header: 'Total', cell: ({ row }) => format.rupiah(row.original.total_amount) },
    { id: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ]
  const control = 'rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm'
  return (
    <div>
      <PageHeader title="Purchase Order" actions={<Link to="/purchasing/purchase-orders/new"><Button>Buat PO</Button></Link>} />
      <div className="mb-3 flex flex-wrap gap-2">
        <select aria-label="Filter status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className={control}>
          <option value="">Semua status</option>
          {['draft','submitted','approved','rejected','received','cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {!scoped && (
          <select aria-label="Filter cabang" value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value ? Number(e.target.value) : ''); setPage(1) }} className={control}>
            <option value="">Semua cabang</option>
            {branches.data?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select aria-label="Filter vendor" value={vendorFilter} onChange={(e) => { setVendorFilter(e.target.value ? Number(e.target.value) : ''); setPage(1) }} className={control}>
          <option value="">Semua vendor</option>
          {vendors.data?.data.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <input aria-label="Tanggal dari" type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className={control} />
        <input aria-label="Tanggal sampai" type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className={control} />
      </div>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada PO" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
    </div>
  )
}
