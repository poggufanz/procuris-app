import { http, HttpResponse } from 'msw'
import { branches, positions, employees, users } from './hris.fixtures'

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
  http.get('*/employees', () => HttpResponse.json({ data: employees, total: employees.length, per_page: 15, current_page: 1 })),
  http.get('*/employees/:id/org-tree', () => HttpResponse.json({ id: 2, name: 'Staff IT', children: [] })),
  http.get('*/employees/:id', ({ params }) => HttpResponse.json(employees.find((e) => e.id === Number(params.id)) ?? employees[0])),
  http.post('*/employees', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/employees/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.patch('*/employees/:id/deactivate', ({ params }) => HttpResponse.json({ id: Number(params.id), status: 'nonaktif' })),
  http.get('*/branches', () => HttpResponse.json({ data: branches, total: branches.length, per_page: 1000, current_page: 1 })),
  http.post('*/branches', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/branches/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.get('*/positions', () => HttpResponse.json({ data: positions, total: positions.length, per_page: 1000, current_page: 1 })),
  http.post('*/positions', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/positions/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.get('*/auth/users', () => HttpResponse.json({ data: users, total: users.length, per_page: 15, current_page: 1 })),
  http.post('*/auth/users', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/auth/users/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.patch('*/auth/users/:id/deactivate', ({ params }) => HttpResponse.json({ id: Number(params.id), is_active: false })),
]
