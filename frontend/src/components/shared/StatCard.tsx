import { type ReactNode } from 'react'

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition-shadow hover:shadow-[0_6px_20px_rgba(124,58,237,.10)]">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-[var(--text)]">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}
