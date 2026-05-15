import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Users, Sparkles, Heart, X,
  ArrowUpRight, Search, Zap, Globe, ShieldCheck,
  CheckCircle2, Camera, Ticket
} from 'lucide-react'
import { api } from '../lib/api'


// --- Types ---
type EventItem = { 
  _id: string; 
  title: string; 
  startsAt: string; 
  venue: string; 
  description: string;
  category: string;
  attendees: number;
  image: string;
  price: string;
}

export function EventsPage() {
  const [items, setItems] = useState<EventItem[]>([])
  const [filter, setFilter] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)
  const [likedEvents, setLikedEvents] = useState<string[]>([])

  async function refreshEvents() {
    try {
      const r = await api.get('/events')
      // backend returns: { items }
      const data = r.data?.items || []
      setItems(data as any)
    } catch {
      // keep existing UI fallback if backend fails
    }
  }

  useEffect(() => {
    void refreshEvents()
  }, [])


  const categories = ['All', 'Music', 'Tech', 'Sports', 'Social']
  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter)

  const toggleLike = (id: string) => {
    setLikedEvents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-indigo-100">
      {/* --- Dynamic Header --- */}
      <header className="relative h-[60vh] w-full overflow-hidden bg-zinc-900 flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/50 to-white" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-4xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            Exclusive Community Events
          </span>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-8">
            Live the <span className="italic font-serif">Moment.</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25">Explore Nearby</button>
            <button onClick={() => setIsHostModalOpen(true)} className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-100 transition-all">Host Experience</button>
          </div>
        </motion.div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[{ icon: <Zap size={20}/>, label: "Fast Booking", sub: "Confirmed in seconds" },
            { icon: <Globe size={20}/>, label: "Local Vibes", sub: "Verified organizers" },
            { icon: <ShieldCheck size={20}/>, label: "Secure Pay", sub: "100% refund policy" }].map((stat, i) => (
            <div key={stat.label || `stat-${i}`} className="bg-white/80 backdrop-blur-md border border-zinc-200 p-6 rounded-3xl flex items-center gap-4 shadow-xl shadow-zinc-200/50">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">{stat.icon}</div>
              <div><p className="font-bold text-zinc-900">{stat.label}</p><p className="text-xs text-zinc-500">{stat.sub}</p></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
            <input type="text" placeholder="Search events..." className="pl-12 pr-6 py-3 rounded-2xl bg-zinc-100 border-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(event => (
            <motion.div layout key={event._id} onClick={() => setSelectedEvent(event)} className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all">
              <div className="relative h-72 overflow-hidden">
                <img src={event.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{event.category}</span>
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{event.price}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                  <ArrowUpRight className="text-zinc-300 group-hover:text-indigo-600 transition-all" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium"><MapPin size={16} className="text-indigo-500"/> {event.venue}</div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium"><Users size={16} className="text-indigo-500"/> {event.attendees}+ attending</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- Overlays & Modals --- */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
            isLiked={likedEvents.includes(selectedEvent._id)}
            onLike={() => toggleLike(selectedEvent._id)}
          />
        )}
        {isHostModalOpen && (
          <HostEventModal
            onClose={() => setIsHostModalOpen(false)}
            onSaved={() => {
              setIsHostModalOpen(false)
              void refreshEvents()
            }}
          />
        )}

      </AnimatePresence>
    </div>
  )
}

