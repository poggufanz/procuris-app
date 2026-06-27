import { create } from 'zustand'
import api from '@/lib/api'
import type { Role } from '@/config/roles'
import { msUntilRefresh } from '@/lib/jwt'
import {
  setAccessToken, getRefreshToken, setRefreshToken, clearTokens,
} from '@/lib/auth/tokens'

let refreshTimer: ReturnType<typeof setTimeout> | null = null

function scheduleProactiveRefresh(accessToken: string): void {
  if (refreshTimer) clearTimeout(refreshTimer)
  const ms = msUntilRefresh(accessToken)
  if (ms == null || ms > 0x7fffffff) return
  refreshTimer = setTimeout(() => { void refreshAccessToken().catch(() => {}) }, ms)
}

function cancelProactiveRefresh(): void {
  if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null }
}

export interface User {
  id: number; name: string; email: string; role: Role; branch_id: number | null; is_active: boolean
}
type Status = 'idle' | 'loading' | 'authed' | 'anon'

interface AuthState {
  user: User | null
  status: Status
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  bootstrap: () => Promise<void>
}

async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function refreshAccessToken(): Promise<string> {
  const rt = getRefreshToken()
  if (!rt) throw new Error('no refresh token')
  const { data } = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token: rt })
  setAccessToken(data.access_token)
  scheduleProactiveRefresh(data.access_token)
  return data.access_token
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  login: async (email, password) => {
    set({ status: 'loading' })
    try {
      const { data } = await api.post<{ access_token: string; refresh_token: string }>('/auth/login', { email, password })
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      scheduleProactiveRefresh(data.access_token)
      set({ user: await fetchMe(), status: 'authed' })
    } catch (e) { set({ status: 'anon' }); throw e }
  },
  logout: async () => {
    const rt = getRefreshToken()
    try { if (rt) await api.post('/auth/logout', { refresh_token: rt }) } catch { /* best effort */ }
    cancelProactiveRefresh()
    clearTokens()
    set({ user: null, status: 'anon' })
  },
  bootstrap: async () => {
    if (!getRefreshToken()) { set({ status: 'anon' }); return }
    set({ status: 'loading' })
    try {
      await refreshAccessToken()
      set({ user: await fetchMe(), status: 'authed' })
    } catch { clearTokens(); set({ user: null, status: 'anon' }) }
  },
}))
