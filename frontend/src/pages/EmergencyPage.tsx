import { useState } from 'react'
import { api } from '../lib/api'

export function EmergencyPage() {
  const [type, setType] = useState<'ambulance' | 'police' | 'women-safety' | 'fire'>('ambulance')
  const [address, setAddress] = useState('')
  const [details, setDetails] = useState('')
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    setResult(null)
    try {
      await api.post('/emergencies', { type, address, details, priority: 'critical' })
      setResult('Emergency request sent. Admin/volunteers will be alerted immediately.')
      setAddress('')
      setDetails('')
    } catch (e: any) {
      setResult(e?.response?.data?.message || 'Failed. Please login and try again.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <div className="text-sm font-semibold text-red-800">Emergency help system</div>
        <div className="mt-1 text-sm text-red-700">Use this only for real emergencies.</div>
      </div>

      <div className="max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3">
          <select
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="ambulance">Ambulance</option>
            <option value="police">Police</option>
            <option value="women-safety">Women safety</option>
            <option value="fire">Fire services</option>
          </select>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address / landmark"
          />
          <textarea
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Additional details (optional)"
          />
          <button onClick={() => void submit()} className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
            Send emergency request
          </button>
          {result ? <div className="text-sm text-zinc-600">{result}</div> : null}
        </div>
      </div>
    </div>
  )
}

