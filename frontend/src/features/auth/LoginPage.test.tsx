import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { useAuthStore } from '@/stores/auth.store'
import { clearTokens } from '@/lib/auth/tokens'

function renderLogin() {
  clearTokens(); useAuthStore.setState({ user: null, status: 'anon' })
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hris/dashboard" element={<div>dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

test('valid login navigates to the dashboard', async () => {
  renderLogin()
  await userEvent.type(screen.getByLabelText(/email/i), 'admin@procuris.test')
  await userEvent.type(screen.getByLabelText(/password/i), 'secret')
  await userEvent.click(screen.getByRole('button', { name: /Masuk/i }))
  expect(await screen.findByText('dashboard')).toBeInTheDocument()
})

test('bad credentials show the server message', async () => {
  renderLogin()
  await userEvent.type(screen.getByLabelText(/email/i), 'admin@procuris.test')
  await userEvent.type(screen.getByLabelText(/password/i), 'wrong')
  await userEvent.click(screen.getByRole('button', { name: /Masuk/i }))
  expect(await screen.findByText(/Email atau password salah/i)).toBeInTheDocument()
})
