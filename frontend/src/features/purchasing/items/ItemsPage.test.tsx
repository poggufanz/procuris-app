import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { ItemsPage } from './ItemsPage'

test('lists items with formatted last price', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><ItemsPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Kertas A4 80gsm')).toBeInTheDocument())
  expect(screen.getByText('Rp 52.000')).toBeInTheDocument()
})
