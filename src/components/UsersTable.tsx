import { useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useProfiles } from '../hooks/useProfiles'

export function UsersTable() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const { data: rows, isLoading, isFetching, isError } = useProfiles(debouncedSearch)

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
            {(rows ?? []).map((profile) => (
              <tr key={profile.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{profile.name}</td>
                <td className="px-4 py-2">{profile.email}</td>
                <td className="px-4 py-2 capitalize">{profile.role}</td>
                <td className="px-4 py-2 capitalize">{profile.status}</td>
              </tr>
            ))}
            {!isLoading && (rows?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {isLoading ? 'Cargando…' : `${rows?.length ?? 0} resultados`}
        {isFetching && !isLoading ? ' · buscando…' : ''}
      </p>
    </section>
  )
}
