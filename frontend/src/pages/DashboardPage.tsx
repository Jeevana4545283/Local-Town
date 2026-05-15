import { BarChart3, Bell, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '../components/ui/Card'
import { getUser } from '../lib/auth'

const chartData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 180 },
  { name: 'Wed', value: 140 },
  { name: 'Thu', value: 220 },
  { name: 'Fri', value: 260 },
  { name: 'Sat', value: 210 },
  { name: 'Sun', value: 290 },
]

export function DashboardPage() {
  const user = getUser()
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Dashboard</div>
            <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">
              {user ? `Welcome, ${user.name}` : 'Login to continue'}
            </div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
              Analytics, activity, and real-time notifications—built like a SaaS.
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/offers" className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-zinc-900 ring-soft hover:bg-white/15 dark:text-white">
              Browse offers
            </Link>
            <Link to="/admin" className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
              Admin
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">Town growth</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">+18%</div>
              <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">Weekly engagement</div>
            </div>
            <TrendingUp className="size-5 text-emerald-400" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">Requests</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">34</div>
              <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">Cleaning & waste</div>
            </div>
            <BarChart3 className="size-5 text-indigo-400" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">Notifications</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">Live</div>
              <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">Realtime updates</div>
            </div>
            <Bell className="size-5 text-fuchsia-400" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Analytics</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">Business growth</div>
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300">Last 7 days</div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.25)" />
                <YAxis stroke="rgba(255,255,255,0.25)" />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.55)', color: 'white' }} />
                <Area type="monotone" dataKey="value" stroke="rgb(99,102,241)" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Recent activity</div>
          <div className="mt-3 space-y-3 text-sm">
            {[
              'New offer published (Grocery)',
              'Worker verified (Electrician)',
              'Emergency request resolved',
              'Materials order delivered',
            ].map((t) => (
              <div key={t} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-200">
                <span className="mt-1.5 size-2 rounded-full bg-emerald-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            <Link to="/services" className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-zinc-900 ring-soft hover:bg-white/15 dark:text-white">
              Create service request
            </Link>
            <Link to="/materials" className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-zinc-900 ring-soft hover:bg-white/15 dark:text-white">
              Order materials
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

