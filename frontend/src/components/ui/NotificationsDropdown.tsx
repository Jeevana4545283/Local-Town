import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, Info, MessageSquare, CalendarDays, ExternalLink } from 'lucide-react'

interface NotificationProps {
  userId: string;
}

export function NotificationsDropdown({ userId }: NotificationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [userId])

  const fetchNotifications = async () => {
    if (!userId) return
    try {
      const res = await fetch(`http://localhost:4000/api/notifications/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.items || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/notifications/${id}/read`, { method: 'PUT' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {}
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:4000/api/notifications/read-all/${userId}`, { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {}
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative grid size-10 place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Bell size={18} className="text-zinc-300 dark:text-zinc-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg border-2 border-zinc-900">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 p-4 bg-zinc-50 dark:bg-white/5">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Bell size={16} className="text-cyan-500" /> Notifications
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500 font-medium">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.type === 'Booking' ? CalendarDays : n.type === 'Message' ? MessageSquare : Info
                  return (
                    <div 
                      key={n.id}
                      onClick={() => !n.isRead && markAsRead(n.id)}
                      className={`flex gap-3 p-4 border-b border-zinc-100 dark:border-white/5 transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 ${!n.isRead ? 'bg-cyan-50/50 dark:bg-cyan-500/5' : ''}`}
                    >
                      <div className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full ${!n.isRead ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${!n.isRead ? 'font-black text-zinc-900 dark:text-white' : 'font-bold text-zinc-700 dark:text-zinc-300'}`}>
                            {n.title}
                          </h4>
                        </div>
                        <p className={`text-xs ${!n.isRead ? 'font-medium text-zinc-600 dark:text-zinc-400' : 'text-zinc-500'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-2">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!n.isRead && <div className="mt-2 size-2 shrink-0 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
