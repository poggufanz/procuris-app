import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost'
const styles: Record<Variant, string> = {
  primary: 'bg-[var(--accent)] text-white hover:opacity-90',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  ghost: 'bg-white text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg)]',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`} />
}
