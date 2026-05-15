import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, Moon, Search, Sun, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { clearSession, getUser } from '../../lib/auth'
import { useTheme } from '../../lib/theme'
import { useDemoNotifications } from '../../demo/useDemoStream'

const nav = [
  { to: '/rentals', label: 'Rentals' },
  { to: '/workers', label: 'Workers' },
  { to: '/offers', label: 'Offers' },
  { to: '/events', label: 'Events' },
  { to: '/services', label: 'Services' },
  { to: '/marketplace', label: 'Marketplace' },
]

export function Navbar() {
  const user = getUser()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const navTo = useNavigate()
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
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300">{user.role}</div>
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
                      <Link to="/admin" className="block px-4 py-3 text-sm text-zinc-900 hover:bg-white/10 dark:text-white">
                        Admin
                      </Link>
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
    </header>
  )
}

