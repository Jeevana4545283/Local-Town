import { motion } from 'framer-motion'
import { Activity, Bell, LayoutGrid, Shield, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { getUser } from '../lib/auth'
import { Card } from '../components/ui/Card'

export function AdminPage() {
  const user = getUser()
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(
    () => [
      { label: 'Users', value: users.length || '—', icon: Users, tint: 'text-indigo-400' },
      { label: 'Notifications', value: 'Live', icon: Bell, tint: 'text-emerald-400' },
      { label: 'Security', value: 'Role-based', icon: Shield, tint: 'text-fuchsia-400' },
    ],
    [users.length],
  )

  useEffect(() => {
    if (!user) return
    api
      .get('/users')
      .then((r) => setUsers(r.data.items || []))
      .catch((e) => setError(e?.response?.data?.message || 'Admin access required'))
  }, [user])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Admin</div>
            <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">SaaS-style control center</div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              Offers, events, alerts, verifications, requests and emergency workflows.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-zinc-700 ring-soft dark:text-zinc-200">
              Role: <span className="font-semibold">{user?.role || 'guest'}</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-zinc-700 ring-soft dark:text-zinc-200">
              Status: <span className="font-semibold text-emerald-300">Live</span>
            </div>
          </div>
        </div>
      </Card>

      {error ? (
        <div className="rounded-3xl border border-red-200/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
            <LayoutGrid className="size-4" />
            Admin modules
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            {[
              { label: 'Offers', icon: Activity },
              { label: 'Events', icon: Activity },
              { label: 'Alerts', icon: Bell },
              { label: 'Worker verification', icon: Shield },
            ].map((i) => (
              <button
                key={i.label}
                className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-left text-zinc-800 ring-soft hover:bg-white/10 dark:text-zinc-100"
              >
                <i.icon className="size-4 opacity-80" />
                {i.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <motion.div key={s.label} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                  <Card className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-300">{s.label}</div>
                        <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</div>
                      </div>
                      <Icon className={`size-5 ${s.tint}`} />
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-4">
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">Users</div>
            <div className="mt-3 divide-y divide-white/10">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-white">{u.name}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-300">{u.email}</div>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs capitalize text-zinc-800 ring-soft dark:text-zinc-100">
                    {u.role}
                  </span>
                </div>
              ))}
              {users.length === 0 && !error ? <div className="py-3 text-sm text-zinc-600 dark:text-zinc-300">No data</div> : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

