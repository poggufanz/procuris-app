import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { POListPage } from './POListPage'
import { useAuthStore } from '@/stores/auth.store'

test('lists POs with status badge', async () => {
  useAuthStore.setState({ status: 'authed', user: { id: 9, name: 'x', email: 'x', role: 'admin_purchasing', branch_id: null, is_active: true } })
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><POListPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('PO/BDG/2026/0001')).toBeInTheDocument())
  expect(screen.getByText('submitted', { selector: 'span' })).toBeInTheDocument()
})
