import { navForRole } from './nav'

test('superadmin sees the HRIS users item', () => {
  const paths = navForRole('superadmin', 'hris').map((i) => i.path)
  expect(paths).toContain('/hris/users')
})

test('admin_hrd does NOT see HRIS users', () => {
  const paths = navForRole('admin_hrd', 'hris').map((i) => i.path)
  expect(paths).not.toContain('/hris/users')
})

test('staff_purchasing sees purchasing PO but not vendor admin', () => {
  const paths = navForRole('staff_purchasing', 'purchasing').map((i) => i.path)
  expect(paths).toContain('/purchasing/purchase-orders')
  expect(paths).not.toContain('/purchasing/vendors')
})
