import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../lib/auth'

export function ProtectedRoute() {
  const user = getUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
