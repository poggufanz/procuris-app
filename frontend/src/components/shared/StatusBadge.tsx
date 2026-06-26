export type POStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'received' | 'cancelled'

export function StatusBadge({ status }: { status: POStatus }) {
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ color: `var(--status-${status})`, background: `color-mix(in srgb, var(--status-${status}) 14%, transparent)` }}
    >
      {status}
    </span>
  )
}
