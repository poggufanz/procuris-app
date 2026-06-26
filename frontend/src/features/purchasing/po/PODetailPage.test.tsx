import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PODetailPage } from './PODetailPage'
import { useAuthStore } from '@/stores/auth.store'

function renderDetail(role: string, id = 9, branch: number | null = null) {
  useAuthStore.setState({ status: 'authed', user: { id, name: 'x', email: 'x', role: role as never, branch_id: branch, is_active: true } })
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}><MemoryRouter initialEntries={['/purchasing/purchase-orders/1']}>
    <Routes><Route path="/purchasing/purchase-orders/:id" element={<PODetailPage />} /></Routes>
  </MemoryRouter></QueryClientProvider>)
}

test('admin_purchasing sees Approve/Reject on a submitted PO', async () => {
  renderDetail('admin_purchasing')
  await waitFor(() => expect(screen.getByText('PO/BDG/2026/0001')).toBeInTheDocument())
  expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument()
})

test('approving moves the PO to approved', async () => {
  renderDetail('admin_purchasing')
  await screen.findByRole('button', { name: /Approve/i })
  await userEvent.click(screen.getByRole('button', { name: /Approve/i }))
  await waitFor(() => expect(within(screen.getByTestId('po-status')).getByText('approved')).toBeInTheDocument())
})

test('a plain karyawan sees no action buttons', async () => {
  renderDetail('karyawan', 2, null)
  await screen.findByText('PO/BDG/2026/0001')
  expect(screen.queryByRole('button', { name: /Approve/i })).not.toBeInTheDocument()
})
