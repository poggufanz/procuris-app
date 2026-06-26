export function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center gap-3 px-6 py-14 text-center">
      <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent-weak)] text-[var(--accent)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 13h4l2 3h6l2-3h4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 13V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="text-sm text-[var(--muted)]">{text}</p>
    </div>
  )
}
