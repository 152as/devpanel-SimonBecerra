const ROLE_CLASSES: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  viewer: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
}

const STATUS_CLASSES: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  inactive: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}

function Badge({ value, classes }: { value: string; classes: Record<string, string> }) {
  const className = classes[value] ?? 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${className}`}>
      {value}
    </span>
  )
}

export function RoleBadge({ role }: { role: string }) {
  return <Badge value={role} classes={ROLE_CLASSES} />
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge value={status} classes={STATUS_CLASSES} />
}
