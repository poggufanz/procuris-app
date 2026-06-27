export const qk = {
  hrisDashboard: () => ['hris', 'dashboard'] as const,
  employees: {
    list: (filters: Record<string, unknown>) => ['employees', 'list', filters] as const,
    detail: (id: number) => ['employees', 'detail', id] as const,
    orgTree: (id: number) => ['employees', 'orgTree', id] as const,
  },
  branches: { list: () => ['branches', 'list'] as const },
  positions: { list: () => ['positions', 'list'] as const },
  users: { list: (page: number) => ['users', 'list', page] as const },
  purchasingDashboard: () => ['purchasing', 'dashboard'] as const,
  vendors: {
    list: (filters: Record<string, unknown>) => ['vendors', 'list', filters] as const,
    detail: (id: number) => ['vendors', 'detail', id] as const,
    history: (id: number) => ['vendors', 'history', id] as const,
  },
  items: { list: (filters: Record<string, unknown>) => ['items', 'list', filters] as const },
  po: {
    list: (filters: Record<string, unknown>) => ['po', 'list', filters] as const,
    detail: (id: number) => ['po', 'detail', id] as const,
  },
}
