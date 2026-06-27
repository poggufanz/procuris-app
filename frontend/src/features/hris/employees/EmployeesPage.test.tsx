import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { EmployeesPage } from './EmployeesPage'

function renderPage() {
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}><MemoryRouter><EmployeesPage /></MemoryRouter></QueryClientProvider>)
}

test('lists employees from the API', async () => {
  renderPage()
  await waitFor(() => expect(screen.getByText('Budi Santoso')).toBeInTheDocument())
  expect(screen.getByText('2026.01.00001')).toBeInTheDocument()
})
