import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Building2,
  Flame,
  MapPin,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'

export function HomePage() {
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState<any[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [rentals, setRentals] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const hasQuery = useMemo(() => query.trim().length > 0, [query])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([api.get('/offers'), api.get('/workers'), api.get('/rentals')])
      .then(([o, w, r]) => {
        if (cancelled) return
        setOffers((o.data.items || []).slice(0, 6))
        setWorkers((w.data.items || []).slice(0, 6))
        setRentals((r.data.items || []).slice(0, 6))
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/10 shadow-glass backdrop-blur-2xl">
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-60 dark:opacity-70"
          initial={{ opacity: 0.35 }}
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute -left-24 -top-20 size-[28rem] rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -right-32 -top-24 size-[26rem] rounded-full bg-emerald-400/25 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 size-[30rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        </motion.div>

        <div className="relative grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-200">
              <Sparkles className="size-4" />
              Premium town experience • AI-first • Real-time
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-6xl"
            >
              Your town,
              <span className="block bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent">
                beautifully connected.
              </span>
            </motion.h1>

            <p className="max-w-xl text-sm text-zinc-700 dark:text-zinc-200 md:text-base">
              Discover nearby rentals, trusted workers, trending offers and events. Request cleaning/waste pickup, get
              emergency help, and receive power-cut/news alerts—powered by an AI assistant.
            </p>

            {/* Search */}
            <Card className="glass-strong p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-zinc-800 dark:text-white">
                  <MapPin className="size-4 opacity-80" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search rentals, workers, offers… (e.g. '2BHK near bus stand')"
                    className="w-full bg-transparent outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                  />
                </div>

                <Link to={hasQuery ? `/rentals?q=${encodeURIComponent(query.trim())}` : '/rentals'}>
                  <Button className="w-full md:w-auto">
                    Search
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/rentals">
                <Button size="lg">
                  Explore rentals
                  <Building2 className="size-4" />
                </Button>
              </Link>
              <Link to="/workers">
                <Button size="lg" variant="secondary">
                  Find workers
                  <Users className="size-4" />
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="danger">
                  Emergency
                  <ShieldAlert className="size-4" />
                </Button>
              </Link>
            </div>

            {/* AI assistant teaser */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="glass flex items-start gap-3 rounded-3xl p-4"
            >
              <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20">
                <Bot className="size-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">AI assistant</div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                  Ask: “Best plumber near me”, “room under ₹8k”, “today’s offers”, “power-cut updates”.
                </div>
              </div>
              <div className="hidden text-xs text-zinc-600 dark:text-zinc-300 sm:block">Bottom-right</div>
            </motion.div>
          </div>

          {/* Right panel: map preview + floating cards */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-strong relative overflow-hidden rounded-[2rem] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">Map preview</div>
                <div className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  Live
                </div>
              </div>

              <div className="mt-3 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/10 to-emerald-400/10">
                <motion.div
                  className="relative h-full w-full"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: [1.02, 1.06, 1.02] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute left-[18%] top-[34%] grid size-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-lg dark:bg-white dark:text-zinc-900">
                    <MapPin className="size-5" />
                  </div>
                  <div className="absolute left-[55%] top-[55%] grid size-10 place-items-center rounded-2xl bg-white/30 text-zinc-900 shadow-lg backdrop-blur dark:text-white">
                    <TrendingUp className="size-5" />
                  </div>
                  <div className="absolute left-[72%] top-[25%] grid size-10 place-items-center rounded-2xl bg-fuchsia-500/30 text-zinc-900 shadow-lg backdrop-blur dark:text-white">
                    <Star className="size-5" />
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                      Nearby rentals
                    </div>
                    <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">12</div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-200">Available this week</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                      Quick access
                    </div>
                    <Flame className="size-4 text-red-500" />
                  </div>
                  <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">Emergency</div>
                  <div className="text-sm text-zinc-700 dark:text-zinc-200">One-tap request</div>
                </div>
              </div>
            </motion.div>

            {/* Floating cards */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="pointer-events-none absolute -bottom-6 -left-4 hidden w-56 sm:block"
              >
                <div className="glass rounded-3xl p-4">
                  <div className="text-xs text-zinc-600 dark:text-zinc-300">Featured worker</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">Electrician • 4.9</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-200">
                    <Star className="size-3 text-amber-400" />
                    <span>Top rated in your area</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="pointer-events-none absolute -right-4 top-8 hidden w-56 sm:block"
              >
                <div className="glass rounded-3xl p-4">
                  <div className="text-xs text-zinc-600 dark:text-zinc-300">Trending offer</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">Grocery • 20% off</div>
                  <div className="mt-2 text-xs text-zinc-700 dark:text-zinc-200">Limited time today</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { to: '/rentals', title: 'Rentals', desc: 'Map-ready listings & smart search', icon: Building2, badge: 'Hot' },
          { to: '/workers', title: 'Workers', desc: 'Verified professionals near you', icon: Users, badge: 'Top rated' },
          { to: '/offers', title: 'Offers', desc: 'Live shop deals & notifications', icon: TrendingUp, badge: 'Live' },
          { to: '/emergency', title: 'Emergency', desc: 'Ambulance, police, fire, women safety', icon: ShieldAlert, badge: 'Fast' },
          { to: '/marketplace', title: 'Plots', desc: 'Buy & sell plots / real-estate', icon: MapPin, badge: 'New' },
          { to: '/services', title: 'Cleaning', desc: 'Home cleaning & waste management', icon: Sparkles, badge: 'Pro' },
        ].map((c) => {
          const Icon = c.icon
          return (
            <motion.div key={c.title} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <Link to={c.to}>
                <Card className="group relative overflow-hidden p-5">
                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute -left-16 -top-16 size-52 rounded-full bg-indigo-500/20 blur-2xl" />
                    <div className="absolute -right-16 -bottom-16 size-52 rounded-full bg-emerald-400/15 blur-2xl" />
                  </div>
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/15 text-zinc-900 ring-soft dark:text-white">
                      <Icon className="size-6" />
                    </div>
                    <div className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200">
                      {c.badge}
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">{c.title}</div>
                      <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-200">
                        <Star className="size-3 text-amber-400" />
                        <span>4.8</span>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                        <span className="size-2 rounded-full bg-emerald-400" />
                        Live
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{c.desc}</div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </section>

      {/* Modern sections */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Trending offers
              </div>
              <div className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">Shop deals right now</div>
            </div>
            <Link to="/offers" className="text-sm text-zinc-700 hover:underline dark:text-zinc-200">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={`top-skel-${i}`} className="h-28" />)

              : offers.slice(0, 4).map((o) => (
                  <Card key={o._id} className="p-4">
                    <div className="text-xs text-zinc-600 dark:text-zinc-300">{o.shopName}</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{o.title}</div>
                    <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200 line-clamp-2">{o.description || 'Limited time offer'}</div>
                  </Card>
                ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              AI recommendations
            </div>
            <div className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">What’s best for you</div>
          </div>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20">
                <Bot className="size-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">Try asking</div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                  “Show me nearby rooms under ₹7k” or “Best plumber for bathroom leak”.
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1">
                Ask AI
                <ArrowRight className="size-4" />
              </Button>
              <Link className="flex-1" to="/dashboard">
                <Button className="w-full" variant="ghost">
                  Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Featured workers
              </div>
              <div className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">Trusted professionals</div>
            </div>
            <Link to="/workers" className="text-sm text-zinc-700 hover:underline dark:text-zinc-200">
              Browse
            </Link>
          </div>
          <div className="grid gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={`worker-skel-${i}`} className="h-20" />)

              : workers.slice(0, 3).map((w) => (
                  <Card key={w._id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">{w.category}</div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-200">{w.user?.name || 'Local worker'}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-200">
                        <Star className="size-3 text-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Nearby rentals
              </div>
              <div className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">New listings</div>
            </div>
            <Link to="/rentals" className="text-sm text-zinc-700 hover:underline dark:text-zinc-200">
              View
            </Link>
          </div>
          <div className="grid gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={`rent-skel-${i}`} className="h-24" />)

              : rentals.slice(0, 3).map((r) => (
                  <Card key={r._id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 dark:text-white">{r.title}</div>
                        <div className="text-sm text-zinc-700 dark:text-zinc-200">{r.address || 'Map available'}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">₹{r.rentPerMonth}</div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Testimonials + community updates */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Testimonials
          </div>
          <div className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
            “This feels like Airbnb + Uber for our town.”
          </div>
          <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">
            People discover rentals faster, workers get more leads, and emergency requests reach the right team instantly.
          </div>
          <div className="mt-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-white/10 text-sm font-semibold text-zinc-900 dark:text-white">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">Anita</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">Community manager</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Community updates
          </div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-1 size-2 rounded-full bg-emerald-400" />
              <div className="text-zinc-700 dark:text-zinc-200">Power cut alert system: live updates enabled.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 size-2 rounded-full bg-indigo-400" />
              <div className="text-zinc-700 dark:text-zinc-200">New verified workers added this week.</div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 size-2 rounded-full bg-fuchsia-400" />
              <div className="text-zinc-700 dark:text-zinc-200">Events module now supports announcements.</div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

