import { useAuth } from '../auth/AuthProvider'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { session, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">DevPanel</h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="rounded border border-slate-300 px-2.5 py-1.5 text-sm transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">{session?.user.email}</span>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
