import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  
  // Add localtunnel bypass header
  config.headers['Bypass-Tunnel-Reminder'] = 'true'
  
  return config
})

