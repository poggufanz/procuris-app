import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from './DashboardPage'

test('shows PO stats, status breakdown, and a recent PO', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><DashboardPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Menunggu approval')).toBeInTheDocument())
  expect(screen.getAllByText('7').length).toBeGreaterThanOrEqual(1) // pending approval + submitted breakdown
  expect(screen.getByText('Breakdown PO per status')).toBeInTheDocument()
  expect(screen.getByText('PO/BDG/2026/0001')).toBeInTheDocument()
})
