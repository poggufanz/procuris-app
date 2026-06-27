import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RequireRole } from './RequireRole'
import { useAuthStore } from '@/stores/auth.store'

function setup(role: 'superadmin' | 'admin_hrd') {
  useAuthStore.setState({ status: 'authed', user: { id: 1, name: 'x', email: 'x', role, branch_id: null, is_active: true } })
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route element={<RequireRole roles={['superadmin']} />}>
          <Route path="/secret" element={<div>secret page</div>} />
        </Route>
        <Route path="/403" element={<div>forbidden</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

test('allows an in-role user', () => { setup('superadmin'); expect(screen.getByText('secret page')).toBeInTheDocument() })
test('redirects an out-of-role user to /403', () => { setup('admin_hrd'); expect(screen.getByText('forbidden')).toBeInTheDocument() })
