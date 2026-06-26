import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginSchema, type LoginInput } from './schema'
import { useAuthStore } from '@/stores/auth.store'
import { getApiError } from '@/lib/apiError'
import { Button } from '@/components/ui/button'

export function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
      const to = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/hris/dashboard'
      navigate(to, { replace: true })
    } catch (e) { setServerError(getApiError(e).message) }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--bg)]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow">
        <h1 className="mb-4 text-lg font-bold">Masuk ke Procuris</h1>
        <label className="mb-1 block text-sm" htmlFor="email">Email</label>
        <input id="email" {...register('email')} className="mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm" />
        {errors.email && <p className="mb-2 text-xs text-red-600">{errors.email.message}</p>}
        <label className="mb-1 block text-sm" htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} className="mb-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm" />
        {errors.password && <p className="mb-2 text-xs text-red-600">{errors.password.message}</p>}
        {serverError && <p className="my-2 text-sm text-red-600">{serverError}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-3 w-full">Masuk</Button>
      </form>
    </div>
  )
}
