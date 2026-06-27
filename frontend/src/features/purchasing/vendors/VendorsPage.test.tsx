import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { VendorsPage } from './VendorsPage'

test('lists vendors', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><VendorsPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Maju Jaya')).toBeInTheDocument())
  expect(screen.getByText('VND-001')).toBeInTheDocument()
})
