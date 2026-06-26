export const ROLES = ['superadmin','admin_hrd','admin_cabang','karyawan','admin_purchasing','staff_purchasing'] as const
export type Role = (typeof ROLES)[number]

export const isBranchScoped = (r: Role) => r === 'staff_purchasing' || r === 'admin_cabang'
export const canApprovePO = (r: Role) => r === 'admin_purchasing' || r === 'superadmin'
