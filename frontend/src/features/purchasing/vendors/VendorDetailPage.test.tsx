import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { VendorDetailPage } from './VendorDetailPage'

test('shows vendor info + purchase history', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><MemoryRouter initialEntries={['/purchasing/vendors/1']}>
    <Routes><Route path="/purchasing/vendors/:id" element={<VendorDetailPage />} /></Routes>
  </MemoryRouter></QueryClientProvider>)
  await waitFor(() => expect(screen.getByText('Maju Jaya')).toBeInTheDocument())
  expect(screen.getByText('PO/BDG/2026/0001')).toBeInTheDocument()
})
