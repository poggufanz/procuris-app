import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { POEditItemsPage } from './POEditItemsPage'
import { server } from '@/test/msw/server'

function renderEdit() {
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}><MemoryRouter initialEntries={['/purchasing/purchase-orders/1/edit']}>
    <Routes>
      <Route path="/purchasing/purchase-orders/:id/edit" element={<POEditItemsPage />} />
      <Route path="/purchasing/purchase-orders/:id" element={<div>detail</div>} />
    </Routes>
  </MemoryRouter></QueryClientProvider>)
}

test('blocks editing when the PO is not draft', async () => {
  renderEdit() // fixture PO #1 is submitted
  await waitFor(() => expect(screen.getByText(/hanya dapat diubah saat status draft/i)).toBeInTheDocument())
  expect(screen.getByRole('button', { name: /Kembali ke PO/i })).toBeInTheDocument()
})

test('seeds existing items and saves a draft PO', async () => {
  server.use(http.get('*/purchase-orders/:id', () => HttpResponse.json({
    id: 1, po_number: 'PO/BDG/2026/0001', branch_id: 1, branch_name: 'Bandung', branch_code: 'BDG', vendor_id: 1, requested_by: 5,
    status: 'draft', tanggal_po: '2026-07-10', tanggal_dibutuhkan: null, total_amount: 2600000, catatan: null, rejection_reason: null,
    items: [{ id: 1, item_id: 1, item_name: 'Kertas A4 80gsm', quantity: 50, unit: 'rim', unit_price: 52000, subtotal: 2600000, notes: null }],
  })))
  renderEdit()
  expect(await screen.findAllByText('Rp 2.600.000')).toHaveLength(2) // row subtotal + total
  await userEvent.click(screen.getByRole('button', { name: /Simpan Item/i }))
  await screen.findByText('detail')
})
