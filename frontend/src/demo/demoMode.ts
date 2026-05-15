export function isDemoMode() {
  const v = (import.meta as any).env?.VITE_DEMO
  if (v === 'true' || v === true) return true
  // Default to demo when API base is missing/localhost to keep UI populated
  return false
}

