import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, Moon, Search, Sun, Zap, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { clearSession, getUser, setSession } from '../../lib/auth'
import { api } from '../../lib/api'
import { useTheme } from '../../lib/theme'
import { useDemoNotifications } from '../../demo/useDemoStream'

const nav = [
  { to: '/rentals', label: 'Rentals' },
  { to: '/services', label: 'Services' },
  { to: '/workers', label: 'Workers' },
  { to: '/offers', label: 'Offers' },
  { to: '/events', label: 'Events' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/marketplace', label: 'Marketplace' },
]

export function Navbar() {
  const user = getUser()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navTo = useNavigate()
  const [showOwnerModal, setShowOwnerModal] = useState(false)
  const [ownerCategories, setOwnerCategories] = useState<string[]>([])
  const [pendingOwnerToken, setPendingOwnerToken] = useState<{token: string, user: any} | null>(null)

  const handleSwitchRole = async () => {
    try {
      const res = await api.post('/auth/switch-role')
      
      if (res.data.user.role === 'user') {
        setSession(res.data.token, res.data.user)
        navTo('/dashboard')
        setOpen(false)
        return
      }
      
      if (res.data.user.role === 'OWNER' || res.data.user.role === 'owner') {
        const categories = res.data.user.categories || []
        
        if (categories.length === 0) {
          setSession(res.data.token, res.data.user)
          navTo('/owner/profile')
        } else {
          setPendingOwnerToken({ token: res.data.token, user: res.data.user })
          setOwnerCategories(categories)
          setShowOwnerModal(true)
        }
        setOpen(false)
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Alternate account not found. Please sign up first.')
      navTo('/signup')
      setOpen(false)
    }
  }

  const demoNotif = useDemoNotifications()

  const initials = useMemo(() => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('')
  }, [user?.name])

  return (
    <header className="sticky top-0 z-40">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/70 to-transparent dark:from-zinc-950/60" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-3">
        <div className="glass flex items-center justify-between rounded-3xl px-3 py-2">
          <Link to="/" className="flex items-center gap-3 px-2 py-1">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
              LT
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">LocalTown</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">Smart community platform</div>
            </div>
          </Link>

          <div className="hidden flex-1 px-4 md:block">
            <div className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/20 px-3 py-2 text-sm text-zinc-700 shadow-sm backdrop-blur dark:bg-white/5 dark:text-zinc-200">
              <Search className="size-4 opacity-70" />
              <input
                className="w-full bg-transparent outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                placeholder="Search rentals, workers, offers…"
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  const v = (e.currentTarget.value || '').trim()
                  if (!v) return
                  navTo(`/rentals?q=${encodeURIComponent(v)}`)
                }}
              />
              <div className="hidden rounded-xl bg-white/15 px-2 py-1 text-xs text-zinc-600 dark:text-zinc-300 lg:block">
                Press Enter
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  clsx(
                    'relative rounded-2xl px-3 py-2 text-sm text-zinc-700 transition dark:text-zinc-200',
                    'hover:bg-white/10',
                    isActive && 'bg-white/15 text-zinc-900 dark:text-white',
                  )
                }
              >
                <motion.span layoutId="nav-pill" />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="grid size-10 place-items-center rounded-2xl hover:bg-white/10"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="size-5 text-white" /> : <Moon className="size-5 text-zinc-800" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative grid size-10 place-items-center rounded-2xl hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="size-5 text-zinc-800 dark:text-white" />
                {demoNotif.unreadCount > 0 ? (
                  <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-emerald-400 text-[10px] font-semibold text-zinc-900 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]">
                    {Math.min(9, demoNotif.unreadCount)}
                  </span>
                ) : null}
              </button>

              <AnimatePresence>
                {notifOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-white/20 shadow-glass backdrop-blur-2xl dark:bg-zinc-950/40"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">Notifications</div>
                      <button
                        className="text-xs text-zinc-700 hover:underline dark:text-zinc-200"
                        onClick={() => demoNotif.markAllRead()}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {demoNotif.items.map((n) => (
                        <div
                          key={n._id}
                          className={clsx(
                            'border-b border-white/10 px-4 py-3',
                            !n.read && 'bg-white/10',
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 grid size-8 place-items-center rounded-2xl bg-white/10 text-zinc-900 dark:text-white">
                              <Zap className="size-4 opacity-80" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-zinc-900 dark:text-white">{n.title}</div>
                              <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{n.message}</div>
                              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                                {new Date(n.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                            {!n.read ? <span className="mt-2 size-2 rounded-full bg-emerald-400" /> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-2xl px-2 py-1.5 hover:bg-white/10"
                >
                  <div className="grid size-9 place-items-center rounded-2xl bg-white/15 text-sm font-semibold text-zinc-900 dark:text-white">
                    {initials}
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">{user.name}</div>
                    <div className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">{(user.role as any) === 'OWNER' ? 'OWNER' : 'USER'}</div>
                  </div>
                  <ChevronDown className="size-4 text-zinc-700 dark:text-zinc-200" />
                </button>

                <AnimatePresence>
                  {open ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-3xl border border-white/10 bg-white/20 shadow-glass backdrop-blur-2xl dark:bg-zinc-950/40"
                    >
                      <Link to="/dashboard" className="block px-4 py-3 text-sm text-zinc-900 hover:bg-white/10 dark:text-white">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="block px-4 py-3 text-sm text-zinc-900 hover:bg-white/10 dark:text-white">
                        Profile
                      </Link>
                      <Link to="/admin" className="block px-4 py-3 text-sm text-zinc-900 hover:bg-white/10 dark:text-white">
                        Admin
                      </Link>
                      {user?.role === 'user' ? (
                        <button
                          onClick={handleSwitchRole}
                          className="block w-full border-t border-white/5 px-4 py-3 text-left text-sm font-medium text-indigo-600 hover:bg-white/10 dark:text-indigo-400"
                        >
                          Switch to Owner Portal
                        </button>
                      ) : (
                        <button
                          onClick={handleSwitchRole}
                          className="block w-full border-t border-white/5 px-4 py-3 text-left text-sm font-medium text-indigo-600 hover:bg-white/10 dark:text-indigo-400"
                        >
                          Switch to User Mode
                        </button>
                      )}
                      <button
                        onClick={() => {
                          clearSession()
                          setOpen(false)
                          navTo('/')
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-white/10"
                      >
                        Logout
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1">
                <Link className="rounded-2xl px-3 py-2 text-sm text-zinc-800 hover:bg-white/10 dark:text-white" to="/login">
                  Login
                </Link>
                <Link
                  className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                  to="/signup"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOwnerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/90"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Choose Owner Portal</h3>
                <button
                  onClick={() => setShowOwnerModal(false)}
                  className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {['Rentals', 'Services', 'Workers', 'Offers', 'Events', 'Marketplace'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (pendingOwnerToken) {
                        setSession(pendingOwnerToken.token, pendingOwnerToken.user)
                        // Add this new category to their local categories if it wasn't there
                        const updatedCats = Array.from(new Set([...ownerCategories, cat]))
                        localStorage.setItem('lt_owner_categories', JSON.stringify(updatedCats))
                        const c = cat.toLowerCase()
                        if (c === 'rentals') navTo('/owner/rentals-dashboard')
                        else if (c === 'services') navTo('/owner/services-dashboard')
                        else if (c === 'workers') navTo('/owner/workers-dashboard')
                        else if (c === 'offers') navTo('/owner/offers-dashboard')
                        else if (c === 'events') navTo('/owner/events-dashboard')
                        else if (c === 'marketplace') navTo('/owner/marketplace-dashboard')
                        else navTo('/owner-dashboard')
                        setShowOwnerModal(false)
                      }
                    }}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left font-semibold text-zinc-800 shadow-sm transition-all hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}

