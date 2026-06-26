import { useEffect, lazy, Suspense } from 'react'
import { MemoryRouter, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { AppShell } from '@/app/AppShell'
import { RequireAuth } from '@/app/guards/RequireAuth'
import { RequireRole } from '@/app/guards/RequireRole'
import { Forbidden } from '@/app/error/Forbidden'
import { NotFound } from '@/app/error/NotFound'
import { LoginPage } from '@/features/auth/LoginPage'
import { EmployeesPage } from '@/features/hris/employees/EmployeesPage'
import { EmployeeDetailPage } from '@/features/hris/employees/EmployeeDetailPage'
import { OrganizationPage } from '@/features/hris/organization/OrganizationPage'
import { UsersPage } from '@/features/hris/users/UsersPage'
import { VendorsPage } from '@/features/purchasing/vendors/VendorsPage'
import { VendorDetailPage } from '@/features/purchasing/vendors/VendorDetailPage'
import { ItemsPage } from '@/features/purchasing/items/ItemsPage'
import { POListPage } from '@/features/purchasing/po/POListPage'

const HrisDash = lazy(() => import('@/features/hris/dashboard/DashboardPage'))
const PurchasingDash = lazy(() => import('@/features/purchasing/dashboard/DashboardPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Memuat…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<Forbidden />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/hris/dashboard" replace />} />
            <Route element={<RequireRole roles={['superadmin','admin_hrd','admin_cabang']} />}>
              <Route path="/hris/dashboard" element={<HrisDash />} />
              <Route path="/hris/employees" element={<EmployeesPage />} />
              <Route path="/hris/employees/:id" element={<EmployeeDetailPage />} />
            </Route>
            <Route element={<RequireRole roles={['superadmin','admin_hrd']} />}>
              <Route path="/hris/organization" element={<OrganizationPage />} />
            </Route>
            <Route element={<RequireRole roles={['superadmin']} />}>
              <Route path="/hris/users" element={<UsersPage />} />
            </Route>
            <Route element={<RequireRole roles={['superadmin','admin_purchasing','admin_cabang','staff_purchasing']} />}>
              <Route path="/purchasing/dashboard" element={<PurchasingDash />} />
              <Route path="/purchasing/purchase-orders" element={<POListPage />} />
            </Route>
            <Route element={<RequireRole roles={['superadmin','admin_purchasing']} />}>
              <Route path="/purchasing/vendors" element={<VendorsPage />} />
              <Route path="/purchasing/vendors/:id" element={<VendorDetailPage />} />
              <Route path="/purchasing/items" element={<ItemsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export function AppRouter({ initialEntries }: { initialEntries?: string[] }) {
  const bootstrap = useAuthStore((s) => s.bootstrap)
  const status = useAuthStore((s) => s.status)
  useEffect(() => { if (status === 'idle') void bootstrap() }, [status, bootstrap])
  if (initialEntries) return <MemoryRouter initialEntries={initialEntries}><AppRoutes /></MemoryRouter>
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}
