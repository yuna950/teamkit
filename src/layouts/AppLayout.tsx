import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, User } from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/projects', label: '프로젝트', icon: LayoutGrid },
  { to: '/my-page', label: '마이페이지', icon: User },
]

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="flex w-60 flex-col border-r border-border px-4 py-6">
        <div className="mb-8 px-2 text-lg font-bold tracking-wide text-ink">TEAMKIT</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-600' : 'text-muted hover:bg-brand-50/50',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
