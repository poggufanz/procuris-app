import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { BranchTab } from './BranchTab'
import { PositionTab } from './PositionTab'

const TABS = [
  { id: 'cabang', label: 'Cabang', icon: <path d="M4 20V7l8-3 8 3v13M4 20h16M9 20v-5h6v5M8 9.5h.01M12 9.5h.01M16 9.5h.01" /> },
  { id: 'jabatan', label: 'Jabatan', icon: <path d="M12 3v4M5 11h14M5 11a2 2 0 0 0-2 2v6h4v-4h10v4h4v-6a2 2 0 0 0-2-2M9 19v-4M15 19v-4" /> },
] as const

export function OrganizationPage() {
  const [tab, setTab] = useState<'cabang' | 'jabatan'>('cabang')
  return (
    <div>
      <PageHeader title="Organisasi" subtitle="Kelola struktur cabang dan hierarki jabatan." />

      <div role="tablist" aria-label="Bagian organisasi" className="mb-5 inline-flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-1">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button key={t.id} role="tab" aria-selected={active} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-semibold transition ${active ? 'bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{t.icon}</svg>
              {t.label}
            </button>
          )
        })}
      </div>

      <div role="tabpanel">{tab === 'cabang' ? <BranchTab /> : <PositionTab />}</div>
    </div>
  )
}
