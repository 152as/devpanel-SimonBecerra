import { useAuth } from '../auth/AuthProvider'

export function Header() {
  const { session, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-slate-800">DevPanel</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{session?.user.email}</span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
