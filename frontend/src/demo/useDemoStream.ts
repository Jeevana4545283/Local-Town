import { useEffect, useMemo, useState } from 'react'
import type { DemoNotification } from './data'
import { demoNotifications } from './data'

function nowIso() {
  return new Date().toISOString()
}

export function useDemoNotifications() {
  const [items, setItems] = useState<DemoNotification[]>(() => demoNotifications)

  useEffect(() => {
    const t = setInterval(() => {
      // Simulate new live notifications
      const roll = Math.random()
      const next: DemoNotification =
        roll < 0.25
          ? {
              _id: `n_live_${Math.random().toString(16).slice(2)}`,
              type: 'power-cut',
              title: 'Power update',
              message: 'Maintenance resumed. Expected restoration in 15 minutes.',
              createdAt: nowIso(),
              read: false,
            }
          : roll < 0.5
            ? {
                _id: `n_live_${Math.random().toString(16).slice(2)}`,
                type: 'news',
                title: 'Community update',
                message: 'Waste pickup route updated for Market Road.',
                createdAt: nowIso(),
                read: false,
              }
            : roll < 0.75
              ? {
                  _id: `n_live_${Math.random().toString(16).slice(2)}`,
                  type: 'offer',
                  title: 'New offer',
                  message: 'Town Electronics: Smart Home Week is live now.',
                  createdAt: nowIso(),
                  read: false,
                }
              : {
                  _id: `n_live_${Math.random().toString(16).slice(2)}`,
                  type: 'emergency',
                  title: 'Emergency alert',
                  message: 'Fire services dispatched near Central Park.',
                  createdAt: nowIso(),
                  read: false,
                }

      setItems((prev) => [next, ...prev].slice(0, 25))
    }, 8500)
    return () => clearInterval(t)
  }, [])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return { items, unreadCount, markAllRead }
}

