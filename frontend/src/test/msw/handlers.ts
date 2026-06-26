import { http, HttpResponse } from 'msw'

// minimal JWT with a far-future exp
const jwt = (role: string, branch: number | null) =>
  `h.${btoa(JSON.stringify({ sub: 1, role, branch_id: branch, exp: 4102444800 }))}.s`

export const handlers = [
  http.post('*/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }
    if (email === 'admin@procuris.test' && password === 'secret')
      return HttpResponse.json({ access_token: jwt('superadmin', null), refresh_token: 'rt-1' })
    return HttpResponse.json({ message: 'Email atau password salah' }, { status: 401 })
  }),
  http.post('*/auth/refresh', async ({ request }) => {
    const { refresh_token } = (await request.json()) as { refresh_token: string }
    if (refresh_token === 'rt-1') return HttpResponse.json({ access_token: jwt('superadmin', null) })
    return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
  }),
  http.post('*/auth/logout', () => HttpResponse.json({ message: 'ok' })),
  http.get('*/auth/me', () =>
    HttpResponse.json({ id: 1, name: 'Super Admin', email: 'admin@procuris.test', role: 'superadmin', branch_id: null, is_active: true }),
  ),
]
