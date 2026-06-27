export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`motion-safe:animate-pulse rounded-md bg-[color-mix(in_srgb,var(--border)_70%,transparent)] ${className}`}
    />
  )
}
