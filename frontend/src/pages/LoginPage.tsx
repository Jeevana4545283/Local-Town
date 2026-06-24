import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, MapPin, User, Building } from 'lucide-react'
import { setSession } from '../lib/auth'
import { api } from '../lib/api'
import { GoogleLogin } from '@react-oauth/google'

export function LoginPage() {
  const nav = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const payload = { email, password }
      const r = await api.post('/auth/login', payload)
      setSession(r.data.token, r.data.user)
      
      setLoading(false)
      nav('/dashboard')
    } catch (e: any) {
      setLoading(false)
      alert(e?.response?.data?.message || 'Login failed')
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true)
      const r = await api.post('/auth/google', { credential: credentialResponse.credential })
      setSession(r.data.token, r.data.user)
      setLoading(false)
      nav('/dashboard')
    } catch (err: any) {
      setLoading(false)
      alert(err?.response?.data?.message || 'Google Login failed')
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950">
      {/* Left Side: Login Form (40%) */}
      <div className="flex w-full flex-col px-8 py-12 lg:w-[40%] lg:px-16 xl:px-24 max-h-screen overflow-y-auto">
        <div className="mx-auto mt-auto mb-auto w-full max-w-sm py-12">
          {/* Brand Logo/Title */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Local Town</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Find your next home nearby.</p>
          </div>


          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input
                type="email"
                required
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-950"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">OR</span>
                </div>
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    alert('Google Login Failed');
                  }}
                  theme="filled_black"
                  shape="rectangular"
                  width="100%"
                />
              </div>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Image (60%) */}
      <div className="relative hidden w-[60%] lg:block">
        <div className="absolute inset-0 bg-zinc-900/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
        <img
          src="/login_bg.png"
          alt="Young girl packing for a new home"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold leading-tight drop-shadow-md">
            New home.<br />New beginning.
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/90 drop-shadow">
            Discover a place you'll love to live in. Join our vibrant local community today.
          </p>
        </div>
      </div>
    </div>
  )
}
