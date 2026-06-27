import type { Role } from './roles'

export interface NavItem { system: 'hris' | 'purchasing'; path: string; label: string; roles: Role[] }

export const NAV_ITEMS: NavItem[] = [
  { system: 'hris', path: '/hris/dashboard',    label: 'Dashboard',    roles: ['superadmin','admin_hrd','admin_cabang'] },
  { system: 'hris', path: '/hris/employees',    label: 'Karyawan',     roles: ['superadmin','admin_hrd','admin_cabang'] },
  { system: 'hris', path: '/hris/organization', label: 'Organisasi',   roles: ['superadmin','admin_hrd'] },
  { system: 'hris', path: '/hris/users',        label: 'User & Akses', roles: ['superadmin'] },
  { system: 'purchasing', path: '/purchasing/dashboard',       label: 'Dashboard',      roles: ['superadmin','admin_purchasing','admin_cabang','staff_purchasing'] },
  { system: 'purchasing', path: '/purchasing/purchase-orders', label: 'Purchase Order', roles: ['superadmin','admin_purchasing','admin_cabang','staff_purchasing'] },
  { system: 'purchasing', path: '/purchasing/vendors',         label: 'Vendor',         roles: ['superadmin','admin_purchasing'] },
  { system: 'purchasing', path: '/purchasing/items',           label: 'Item',           roles: ['superadmin','admin_purchasing'] },
]

export function navForRole(role: Role, system: 'hris' | 'purchasing'): NavItem[] {
  return NAV_ITEMS.filter((i) => i.system === system && i.roles.includes(role))
}
