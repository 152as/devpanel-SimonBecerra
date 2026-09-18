import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useProfiles } from '../hooks/useProfiles'

const PAGE_SIZE = 10

export function UsersTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const debouncedSearch = useDebouncedValue(search, 300)

  // Nueva busqueda -> siempre volver a la primera pagina.
  useEffect(() => {
    setPage(0)
  }, [debouncedSearch])

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useProfiles({ search: debouncedSearch, page, pageSize: PAGE_SIZE })

  const rows = data?.rows ?? []
  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Usuarios</h2>
        <input
          type="search"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-64 rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      {isError && (
        <p className="mb-4 text-sm text-red-600">No se pudo cargar la tabla de usuarios.</p>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((profile) => (
              <tr key={profile.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{profile.name}</td>
                <td className="px-4 py-2">{profile.email}</td>
                <td className="px-4 py-2 capitalize">{profile.role}</td>
                <td className="px-4 py-2 capitalize">{profile.status}</td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          {isLoading ? 'Cargando…' : `${data?.count ?? 0} usuarios`}
          {isFetching && !isLoading ? ' · actualizando…' : ''}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
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
            className="rounded border border-slate-300 px-3 py-1 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}
