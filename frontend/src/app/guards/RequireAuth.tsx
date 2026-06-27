import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function RequireAuth() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()
  if (status === 'loading' || status === 'idle') return null
  if (status !== 'authed') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
