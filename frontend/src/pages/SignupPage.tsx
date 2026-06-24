import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, MapPin, User, Building } from 'lucide-react'
import { setSession, getUser } from '../lib/auth'
import { api } from '../lib/api'

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
]

export function SignupPage() {
  const nav = useNavigate()
  
  const currentUser = getUser()
  const [fullName, setFullName] = useState(currentUser?.name || '')
  const [country, setCountry] = useState('India')
  const [stateValue, setStateValue] = useState('')
  const [town, setTown] = useState('')
  const [pincode, setPincode] = useState('')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUser) {
      if (password !== confirmPassword) {
        return alert("Passwords do not match!")
      }
    }
    if (pincode.length !== 6) {
      return alert("Pincode must be exactly 6 digits!")
    }
    
    setLoading(true)
    
    try {
      const payload = { 
        name: fullName, 
        email, 
        phone, 
        password: currentUser ? undefined : password, 
        country, 
        state: stateValue, 
        village: town, 
        pincode 
      }
        
      const r = await api.post('/auth/signup', payload)
      setSession(r.data.token, r.data.user)
      
      setLoading(false)
      nav('/dashboard')
    } catch (e: any) {
      setLoading(false)
      if (e?.response?.data?.errors) {
        const issues = e.response.data.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('\\n')
        alert(`Invalid fields:\\n${issues}`)
      } else {
        alert(e?.response?.data?.message || 'Signup failed')
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950">
      {/* Left Side: Login Form (40%) */}
      <div className="flex w-full flex-col px-8 py-12 lg:w-[40%] lg:px-16 xl:px-24 max-h-screen overflow-y-auto custom-scrollbar">
        <div className="mx-auto mt-auto mb-auto w-full max-w-sm py-12">
          {/* Brand Logo/Title */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Local Town</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Join your local community.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">

            <div className="animate-in fade-in duration-300">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Country</label>
                <select
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="India">India</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">State</label>
                <select
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                >
                  <option value="">Select State...</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  placeholder="9999999999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Village / Town</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                  placeholder="Town name"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pincode</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
                placeholder="123456"
                value={pincode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9\b]+$/.test(val)) setPincode(val);
                }}
              />
            </div>

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

            {!currentUser && (
              <div className="grid grid-cols-2 gap-4">
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`block w-full rounded-xl border px-4 py-3 text-zinc-900 transition-colors focus:outline-none focus:ring-1 dark:bg-zinc-900 dark:text-white ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-600 focus:ring-indigo-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-500'
                      }`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}


            <button
              type="submit"
              disabled={loading || (password !== confirmPassword && confirmPassword !== '')}
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-950"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Sign in
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
