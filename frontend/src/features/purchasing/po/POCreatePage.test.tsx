import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { POCreatePage } from './POCreatePage'
import { useAuthStore } from '@/stores/auth.store'

test('computes subtotal and total from a row', async () => {
  useAuthStore.setState({ status: 'authed', user: { id: 9, name: 'x', email: 'x', role: 'admin_purchasing', branch_id: null, is_active: true } })
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter initialEntries={['/purchasing/purchase-orders/new']}>
    <Routes>
      <Route path="/purchasing/purchase-orders/new" element={<POCreatePage />} />
      <Route path="/purchasing/purchase-orders/:id" element={<div>detail</div>} />
    </Routes>
  </MemoryRouter></QueryClientProvider>)
  await userEvent.click(screen.getByRole('button', { name: /Tambah Item/i }))
  await screen.findByText('Kertas A4 80gsm') // item options loaded in the row select
  await userEvent.type(screen.getByLabelText(/Qty/i), '50')
  await userEvent.type(screen.getByLabelText(/Harga/i), '52000')
  // subtotal cell + total both render Rp 2.600.000
  expect(await screen.findAllByText('Rp 2.600.000')).toHaveLength(2)
})