// --- Sub-Component: Detail View ---
function EventDetailModal({ event, onClose, isLiked, onLike }: any) {
  const [isBooked, setIsBooked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" />
      <motion.div layoutId={`card-${event._id}`} className="relative h-full max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[3rem] bg-white shadow-2xl flex flex-col md:flex-row">
        <div className="relative h-64 md:h-auto md:w-1/2">
          <img src={event.image} className="h-full w-full object-cover" alt="" />
          <button onClick={onClose} className="absolute left-6 top-6 rounded-full bg-white/20 p-2 text-white backdrop-blur-xl hover:bg-white/40 transition-colors"><X/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 md:p-14">
          {!isBooked ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Sparkles size={16} /> <span className="text-xs font-black uppercase tracking-widest">{event.category}</span>
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-8 leading-tight">{event.title}</h2>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-100 rounded-2xl"><Calendar className="text-indigo-600" /></div>
                  <div><p className="text-xs text-zinc-400 font-bold uppercase tracking-tighter">Date</p><p className="font-bold">{event.startsAt}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-zinc-100 rounded-2xl"><MapPin className="text-indigo-600" /></div>
                  <div><p className="text-xs text-zinc-400 font-bold uppercase tracking-tighter">Location</p><p className="font-bold">{event.venue}</p></div>
                </div>
              </div>
              <p className="text-xl text-zinc-500 leading-relaxed mb-12">{event.description}</p>
              <div className="flex gap-4">
                <button onClick={onLike} className={`p-5 rounded-2xl border-2 transition-all ${isLiked ? 'bg-red-50 border-red-500 text-red-500' : 'border-zinc-100 text-zinc-400'}`}>
                  <Heart className={isLiked ? 'fill-current' : ''} />
                </button>
                <button onClick={() => setIsBooked(true)} className="flex-1 bg-zinc-900 text-white rounded-2xl font-bold py-5 hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                  <Ticket size={20}/> Get Ticket — {event.price}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-emerald-100 text-emerald-600 rounded-full mb-6"><CheckCircle2 size={48} /></div>
              <h3 className="text-4xl font-bold mb-4">You're going!</h3>
              <p className="text-zinc-500 mb-10">We've added {event.title} to your schedule. Check your email for the digital pass.</p>
              <button onClick={onClose} className="px-10 py-4 bg-zinc-900 text-white rounded-full font-bold">Finish</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// --- Sub-Component: Host Event Form ---
function HostEventModal({ onClose, onSaved }: any) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Music')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [venue, setVenue] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      // backend expects: title, description?, startsAt(datetime), endsAt?, venue?, organizerName?, contactPhone?
      // keep category from UI but backend doesn't have it; store into description if needed.
      const payload: any = {
        title: title.trim(),
        description: (description || '').trim() || undefined,
        startsAt: startsAt || new Date().toISOString(),
        venue: (venue || '').trim() || undefined,
        organizerName: undefined,
        contactPhone: undefined,
      }

      // Append category to description to retain info without schema change
      if (category && payload.description) payload.description = `${payload.description}\n\nCategory: ${category}`
      if (category && !payload.description) payload.description = `Category: ${category}`

      await api.post('/events', payload)
      onSaved?.()
    } catch {
      // no UI redesign; keep silent failure to avoid layout changes
    }
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative h-full w-full max-w-xl bg-white p-12 shadow-2xl overflow-y-auto">
        <button onClick={onClose} className="mb-12 text-zinc-400 hover:text-zinc-900 flex items-center gap-2 font-bold"><X size={20}/> Cancel</button>
        <h2 className="text-5xl font-bold tracking-tighter mb-4 italic font-serif">Host</h2>
        <h2 className="text-5xl font-bold tracking-tighter mb-12">New Experience</h2>
        <form className="space-y-8" onSubmit={onSubmit}>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Event Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g. Rooftop Movie Night"
              className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 transition-colors text-xl font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</label>
              <input
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600"
              /></div>
            <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 bg-transparent"
              ><option>Music</option><option>Tech</option><option>Social</option></select></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell us about the vibe..."
              className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 resize-none"
            ></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Venue</label>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              type="text"
              placeholder="e.g. Silicon Tower"
              className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 transition-colors text-xl font-medium"
            />
          </div>
          <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-10 text-center hover:border-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all group">
            <Camera className="mx-auto mb-3 text-zinc-300 group-hover:text-indigo-600" size={32} /><p className="text-xs font-bold text-zinc-400">Upload Hero Image</p>
          </div>
          <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all">Launch Event</button>
        </form>

      </motion.div>
    </div>
  )
}