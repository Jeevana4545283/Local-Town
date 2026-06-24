import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { clearSession, setSession } from '../../lib/auth'
import {
  LayoutDashboard,
  Home,
  PlusSquare,
  CalendarDays,
  MessageSquare,
  Star,
  Wallet,
  User,
  Settings,
  MapPin
} from 'lucide-react'
import clsx from 'clsx'
import { NotificationsDropdown } from '../ui/NotificationsDropdown'

export function OwnerSidebar() {
  const location = useLocation()
  const nav = useNavigate()
  
  const handleSwitchRole = async () => {
    try {
      const res = await api.post('/auth/switch-role')
      setSession(res.data.token, res.data.user)
      nav('/dashboard')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Alternate account not found. Please sign up first.')
      nav('/signup')
    }
  }
  
  const ownerCategoriesRaw = localStorage.getItem('lt_owner_categories')
  let ownerCategories: string[] = []
  try {
    if (ownerCategoriesRaw) ownerCategories = JSON.parse(ownerCategoriesRaw)
  } catch (e) {}
  if (ownerCategories.length === 0) ownerCategories = ['rentals']
  const normalizedCats = ownerCategories.map(c => c.toLowerCase())

  const path = location.pathname
  let initialCat = normalizedCats[0]
  if (path.includes('services')) initialCat = 'services'
  else if (path.includes('workers')) initialCat = 'workers'
  else if (path.includes('offers')) initialCat = 'offers'
  else if (path.includes('events')) initialCat = 'events'
  else if (path.includes('marketplace')) initialCat = 'marketplace'
  else if (path.includes('rentals')) initialCat = 'rentals'

  const [activeCat, setActiveCat] = useState(initialCat)

  useEffect(() => {
    let c = activeCat
    if (path.includes('services')) c = 'services'
    else if (path.includes('workers')) c = 'workers'
    else if (path.includes('offers')) c = 'offers'
    else if (path.includes('events')) c = 'events'
    else if (path.includes('marketplace')) c = 'marketplace'
    else if (path.includes('rentals')) c = 'rentals'
    if (c !== activeCat) setActiveCat(c)
  }, [path])

  const handleCategorySwitch = (newCat: string) => {
    setActiveCat(newCat)
    nav(`/owner/${newCat}-dashboard`)
  }

  let catLabel = activeCat.charAt(0).toUpperCase() + activeCat.slice(1)
  let bookLabel = 'Bookings'
  if (activeCat === 'services') bookLabel = 'Service Bookings'
  else if (activeCat === 'workers') bookLabel = 'Worker Bookings'
  else if (activeCat === 'offers') bookLabel = 'Offer Orders'
  else if (activeCat === 'events') bookLabel = 'Registrations'
  else if (activeCat === 'marketplace') bookLabel = 'Marketplace Orders'

  const navItems = [
    { to: `/owner/${activeCat}-dashboard`, label: `${catLabel} Dashboard`, icon: LayoutDashboard },
    { to: `/owner/${activeCat}`, label: `My ${catLabel}`, icon: Home },
    { to: `/owner/${activeCat}-bookings`, label: bookLabel, icon: CalendarDays },
    { to: '/owner/inbox', label: 'Inbox / Chats', icon: MessageSquare },
    { to: '/owner/reviews', label: 'Reviews', icon: Star },
    { to: '/owner/earnings', label: 'Earnings', icon: Wallet },
    { to: '/owner/profile', label: 'Profile', icon: User },
    { to: '/owner/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-dvh w-[260px] flex-col border-r border-white/10 bg-white/20 shadow-[8px_0_24px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:bg-zinc-950/40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 bg-white/30 dark:bg-black/20">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
          <MapPin size={24} strokeWidth={2.5} />
        </div>
        <div className="leading-tight flex-1">
          <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">LocalTown</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Owner Portal</div>
        </div>
        <NotificationsDropdown userId={localStorage.getItem('lt_user') ? JSON.parse(localStorage.getItem('lt_user')!).id : ''} />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <div className="mb-4 px-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Active Category</label>
          <select 
            value={activeCat}
            onChange={(e) => handleCategorySwitch(e.target.value)}
            disabled={normalizedCats.length <= 1}
            className="w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {normalizedCats.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              // use end to match exact for dashboard so it doesn't stay highlighted
              end={item.to.includes('-dashboard')}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20 dark:text-indigo-300'
                    : 'text-zinc-600 hover:bg-white/40 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                )
              }
            >
              <Icon size={18} className="opacity-80" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-2">
        <button
          onClick={handleSwitchRole}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-500/20 dark:text-indigo-400"
        >
          Switch to User Mode
        </button>
        <button
          onClick={() => {
            clearSession()
            localStorage.removeItem('lt_owner_categories')
            window.location.href = '/login'
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/50 px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-white/80 dark:bg-white/5 dark:text-red-400 dark:hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
