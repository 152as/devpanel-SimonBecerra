import { Header } from '../components/Header'
import { UsersTable } from '../components/UsersTable'
import { useUserCounts } from '../hooks/useUserCounts'

export function Dashboard() {
  const { data, isLoading, isError } = useUserCounts()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">Métricas</h2>

        {isError && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">No se pudieron cargar las métricas.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard label="Total de usuarios" value={isLoading ? '…' : (data?.total ?? 0)} />
          <MetricCard label="Usuarios activos" value={isLoading ? '…' : (data?.active ?? 0)} />
        </div>

        <UsersTable />
      </main>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}
