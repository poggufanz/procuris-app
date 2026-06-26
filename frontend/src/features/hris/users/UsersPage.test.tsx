import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { UsersPage } from './UsersPage'

test('lists user accounts', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter><UsersPage /></MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('admin@procuris.test')).toBeInTheDocument())
})
