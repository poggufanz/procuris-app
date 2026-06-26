export type POStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'received' | 'cancelled'

export function StatusBadge({ status }: { status: POStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{
        color: `var(--status-${status})`,
        background: `color-mix(in srgb, var(--status-${status}) 12%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--status-${status}) 28%, transparent)`,
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--status-${status})` }} />
      {status}
    </span>
  )
}
