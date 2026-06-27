import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DashboardPage from './DashboardPage'

test('shows headline stats and an expiring contract', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><DashboardPage /></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('248')).toBeInTheDocument())
  expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
})
