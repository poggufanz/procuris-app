import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

test('sidebar shows only the active system items for the role', () => {
  useAuthStore.setState({ status: 'authed', user: { id: 1, name: 'x', email: 'x', role: 'admin_purchasing', branch_id: null, is_active: true } })
  useUiStore.setState({ activeSystem: 'purchasing' })
  render(<MemoryRouter><Sidebar /></MemoryRouter>)
  expect(screen.getByText('Vendor')).toBeInTheDocument()
  expect(screen.queryByText('Karyawan')).not.toBeInTheDocument()
})
