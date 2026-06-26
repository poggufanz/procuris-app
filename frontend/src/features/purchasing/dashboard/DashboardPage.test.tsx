import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from './DashboardPage'

test('shows PO stats and a recent PO', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><DashboardPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('7')).toBeInTheDocument()) // pending approval
  expect(screen.getByText('PO/BDG/2026/0001')).toBeInTheDocument()
})
