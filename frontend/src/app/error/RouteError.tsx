import { useRouteError } from 'react-router-dom'
export function RouteError() {
  const error = useRouteError()
  return <div className="grid min-h-[60vh] place-items-center text-center">
    <div><h1 className="text-2xl font-bold">Terjadi kesalahan</h1>
    <p className="text-[var(--muted)]">{error instanceof Error ? error.message : 'Coba muat ulang halaman.'}</p></div>
  </div>
}
