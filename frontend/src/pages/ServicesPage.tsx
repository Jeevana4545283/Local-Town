import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { api } from '../lib/api'
import { 
  Sparkles, Trash2, MapPin, ClipboardList, CheckCircle2, 
  Loader2, ArrowRight, ShieldCheck, Zap, Navigation, 
  Globe, Clock, ChevronRight, X, Locate, Droplets, 
  Hammer, Monitor, Bug, Truck, Wind, Shirt, 
  Trees, ShieldAlert, AlertTriangle, Star, Search,
  CreditCard, History, BarChart3, Bot, Compass, PhoneCall
} from 'lucide-react'

// --- Extended Futuristic Categories ---
const SERVICE_CATEGORIES = [
  { id: 'home-cleaning', label: 'Interior Care', icon: <Sparkles size={20} />, desc: 'Deep sanitation', color: 'indigo' },
  { id: 'waste-management', label: 'Eco Trace', icon: <Trash2 size={20} />, desc: 'Resource recovery', color: 'emerald' },
  { id: 'electrician', label: 'Power Grid', icon: <Zap size={20} />, desc: 'Wiring & Repairs', color: 'yellow' },
  { id: 'plumber', label: 'Hydro Flow', icon: <Droplets size={20} />, desc: 'Leaks & Pipes', color: 'blue' },
  { id: 'carpenter', label: 'Wood Craft', icon: <Hammer size={20} />, desc: 'Furniture & Fix', color: 'orange' },
  { id: 'ac-repair', label: 'Climate Control', icon: <Wind size={20} />, desc: 'AC & Ventilation', color: 'cyan' },
  { id: 'appliance', label: 'Systems', icon: <Monitor size={20} />, desc: 'Fridge & Washers', color: 'purple' },
  { id: 'pest-control', label: 'Bio Shield', icon: <Bug size={20} />, desc: 'Eco-Pest removal', color: 'rose' },
  { id: 'movers', label: 'Logistics', icon: <Truck size={20} />, desc: 'Shift & Pack', color: 'slate' },
  { id: 'laundry', label: 'Fabric Care', icon: <Shirt size={20} />, desc: 'Wash & Fold', color: 'sky' },
  { id: 'gardening', label: 'Flora', icon: <Trees size={20} />, desc: 'Landscape care', color: 'green' },
  { id: 'security', label: 'Fortress', icon: <ShieldCheck size={20} />, desc: 'CCTV & Guards', color: 'zinc' },
]

