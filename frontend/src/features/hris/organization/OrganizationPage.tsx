import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { BranchTab } from './BranchTab'
import { PositionTab } from './PositionTab'

export function OrganizationPage() {
  const [tab, setTab] = useState<'cabang' | 'jabatan'>('cabang')
  return (
    <div>
      <PageHeader title="Organisasi" />
      <div className="mb-4 flex gap-2">
        {(['cabang', 'jabatan'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === t ? 'bg-[var(--accent-weak)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
            {t === 'cabang' ? 'Cabang' : 'Jabatan'}
          </button>
        ))}
      </div>
      {tab === 'cabang' ? <BranchTab /> : <PositionTab />}
    </div>
  )
}
