export function Spinner({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
