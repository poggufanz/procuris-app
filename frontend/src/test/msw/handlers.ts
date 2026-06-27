import { http, HttpResponse } from 'msw'
import { branches, positions, employees, users } from './hris.fixtures'
import { vendors, items, purchaseOrders } from './purchasing.fixtures'

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
  http.get('*/employees/:id/org-tree', () => HttpResponse.json([{ id: 2, name: 'Staff IT', meta: 'IT', children: [] }])),
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
  http.get('*/hris/dashboard', () => HttpResponse.json({
    totalActive: 248, totalBranches: 12,
    perDivision: [{ division: 'IT', count: 30 }, { division: 'Finance', count: 18 }],
    expiringContracts: [{ id: 1, nama_lengkap: 'Budi Santoso', tanggal_akhir_kontrak: '2026-07-10' }],
  })),
  http.get('*/vendors', () => HttpResponse.json({ data: vendors, total: vendors.length, per_page: 15, current_page: 1 })),
  http.get('*/vendors/:id/purchase-history', () => HttpResponse.json({ data: purchaseOrders, total: 1, per_page: 15, current_page: 1 })),
  http.get('*/vendors/:id', ({ params }) => HttpResponse.json(vendors.find((v) => v.id === Number(params.id)) ?? vendors[0])),
  http.post('*/vendors', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/vendors/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.patch('*/vendors/:id/deactivate', ({ params }) => HttpResponse.json({ id: Number(params.id), is_active: false })),
  http.get('*/items', () => HttpResponse.json({ data: items, total: items.length, per_page: 15, current_page: 1 })),
  http.post('*/items', async ({ request }) => HttpResponse.json({ id: 99, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/items/:id', async ({ request, params }) => HttpResponse.json({ id: Number(params.id), ...(await request.json() as object) })),
  http.patch('*/items/:id/deactivate', ({ params }) => HttpResponse.json({ id: Number(params.id), is_active: false })),
  http.get('*/purchase-orders', () => HttpResponse.json({ data: purchaseOrders, total: purchaseOrders.length, per_page: 15, current_page: 1 })),
  http.get('*/purchase-orders/:id', ({ params }) => HttpResponse.json(purchaseOrders.find((p) => p.id === Number(params.id)) ?? purchaseOrders[0])),
  http.post('*/purchase-orders', async ({ request }) => HttpResponse.json({ id: 99, po_number: 'PO/BDG/2026/0099', status: 'draft', items: [], total_amount: 0, ...(await request.json() as object) }, { status: 201 })),
  http.put('*/purchase-orders/:id/items', async ({ request, params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), ...(await request.json() as object) })),
  http.patch('*/purchase-orders/:id/submit', ({ params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), status: 'submitted' })),
  http.patch('*/purchase-orders/:id/approve', ({ params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), status: 'approved' })),
  http.patch('*/purchase-orders/:id/reject', async ({ request, params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), status: 'rejected', rejection_reason: (await request.json() as { rejection_reason: string }).rejection_reason })),
  http.patch('*/purchase-orders/:id/receive', ({ params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), status: 'received' })),
  http.patch('*/purchase-orders/:id/cancel', ({ params }) => HttpResponse.json({ ...purchaseOrders[0], id: Number(params.id), status: 'cancelled' })),
  http.get('*/purchasing/dashboard', () => HttpResponse.json({ poThisMonth: 23, pendingApproval: 7, totalValue: 125000000, byStatus: [{ status: 'submitted', count: 7 }, { status: 'approved', count: 10 }], recent: purchaseOrders })),
]
