export function decodeExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch { return null }
}

export function msUntilRefresh(token: string, leadSec = 60): number | null {
  const exp = decodeExp(token)
  if (exp == null) return null
  return Math.max(0, exp * 1000 - Date.now() - leadSec * 1000)
}
