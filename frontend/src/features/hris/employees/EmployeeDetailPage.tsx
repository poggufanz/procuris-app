import { useParams } from 'react-router-dom'
import { useEmployee, useOrgTree } from './api'
import { TreeView } from '@/components/shared/TreeView'
import { PageHeader } from '@/components/shared/PageHeader'
import { format } from '@/lib/format'

export function EmployeeDetailPage() {
  const id = Number(useParams().id)
  const { data: emp } = useEmployee(id)
  const { data: tree } = useOrgTree(id)
  if (!emp) return <div>Memuat…</div>
  return (
    <div>
      <PageHeader title={emp.nama_lengkap} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          <p>NIK: {emp.nomor_induk_karyawan}</p>
          <p>Cabang: {emp.branch_name}</p>
          <p>Jabatan: {emp.position_name}</p>
          <p>Gabung: {format.date(emp.tanggal_gabung)}</p>
          <p>Kontrak: {format.date(emp.tanggal_mulai_kontrak)} – {emp.tanggal_akhir_kontrak ? format.date(emp.tanggal_akhir_kontrak) : 'Tetap'}</p>
          <p>Status: {emp.status}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 font-semibold">Struktur Organisasi</h3>
          {tree ? <TreeView nodes={[tree]} /> : <p className="text-sm text-[var(--muted)]">Memuat…</p>}
        </div>
      </div>
    </div>
  )
}
