import { Navigate, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

import { useAuth } from '@/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useProjects } from '@/projects/ProjectsContext'

const TABS = [
  { to: 'dashboard', label: '대시보드' },
  { to: 'materials', label: '자료' },
  { to: 'checklist', label: '체크리스트' },
  { to: 'minutes', label: '회의록' },
  { to: 'settings', label: '설정' },
]

export function ProjectLayout() {
  const { projectId } = useParams<{ projectId: string }>()
  const { projects, getProject } = useProjects()
  const navigate = useNavigate()
  const { user } = useAuth()

  const currentProject = projectId ? getProject(projectId) : undefined

  if (!currentProject) {
    return <Navigate to="/projects" replace />
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="flex w-60 flex-col border-r border-border px-4 py-6">
        <div className="mb-8 px-2 text-lg font-bold tracking-wide text-ink">TEAMKIT</div>

        <Dropdown
          className="mb-4 w-full"
          trigger={
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-semibold text-ink hover:bg-brand-50"
            >
              <span className="truncate">{currentProject.name}</span>
              <ChevronDown size={16} className="shrink-0 text-subtle" />
            </button>
          }
        >
          {projects.map((project) => (
            <DropdownItem
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}/dashboard`)}
              className={project.id === projectId ? 'font-semibold text-brand-600' : undefined}
            >
              {project.name}
            </DropdownItem>
          ))}
        </Dropdown>

        <nav className="flex flex-1 flex-col gap-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-600' : 'text-muted hover:bg-brand-50/50',
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2 border-t border-border px-2 pt-4">
            <Avatar name={user.name} size="sm" />
            <span className="truncate text-sm font-medium text-ink">{user.name}님</span>
          </div>
        ) : null}
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
