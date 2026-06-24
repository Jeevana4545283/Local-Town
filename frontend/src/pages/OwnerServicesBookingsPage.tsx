import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { CalendarDays, Check, X, Clock, User, Phone, MessageSquare } from 'lucide-react'
import { api } from '../lib/api'

export function OwnerServicesBookingsPage() {
  const [serviceBookings, setServiceBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServiceBookings()
  }, [])

  const fetchServiceBookings = async () => {
    try {
      // Use standard fetch since it's DEV bypass
      const token = localStorage.getItem('lt_token') || ''
      const res = await fetch('http://localhost:4000/api/services-bookings/owner', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setServiceBookings(data.items || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('lt_token') || ''
      const res = await fetch(`http://localhost:4000/api/services-bookings/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        fetchServiceBookings() // Refresh list
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">ServiceBooking Requests</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage all visit requests and serviceBookings for your properties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500">Pending Requests</div>
            <div className="text-2xl font-black dark:text-white">{serviceBookings.filter(b => b.status === 'Pending').length}</div>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Check size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500">Accepted</div>
            <div className="text-2xl font-black dark:text-white">{serviceBookings.filter(b => b.status === 'Accepted').length}</div>
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <CalendarDays size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500">Total ServiceBookings</div>
            <div className="text-2xl font-black dark:text-white">{serviceBookings.length}</div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading serviceBookings...</div>
        ) : serviceBookings.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
            <CalendarDays size={48} className="opacity-20 mb-4" />
            <div className="text-lg font-bold">No serviceBookings yet</div>
            <div className="text-sm">When users request a visit, they will appear here.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Guest Info</th>
                  <th className="px-6 py-4">Date & Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {serviceBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.service?.imageUrls?.[0] || 'https://via.placeholder.com/100'} className="size-12 rounded-lg object-cover" />
                        <span className="font-bold text-zinc-900 dark:text-white">{b.service?.title || 'Unknown Property'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1"><User size={14} className="text-zinc-400"/> {b.userName}</div>
                      <div className="text-zinc-500 text-xs flex items-center gap-1 mt-1"><Phone size={12}/> {b.userPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1"><CalendarDays size={14} className="text-zinc-400"/> {new Date(b.visitDate).toLocaleDateString()}</div>
                      {b.message && (
                        <div className="text-zinc-500 text-xs flex items-start gap-1 mt-1 italic max-w-[200px] truncate"><MessageSquare size={12} className="shrink-0 mt-0.5"/> "{b.message}"</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        b.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                        b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {b.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(b.id, 'Accepted')} className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 transition-colors" title="Accept">
                            <Check size={16} strokeWidth={3} />
                          </button>
                          <button onClick={() => updateStatus(b.id, 'Rejected')} className="grid size-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 transition-colors" title="Reject">
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs font-bold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
