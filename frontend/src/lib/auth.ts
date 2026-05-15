export type AuthedUser = {
  id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
}

export function setSession(token: string, user: AuthedUser) {
  localStorage.setItem('lt_token', token)
  localStorage.setItem('lt_user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('lt_token')
  localStorage.removeItem('lt_user')
}

export function getUser(): AuthedUser | null {
  const raw = localStorage.getItem('lt_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthedUser
  } catch {
    return null
  }
}

