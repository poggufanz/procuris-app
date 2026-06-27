const RT_KEY = 'procuris.rt'
let accessToken: string | null = null

export function getAccessToken() { return accessToken }
export function setAccessToken(t: string | null) { accessToken = t }
export function getRefreshToken() { return localStorage.getItem(RT_KEY) }
export function setRefreshToken(t: string | null) {
  if (t) localStorage.setItem(RT_KEY, t)
  else localStorage.removeItem(RT_KEY)
}
export function clearTokens() { accessToken = null; localStorage.removeItem(RT_KEY) }
