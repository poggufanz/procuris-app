import { render, screen, waitFor } from '@testing-library/react'
import { AppRouter } from './router'
import { useAuthStore } from '@/stores/auth.store'
import { clearTokens } from '@/lib/auth/tokens'

test('unauthenticated visit lands on login', async () => {
  clearTokens(); useAuthStore.setState({ user: null, status: 'idle' })
  render(<AppRouter initialEntries={['/hris/dashboard']} />)
  await waitFor(() => expect(screen.getByText(/Masuk/i)).toBeInTheDocument())
})
