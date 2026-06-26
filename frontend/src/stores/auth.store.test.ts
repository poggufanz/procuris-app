import { useAuthStore } from './auth.store'
import { getAccessToken, getRefreshToken, clearTokens } from '@/lib/auth/tokens'

beforeEach(() => { clearTokens(); useAuthStore.setState({ user: null, status: 'idle' }) })

test('login stores tokens + user and sets authed', async () => {
  await useAuthStore.getState().login('admin@procuris.test', 'secret')
  expect(getAccessToken()).toBeTruthy()
  expect(getRefreshToken()).toBe('rt-1')
  expect(useAuthStore.getState().status).toBe('authed')
  expect(useAuthStore.getState().user?.role).toBe('superadmin')
})

test('login with bad creds throws and stays anon', async () => {
  await expect(useAuthStore.getState().login('x@y.z', 'nope')).rejects.toBeTruthy()
  expect(useAuthStore.getState().status).toBe('anon')
})

test('bootstrap restores session from refresh token', async () => {
  useAuthStore.setState({ status: 'idle' })
  await useAuthStore.getState().login('admin@procuris.test', 'secret')
  useAuthStore.setState({ user: null, status: 'idle' }) // simulate reload (mem cleared, rt persists)
  await useAuthStore.getState().bootstrap()
  expect(useAuthStore.getState().status).toBe('authed')
})
