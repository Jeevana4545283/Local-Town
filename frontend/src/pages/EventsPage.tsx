import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, Heart, 
  Calendar, X, Loader2, CheckCircle,
  ArrowUpRight, ShieldCheck, Camera,
  Music, Clock, Users, Plus, ChevronLeft
} from 'lucide-react';

// --- Enhanced Types ---
interface Event {
  id: string;
  title: string;
  price: number;
  city: string;
  street: string;
  category: 'Music' | 'Tech' | 'Sports' | 'Social' | 'Arts';
  type: 'Free' | 'Paid';
  nearby: string[];
  rating: number;
  reviewsCount: number;
  img: string[];
  desc: string;
  isBooked: boolean;
  isVerified: boolean;
  amenities: string[];
}


import { useEffect } from 'react';

export function EventsPage() {
  const [properties, setProperties] = useState<Event[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Event | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // --- Booking Form State ---
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', date: '', message: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    let id = localStorage.getItem('lt_guest_id')
    if (!id) {
      id = 'guest-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('lt_guest_id', id)
    }
    return id
  }

  const navigate = useNavigate();

  // --- Advanced Filter State ---
  const [filters, setFilters] = useState({
    city: 'All',
    category: 'All',
    type: 'All',
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const mapped: Event[] = data.items.map((e: any) => ({
            id: e.id,
            title: e.title || 'Unknown Event',
            price: e.ticketPrice || 0,
            city: e.address?.split(',')[0] || 'Unknown',
            street: e.address || '',
            category: 'Social',
            type: e.ticketPrice > 0 ? 'Paid' : 'Free',
            nearby: e.nearbyAreas || [],
            rating: 4.8,
            reviewsCount: Math.floor(Math.random() * 50) + 10,
            img: e.imageUrls?.length ? e.imageUrls : ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'],
            desc: e.description || 'Great event.',
            isBooked: e.status !== 'Upcoming',
            isVerified: true,
            amenities: []
          }));
          setProperties(mapped);
        }
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Smart Search & Filtering Logic ---
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nearby.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCity = filters.city === 'All' || p.city === filters.city;
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesType = filters.type === 'All' || p.type === filters.type;

      return matchesSearch && matchesCity && matchesCategory && matchesType;
    });
  }, [properties, searchQuery, filters]);

  // --- Functions ---
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    
    setIsBooking(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/events-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedProperty.id,
          userName: bookingData.name || 'Guest',
          userPhone: bookingData.phone || '0000000000',
          visitDate: bookingData.date || new Date().toISOString(),
          message: bookingData.message,
          userId: getUserId()
        })
      });
      if (res.ok) {
        setPaymentSuccess(true);
        setShowBookingForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-white">
      
      {/* --- PREMIUM BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" />
        <div className="absolute -left-32 -top-32 size-[40rem] rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 size-[40rem] rounded-full bg-purple-500/20 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      {/* --- MAIN GLASS CONTAINER --- */}
      <div className="relative z-10 flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] m-4 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="flex w-[260px] flex-col border-r border-white/10 bg-black/20 p-6">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-lg">
                <Calendar size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">LocalTown</span>
            </div>
            <button onClick={() => navigate(-1)} className="grid size-8 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition">
              <ChevronLeft size={18} className="text-zinc-300" />
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className="flex flex-1 flex-col gap-8 overflow-y-auto custom-scrollbar pr-2 mt-4">
            
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Event Type</p>
              <div className="flex flex-col gap-3">
                {['All', 'Music', 'Tech', 'Sports', 'Social', 'Arts'].map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilters({...filters, category: c})}>
                    <div className={`grid size-5 place-items-center rounded-md border transition-all ${filters.category === c ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {filters.category === c && <div className="size-2.5 rounded-sm bg-cyan-400" />}
                    </div>
                    <span className={`text-sm font-medium ${filters.category === c ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Pricing</p>
              <div className="flex flex-col gap-3">
                {['All', 'Free', 'Paid'].map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilters({...filters, type: t})}>
                    <div className={`grid size-5 place-items-center rounded-md border transition-all ${filters.type === t ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {filters.type === t && <div className="size-2.5 rounded-sm bg-indigo-400" />}
                    </div>
                    <span className={`text-sm font-medium ${filters.type === t ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{t === 'All' ? 'Any' : t}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
          >
            <Plus size={18}/> Host Event
          </button>
        </aside>

        {/* --- RIGHT CONTENT AREA --- */}
        <main className="flex flex-1 flex-col overflow-y-auto custom-scrollbar relative">
          
          <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Find local events</h1>
              <p className="mt-1 text-sm font-medium text-zinc-400">Discover happenings in your area.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-black/30 px-4 py-2 border border-white/10 w-[300px]">
                <Search size={18} className="text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search festivals, tech..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white placeholder-zinc-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-black/30 px-4 py-2 border border-white/10">
                <MapPin size={18} className="text-zinc-400" />
                <select 
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="w-[120px] bg-transparent text-sm font-medium text-white outline-none appearance-none"
                >
                  <option className="bg-zinc-900" value="All">All Cities</option>
                  <option className="bg-zinc-900" value="Hyderabad">Hyderabad</option>
                  <option className="bg-zinc-900" value="Bangalore">Bangalore</option>
                  <option className="bg-zinc-900" value="Pune">Pune</option>
                </select>
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-4">
                {['Upcoming', 'Popular', 'This Weekend'].map((tab, i) => (
                  <span key={tab} className={`text-sm font-bold cursor-pointer transition-colors ${i === 0 ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-zinc-500 hover:text-zinc-300'}`}>{tab}</span>
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-500">{filteredProperties.length} Events Found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((p, idx) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => { setSelectedProperty(p); setPaymentSuccess(false); setActiveImgIdx(0); }}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:bg-white/10 hover:shadow-cyan-500/10 ${p.isBooked ? 'opacity-60' : ''}`}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={p.img[0]} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      {p.isBooked && <span className="rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">Sold Out</span>}
                      {p.isVerified && <span className="flex items-center gap-1 rounded-full bg-cyan-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"><ShieldCheck size={12}/> Verified</span>}
                    </div>

                    <div className="absolute right-4 top-4">
                      <button 
                        onClick={(e) => toggleFavorite(e, p.id)}
                        className={`grid size-10 place-items-center rounded-full backdrop-blur-md transition-all border border-white/20 ${favorites.includes(p.id) ? 'bg-red-500/90 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                      >
                        <Heart size={18} fill={favorites.includes(p.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold leading-tight text-white">{p.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-zinc-300">
                        <MapPin size={14} className="text-cyan-400" /> {p.street}, {p.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {p.amenities.slice(0,3).map(a => (
                          <span key={a} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-zinc-300 border border-white/5">{a}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-yellow-400 border border-white/5">
                        <Star size={12} fill="currentColor" /> {p.rating}
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Entry</p>
                        <div className="text-2xl font-black text-white">{p.price === 0 ? 'Free' : `₹${p.price}`}</div>
                      </div>
                      <button className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-white shadow-lg transition-transform group-hover:scale-110">
                        <ArrowUpRight size={22} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* --- ADD EVENT MODAL --- */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 w-full max-w-lg relative shadow-2xl">
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"><X size={24}/></button>
              <h2 className="text-3xl font-black mb-2">Host an Event</h2>
              <p className="text-zinc-400 text-sm mb-8 font-medium">Join 500+ premium organizers today.</p>
              
              <div className="space-y-4">
                <div className="h-32 border-2 border-dashed border-white/20 bg-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer group">
                  <Camera size={28} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Drop Event Banner</span>
                </div>
                <input type="text" placeholder="Event Title" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium placeholder-zinc-500" />
                <div className="flex gap-4">
                  <select className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium appearance-none">
                    <option>Hyderabad</option>
                    <option>Bangalore</option>
                  </select>
                  <select className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium appearance-none">
                    <option>Music</option>
                    <option>Tech</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input type="number" placeholder="Ticket Price (₹)" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium placeholder-zinc-500" />
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest mt-4 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">Create Event</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DETAILED BOOKING MODAL --- */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl">
            <motion.div 
              layoutId={selectedProperty.id} 
              className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            >
              <button onClick={() => setSelectedProperty(null)} className="absolute top-4 right-4 z-50 grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md md:hidden"><X size={18}/></button>

              <div className="md:w-1/2 relative bg-black">
                <img src={selectedProperty.img[activeImgIdx]} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/50 hidden md:block" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedProperty.img.map((img, i) => (
                    <button key={i} onClick={() => setActiveImgIdx(i)} className={`h-1.5 rounded-full transition-all ${activeImgIdx === i ? 'w-8 bg-cyan-400' : 'w-2 bg-white/40'}`} />
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col p-8 overflow-y-auto custom-scrollbar bg-zinc-900/90 relative">
                <button onClick={() => setSelectedProperty(null)} className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors hidden md:block"><X size={24}/></button>
                
                <div className="flex gap-3 mb-4">
                  <span className="rounded-full bg-cyan-500/20 text-cyan-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30">Registrations Open</span>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight mb-2">{selectedProperty.title}</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium mb-6">
                  <MapPin size={16} className="text-cyan-400" /> {selectedProperty.street}, {selectedProperty.city}
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8">{selectedProperty.desc}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: <Music />, label: 'Category', val: selectedProperty.category },
                    { icon: <Users />, label: 'Capacity', val: '500+ Expected' },
                    { icon: <Clock />, label: 'Date', val: 'This Weekend' },
                  ].map((feat) => (
                    <div key={feat.label} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                      <div className="text-cyan-400">{feat.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase">{feat.label}</p>
                        <p className="text-sm font-bold">{feat.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto bg-black/40 border border-white/5 p-6 rounded-[2rem]">
                  {!paymentSuccess ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Ticket Cost</p>
                          <p className="text-3xl font-black text-white">{selectedProperty.price === 0 ? 'Free Entry' : `₹${selectedProperty.price}`}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Status</p>
                           <p className="text-lg font-bold text-zinc-300">Available</p>
                        </div>
                      </div>
                      <button 
                          onClick={() => setShowBookingForm(true)}
                          disabled={selectedProperty.isBooked}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex justify-center disabled:opacity-50 text-white"
                        >
                        {isPaying ? <Loader2 className="animate-spin" /> : 'Get Ticket Now'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle size={48} className="text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-black mb-1">Ticket Secured!</h3>
                      <p className="text-zinc-400 text-xs mb-6">Ticket ID: #EV_{Math.floor(Math.random()*100000)}</p>
                      <button onClick={() => setSelectedProperty(null)} className="w-full bg-white/10 py-3 rounded-xl font-bold uppercase text-xs hover:bg-white/20 transition-colors">Close</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BOOKING FORM MODAL --- */}
      <AnimatePresence>
        {showBookingForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md relative shadow-2xl">
              <button onClick={() => setShowBookingForm(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"><X size={20}/></button>
              <h2 className="text-2xl font-black text-white mb-1">Register for Event</h2>
              <p className="text-zinc-400 text-sm mb-6 font-medium">Leave your details to register.</p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-white">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Your Name</label>
                  <input required value={bookingData.name} onChange={e=>setBookingData({...bookingData, name: e.target.value})} placeholder="John Doe" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <input required type="number" value={bookingData.phone} onChange={e=>setBookingData({...bookingData, phone: e.target.value})} placeholder="9999999999" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Preferred Date</label>
                  <input required type="date" value={bookingData.date} onChange={e=>setBookingData({...bookingData, date: e.target.value})} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium [color-scheme:dark]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 block">Message (Optional)</label>
                  <textarea value={bookingData.message} onChange={e=>setBookingData({...bookingData, message: e.target.value})} placeholder="Any specific requirements?" rows={2} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium"></textarea>
                </div>
                
                <button disabled={isBooking} type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest mt-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex justify-center disabled:opacity-50">
                  {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}