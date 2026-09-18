import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useProfiles } from '../hooks/useProfiles'
import { RoleBadge, StatusBadge } from './Badge'

const PAGE_SIZE = 10
const ROLES = ['admin', 'editor', 'viewer']
const STATUSES = ['active', 'inactive']

const selectClasses =
  'rounded border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400'

export function UsersTable() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const debouncedSearch = useDebouncedValue(search, 300)

  // Nueva busqueda o filtro -> siempre volver a la primera pagina.
  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, role, status])

  const { data, isLoading, isFetching, isError } = useProfiles({
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
    role,
    status,
  })

  const rows = data?.rows ?? []
  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Usuarios</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select value={role} onChange={(event) => setRole(event.target.value)} className={selectClasses}>
            <option value="">Todos los roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={selectClasses}>
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
          />
        </div>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">No se pudo cargar la tabla de usuarios.</p>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((profile) => (
              <tr
                key={profile.id}
                className="border-t border-slate-100 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                <td className="px-4 py-2">{profile.name}</td>
                <td className="px-4 py-2">{profile.email}</td>
                <td className="px-4 py-2">
                  <RoleBadge role={profile.role} />
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={profile.status} />
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          {isLoading ? 'Cargando…' : `${data?.count ?? 0} usuarios`}
          {isFetching && !isLoading ? ' · actualizando…' : ''}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-600"
          >
            Anterior
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40 dark:border-slate-600"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}
