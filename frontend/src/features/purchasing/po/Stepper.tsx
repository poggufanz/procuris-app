import type { POStatus } from '@/components/shared/StatusBadge'

const FLOW: POStatus[] = ['draft', 'submitted', 'approved', 'received']

export function Stepper({ status }: { status: POStatus }) {
  const idx = FLOW.indexOf(status)
  return (
    <div className="flex items-center gap-2 py-3">
      {FLOW.map((s, i) => {
        const done = idx >= 0 && i < idx
        const cur = i === idx
        return (
          <div key={s} className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-semibold
              ${done ? 'border-green-600 bg-green-600 text-white' : cur ? 'border-blue-600 text-blue-600' : 'border-[var(--border)] text-[var(--muted)]'}`}>
              {done ? '✓' : i + 1}
            </span>
            <span className={`text-xs font-semibold ${cur ? 'text-blue-600' : done ? 'text-green-600' : 'text-[var(--muted)]'}`}>{s}</span>
            {i < FLOW.length - 1 && <span className={`h-0.5 w-8 rounded ${i < idx ? 'bg-green-300' : 'bg-[var(--border)]'}`} />}
          </div>
        )
      })}
    </div>
  )
}
