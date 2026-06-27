import { poActions } from './poActions'

const po = (status: string, branch = 1, by = 5) => ({ status: status as never, branch_id: branch, requested_by: by })
const user = (role: string, id = 5, branch: number | null = 1) => ({ id, role: role as never, branch_id: branch })

test('submitted PO offers approve/reject to admin_purchasing', () => {
  expect(poActions(po('submitted'), user('admin_purchasing', 9, null)).sort()).toEqual(['approve', 'reject'])
})
test('submitted PO offers cancel to its requester', () => {
  expect(poActions(po('submitted'), user('staff_purchasing', 5, 1))).toContain('cancel')
})
test('approved PO offers receive to branch staff', () => {
  expect(poActions(po('approved'), user('staff_purchasing', 7, 1))).toEqual(['receive'])
})
test('approved PO offers nothing to staff of another branch', () => {
  expect(poActions(po('approved'), user('staff_purchasing', 7, 2))).toEqual([])
})
test('draft PO offers edit/submit/cancel to requester', () => {
  expect(poActions(po('draft'), user('staff_purchasing', 5, 1)).sort()).toEqual(['cancel', 'edit', 'submit'])
})
test('terminal states offer nothing', () => {
  expect(poActions(po('received'), user('superadmin', 1, null))).toEqual([])
  expect(poActions(po('rejected'), user('admin_purchasing', 9, null))).toEqual([])
})
