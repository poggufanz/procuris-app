import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginSchema, type LoginInput } from './schema'
import { useAuthStore } from '@/stores/auth.store'
import { getApiError } from '@/lib/apiError'
import { Button } from '@/components/ui/button'

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-white ring-1 ring-white/15"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1">
          <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4H13a5 5 0 0 1 0 10H7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">Procuris</span>
    </span>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" strokeLinecap="round" />}
    </svg>
  )
}

export function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
      const to = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/hris/dashboard'
      navigate(to, { replace: true })
    } catch (e) {
      setServerError(getApiError(e).message)
    }
  }

  const inputClass =
    'h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_35%,transparent)]'

  return (
    <div className="grid min-h-[100dvh] bg-[var(--bg)] lg:grid-cols-[1.05fr_1fr]">
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ background: 'linear-gradient(160deg,#2e1065 0%,#4c1d95 46%,#6d28d9 100%)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full blur-3xl motion-safe:animate-[login-glow_7s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle,rgba(167,139,250,.55),transparent 60%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle,rgba(91,33,182,.6),transparent 60%)' }}
        />

        <Wordmark className="relative" />

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight">
            Kepegawaian dan pengadaan, satu pintu.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-violet-100/75">
            Kelola karyawan, cabang, vendor, dan purchase order dari satu platform terpadu Procuris.
          </p>
          <div className="mt-7 flex gap-2.5">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-violet-100/90">
              HRIS
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-violet-100/90">
              Purchasing
            </span>
          </div>
        </div>

        <p className="relative text-xs text-violet-200/55">© 2026 Procuris</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm motion-safe:animate-[login-rise_.5s_cubic-bezier(.16,1,.3,1)]">
          <div className="mb-8 lg:hidden">
            <Wordmark className="text-[var(--text)]" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Masuk</h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            Gunakan akun Procuris Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={inputClass}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`${inputClass} pr-11`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-[var(--muted)] transition hover:text-[var(--text)] focus-visible:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-400"
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5M12 16.5v.01" strokeLinecap="round" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
              {isSubmitting && (
                <svg viewBox="0 0 24 24" className="mr-2 inline h-4 w-4 animate-spin align-[-2px]" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M21 12a9 9 0 1 1-6.2-8.6" strokeLinecap="round" />
                </svg>
              )}
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            Lupa akses? Hubungi admin perusahaan Anda.
          </p>
        </div>
      </main>
    </div>
  )
}