export function ServicesPage() {
  const [type, setType] = useState<string>('home-cleaning')
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isEmergency, setIsEmergency] = useState(false)

  // --- Analytics Mock ---
  const stats = useMemo(() => ({
    activeDispatches: 24,
    avgEta: '18m',
    demand: 'High',
    satisfaction: 98.2
  }), [])

  // Filter logic
  const filteredServices = SERVICE_CATEGORIES.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleSubmit() {
    if (!address.trim()) {
      setStatus('error')
      setMessage('Deployment address is required.')
      return
    }
    setStatus('loading')
    try {
      await api.post('/services', { type, address, notes, emergency: isEmergency })
      setStatus('success')
      setStep(4) // Confirmation UI
    } catch (e: any) {
      setStatus('error')
      setMessage(e?.response?.data?.message || 'Neural link failed. Retrying...')
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-600 font-light selection:bg-indigo-100">
      
      {/* --- FLOATING AMBIENT LIGHTING --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-fuchsia-200/20 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:py-20">
        
        {/* --- HEADER & ANALYTICS DASHBOARD --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Core Systems v4.0</span>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-ping" /> Live Telemetry
              </div>
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-extralight text-slate-900 tracking-tight leading-[0.9] mb-8">
              Smart <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Infrastructure.</span><br />
              Delivered on Demand.
            </h1>
            
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="AI Smart Search (e.g. 'Fix AC leakage')"
                className="w-full bg-white/60 backdrop-blur-md border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-4 ring-indigo-500/5 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
              { label: 'Active Dispatches', val: stats.activeDispatches, icon: <Navigation size={14}/> },
              { label: 'Avg Arrival', val: stats.avgEta, icon: <Clock size={14}/> },
              { label: 'Network Load', val: stats.demand, icon: <Zap size={14}/> },
              { label: 'Satisfaction', val: `${stats.satisfaction}%`, icon: <Star size={14}/> },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-white border border-slate-50 rounded-3xl shadow-sm">

                <div className="text-slate-400 mb-2">{s.icon}</div>
                <div className="text-xl font-bold text-slate-900">{s.val}</div>
                <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* --- LEFT: SERVICE GRID --- */}
          <section className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Compass className="size-4" /> Available Protocols
              </h3>
              <button 
                onClick={() => setIsEmergency(!isEmergency)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${isEmergency ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'}`}
              >
                <AlertTriangle size={14} /> EMERGENCY MODE
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <ThinServiceCard 
                    key={service.id}
                    active={type === service.id} 
                    onClick={() => { setType(service.id); setStep(1); }}
                    icon={service.icon}
                    title={service.label}
                    desc={service.desc}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* --- RIGHT: INTERACTIVE COMMAND CENTER --- */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-12 space-y-6">
              
              <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-100/50 relative overflow-hidden">
                {/* Step Progress Indicator */}
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={`step-${i}`} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                  ))}

                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-xl font-medium text-slate-900">Set Destination</h2>
                        <p className="text-xs text-slate-400">Specify the deployment coordinate for your agent.</p>
                      </div>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-4 ring-indigo-500/5 transition-all"
                          placeholder="Search address..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm hover:scale-105 transition-transform"><Locate size={14} className="text-indigo-500"/></button>
                      </div>
                      <button onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                        INITIALIZE DISPATCH <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-xl font-medium text-slate-900">Contextual Notes</h2>
                        <p className="text-xs text-slate-400">Add instructions for secure agent entry.</p>
                      </div>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm outline-none focus:ring-4 ring-indigo-500/5 min-h-[140px] transition-all"
                        placeholder="Gate codes, pet presence, or urgent details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="flex-1 py-5 border border-slate-100 rounded-[1.5rem] text-[10px] font-black tracking-widest text-slate-400">BACK</button>
                        <button onClick={() => setStep(3)} className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black tracking-widest">CONTINUE</button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                      <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-300">
                          <span>Quote Estimate</span>
                          <ShieldCheck size={14}/>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-light">₹</span>
                          <span className="text-4xl font-bold">499</span>
                          <span className="text-xs text-slate-400 ml-2">Estimated</span>
                        </div>
                        <div className="pt-4 border-t border-white/10 text-[10px] space-y-2">
                          <div className="flex justify-between"><span>Base Rate</span><span>₹399</span></div>
                          <div className="flex justify-between"><span>System Fee</span><span>₹100</span></div>
                        </div>
                      </div>
                      <button 
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] text-xs font-black tracking-[0.2em] shadow-xl shadow-indigo-200 flex items-center justify-center gap-3"
                      >
                        {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'CONFIRM & DEPLOY'}
                      </button>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-6">
                      <div className="size-20 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center border border-emerald-100 shadow-inner">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-slate-900 mb-1">Dispatch Confirmed</h2>
                        <p className="text-xs text-slate-400">Agent ID #9822 assigned. ETA: 12 mins.</p>
                      </div>
                      <div className="h-40 bg-slate-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                         <Navigation className="text-indigo-500 animate-bounce" size={24} />
                         <span className="absolute bottom-4 text-[10px] font-black uppercase tracking-widest">Routing Agent...</span>
                      </div>
                      <button 
                        onClick={() => {setStep(1); setStatus('idle'); setAddress('');}}
                        className="text-[10px] font-black text-indigo-500 underline uppercase tracking-widest"
                      >
                        Book another service
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Assistant Widget */}
              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] flex items-start gap-4">
                <div className="size-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                  <Bot size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">AI Assistant</p>
                  <p className="text-xs leading-relaxed text-indigo-900/70">"Based on your history, you might need <b>Hydro Flow</b> service. High pressure detected in your sector."</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* --- EXTRA FEATURES SECTION --- */}
        <section className="mt-32 space-y-12">
           <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Integrity</h2>
              <div className="flex gap-2">
                <button className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><History size={16}/></button>
                <button className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><CreditCard size={16}/></button>
              </div>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Global Dispatches', val: '1.2M+', trend: '+12%', icon: <Globe size={18}/> },
                { title: 'Response Time', val: '14m 20s', trend: '-2m', icon: <Clock size={18}/> },
                { title: 'Satisfaction Index', val: '4.92/5', trend: '+0.1', icon: <Star size={18}/> },
              ].map((card, i) => (
                <div key={i} className="p-8 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500">
                  <div>
                    <div className="text-slate-400 mb-3">{card.icon}</div>
                    <div className="text-2xl font-bold text-slate-900">{card.val}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</div>
                  </div>
                  <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {card.trend}
                  </div>
                </div>
              ))}
           </div>
        </section>

      </main>

      {/* Footer Meta */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">Urban Hub © 2026. Global Service Protocol v4.2.1</p>
        <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Nodes</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  )
}

// --- High-Performance Lightweight Service Card ---
function ThinServiceCard({ active, onClick, icon, title, desc }: any) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        relative cursor-pointer overflow-hidden rounded-[2rem] p-6 transition-all duration-300 border
        ${active 
          ? 'bg-white border-indigo-400 shadow-[0_20px_50px_-20px_rgba(79,70,229,0.2)]' 
          : 'bg-white/40 border-slate-100 hover:border-slate-200'
        }
      `}
    >
      <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500
        ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400'}
      `}>
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className={`text-sm font-medium ${active ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h3>
        <p className="text-[11px] text-slate-400 font-normal">{desc}</p>
      </div>

      {active && (
        <motion.div 
          layoutId="active-indicator" 
          className="absolute top-4 right-4 text-indigo-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <CheckCircle2 size={16} />
        </motion.div>
      )}
    </motion.div>
  )
}