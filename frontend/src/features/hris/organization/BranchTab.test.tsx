import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BranchTab } from './BranchTab'

test('renders branches as a parent-child tree', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><BranchTab /></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Bandung')).toBeInTheDocument())
  expect(screen.getByText('Garut')).toBeInTheDocument()
})
