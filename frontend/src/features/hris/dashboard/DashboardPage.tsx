import { useHrisDashboard } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { format } from '@/lib/format'

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
    <div className="text-2xl font-bold tracking-tight">{value}</div>
    <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
  </div>
}

export default function DashboardPage() {
  const { data } = useHrisDashboard()
  if (!data) return <div>Memuat…</div>
  const maxDivision = Math.max(1, ...data.perDivision.map((d) => d.count))
  return (
    <div>
      <PageHeader title="Dashboard HRIS" />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Karyawan aktif" value={data.totalActive} />
        <Stat label="Total cabang" value={data.totalBranches} />
        <Stat label="Divisi" value={data.perDivision.length} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-3 font-semibold">Karyawan per divisi</h3>
          {data.perDivision.length === 0
            ? <p className="text-sm text-[var(--muted)]">Belum ada data divisi</p>
            : <ul className="space-y-2">
                {data.perDivision.map((d) => (
                  <li key={d.division}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{d.division}</span>
                      <span className="font-semibold tabular-nums">{d.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(d.count / maxDivision) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="mb-2 font-semibold">Kontrak berakhir 30 hari ke depan</h3>
          <ul className="text-sm">
            {data.expiringContracts.map((e) => (
              <li key={e.id} className="flex justify-between border-t border-[var(--border)] py-2 first:border-0">
                <span>{e.nama_lengkap}</span><span className="text-[var(--muted)]">{format.date(e.tanggal_akhir_kontrak)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
