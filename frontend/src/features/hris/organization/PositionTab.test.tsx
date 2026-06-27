import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PositionTab } from './PositionTab'

test('renders positions as an atasan-bawahan tree', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><PositionTab /></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Manager IT')).toBeInTheDocument())
  expect(screen.getByText('Staff IT')).toBeInTheDocument()
})
