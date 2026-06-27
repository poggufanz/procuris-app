import { useHrisDashboard } from './api'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Spinner } from '@/components/shared/Spinner'
import { format } from '@/lib/format'

const cardClass = 'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]'

export default function DashboardPage() {
  const { data, isError } = useHrisDashboard()
  if (isError) return <div className="p-6 text-sm text-[var(--muted)]">Gagal memuat dashboard. Coba muat ulang.</div>
  if (!data) return <Spinner />
  const maxDivision = Math.max(1, ...data.perDivision.map((d) => d.count))
  return (
    <div className="motion-safe:animate-[login-rise_.4s_cubic-bezier(.16,1,.3,1)]">
      <PageHeader title="Dashboard HRIS" subtitle="Ringkasan kepegawaian dan struktur organisasi." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Karyawan aktif" value={data.totalActive} />
        <StatCard label="Total cabang" value={data.totalBranches} />
        <StatCard label="Divisi" value={data.perDivision.length} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className={cardClass}>
          <h2 className="mb-4 text-sm font-semibold text-[var(--text)]">Karyawan per divisi</h2>
          {data.perDivision.length === 0
            ? <p className="text-sm text-[var(--muted)]">Belum ada data divisi</p>
            : <ul className="space-y-3.5">
                {data.perDivision.map((d) => (
                  <li key={d.division}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-[var(--text)]">{d.division}</span>
                      <span className="font-semibold tabular-nums text-[var(--text)]">{d.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                      <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${(d.count / maxDivision) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>}
        </section>

        <section className={cardClass}>
          <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Kontrak berakhir 30 hari ke depan</h2>
          {data.expiringContracts.length === 0
            ? <p className="text-sm text-[var(--muted)]">Tidak ada kontrak yang akan berakhir</p>
            : <ul className="divide-y divide-[var(--border)] text-sm">
                {data.expiringContracts.map((e) => (
                  <li key={e.id} className="-mx-2 flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--bg)]">
                    <span className="text-[var(--text)]">{e.nama_lengkap}</span>
                    <span className="tabular-nums text-[var(--muted)]">{format.date(e.tanggal_akhir_kontrak)}</span>
                  </li>
                ))}
              </ul>}
        </section>
      </div>
    </div>
  )
}
