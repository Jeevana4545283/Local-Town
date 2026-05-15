import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { setSession } from '../lib/auth'

export function SignupPage() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    try {
      const r = await api.post('/auth/signup', { name, email, phone, password })
      setSession(r.data.token, r.data.user)
      nav('/dashboard')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Create account</h2>
      <p className="mt-1 text-sm text-zinc-600">Join your town community platform.</p>

      <div className="mt-5 space-y-3">
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <button onClick={() => void submit()} className="w-full rounded-xl bg-zinc-900 px-3 py-2 text-sm text-white">
          Sign up
        </button>
      </div>
    </div>
  )
}

