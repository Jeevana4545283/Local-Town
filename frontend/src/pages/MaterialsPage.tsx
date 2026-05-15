import { useState } from 'react'
import { api } from '../lib/api'

type Item = { material: 'cement' | 'sand' | 'bricks' | 'steel'; quantity: number; unit?: string }

export function MaterialsPage() {
  const [items, setItems] = useState<Item[]>([{ material: 'cement', quantity: 10, unit: 'bags' }])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [result, setResult] = useState<string | null>(null)

  async function place() {
    setResult(null)
    try {
      await api.post('/materials/orders', { items, deliveryAddress })
      setResult('Order placed. You can pay via Stripe or QR (backend endpoints ready).')
    } catch (e: any) {
      setResult(e?.response?.data?.message || 'Failed. Please login and try again.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Construction materials</h2>
        <p className="text-sm text-zinc-600">Order cement, sand, bricks, steel.</p>
      </div>

      <div className="max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={items[0].material}
            onChange={(e) => setItems([{ ...items[0], material: e.target.value as any }])}
          >
            <option value="cement">Cement</option>
            <option value="sand">Sand</option>
            <option value="bricks">Bricks</option>
            <option value="steel">Steel</option>
          </select>
          <input
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={items[0].quantity}
            onChange={(e) => setItems([{ ...items[0], quantity: Number(e.target.value) }])}
            placeholder="Quantity"
          />
          <input
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={items[0].unit || ''}
            onChange={(e) => setItems([{ ...items[0], unit: e.target.value }])}
            placeholder="Unit (bags/tons)"
          />
        </div>
        <div className="mt-3">
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Delivery address"
          />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => void place()} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white">
            Place order
          </button>
          <span className="text-xs text-zinc-500">Payments: `/api/payments/stripe/intent` and `/api/payments/qr`</span>
        </div>
        {result ? <div className="mt-3 text-sm text-zinc-600">{result}</div> : null}
      </div>
    </div>
  )
}

