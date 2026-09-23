import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'

export function RedirectIfAuthed() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/projects" replace />
  }

  return <Outlet />
}
