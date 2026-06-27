import { renderHook } from '@testing-library/react'
import { useBranchScope } from './useBranchScope'
import { useAuthStore } from '@/stores/auth.store'

test('scoped for staff_purchasing', () => {
  useAuthStore.setState({ status: 'authed', user: { id: 5, name: 'x', email: 'x', role: 'staff_purchasing', branch_id: 1, is_active: true } })
  const { result } = renderHook(() => useBranchScope())
  expect(result.current).toMatchObject({ scoped: true, branchId: 1 })
})

test('unscoped for admin_purchasing', () => {
  useAuthStore.setState({ status: 'authed', user: { id: 9, name: 'x', email: 'x', role: 'admin_purchasing', branch_id: null, is_active: true } })
  const { result } = renderHook(() => useBranchScope())
  expect(result.current).toMatchObject({ scoped: false })
})
