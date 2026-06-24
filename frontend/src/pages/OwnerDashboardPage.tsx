import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Home, CalendarDays, MessageSquare, Wallet, Check, X, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

export function OwnerDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('lt_token') || ''
        const res = await fetch('http://localhost:4000/api/bookings/owner', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setBookings(data.items || [])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchBookings()
  }, [])
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Welcome back! Here's what's happening with your properties today.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-6 transition-all hover:scale-[1.02]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Home size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Properties</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">12</div>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4 p-6 transition-all hover:scale-[1.02]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Bookings</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{bookings.length}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6 transition-all hover:scale-[1.02]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Chats</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">5</div>
              <span className="rounded-full bg-pink-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">3 New</span>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6 transition-all hover:scale-[1.02]">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Wallet size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Earnings</div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">$12,450</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Bookings Section (Takes up 2 columns) */}
        <div className="lg:col-span-2">
          <Card className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Bookings</h2>
              <Link to="/owner/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200/50 bg-zinc-50/50 text-xs uppercase dark:border-white/10 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Property</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50 dark:divide-white/10">
                  {bookings.slice(0, 5).map(b => (
                    <tr key={b.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-4 font-medium text-zinc-900 dark:text-white">{b.userName}</td>
                      <td className="px-4 py-4">{b.rental?.title}</td>
                      <td className="px-4 py-4">{new Date(b.visitDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          b.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                          b.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">No bookings yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Inbox / Chat Section (Takes up 1 column) */}
        <div>
          <Card className="flex h-[400px] flex-col p-0 overflow-hidden">
            <div className="border-b border-zinc-200/50 bg-white/50 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Live Chat</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-pink-500/10 px-2.5 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-pink-500"></span>
                  </span>
                  3 Unread
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Customer Message */}
              <div className="flex gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">AJ</div>
                <div>
                  <div className="rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
                    Hi! Is the Sunset Villa available for late check-in around 10 PM?
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-500">Alice Johnson • 10:24 AM</div>
                </div>
              </div>
              
              {/* Owner Reply */}
              <div className="flex flex-row-reverse gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md">Me</div>
                <div className="flex flex-col items-end">
                  <div className="rounded-2xl rounded-tr-sm bg-indigo-600 p-3 text-sm text-white shadow-md">
                    Hello Alice! Yes, we have a 24/7 self check-in lockbox, so 10 PM is perfectly fine.
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-500">10:26 AM</div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200/50 bg-white/50 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-4 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                />
                <button className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
