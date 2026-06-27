import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, clearTokens } from './tokens'

beforeEach(() => { localStorage.clear(); setAccessToken(null) })

test('access token lives in memory, not localStorage', () => {
  setAccessToken('abc')
  expect(getAccessToken()).toBe('abc')
  expect(localStorage.getItem('procuris.rt')).toBeNull()
})

test('refresh token persists to localStorage', () => {
  setRefreshToken('r1')
  expect(getRefreshToken()).toBe('r1')
  expect(localStorage.getItem('procuris.rt')).toBe('r1')
})

test('clearTokens wipes both', () => {
  setAccessToken('a'); setRefreshToken('r')
  clearTokens()
  expect(getAccessToken()).toBeNull()
  expect(getRefreshToken()).toBeNull()
})
