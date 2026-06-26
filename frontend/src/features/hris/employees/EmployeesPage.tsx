import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEmployees, type Employee } from './api'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'

const columns: ColumnDef<Employee>[] = [
  { accessorKey: 'nomor_induk_karyawan', header: 'NIK', cell: ({ row }) => <Link className="text-[var(--accent)]" to={`/hris/employees/${row.original.id}`}>{row.original.nomor_induk_karyawan}</Link> },
  { accessorKey: 'nama_lengkap', header: 'Nama' },
  { accessorKey: 'branch_name', header: 'Cabang' },
  { accessorKey: 'position_name', header: 'Jabatan' },
  { accessorKey: 'status', header: 'Status' },
]

export function EmployeesPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useEmployees({ page, status: status || undefined })
  return (
    <div>
      <PageHeader title="Karyawan" />
      <div className="mb-3 flex gap-2">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm">
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
          <option value="kontrak_berakhir">Kontrak berakhir</option>
        </select>
      </div>
      <DataTable columns={columns} rows={data?.data ?? []} isLoading={isLoading} emptyText="Belum ada karyawan" />
      {data && <Pagination page={data.current_page} total={data.total} perPage={data.per_page} onPage={setPage} />}
    </div>
  )
}
