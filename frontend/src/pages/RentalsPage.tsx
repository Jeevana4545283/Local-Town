import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, Heart, 
  Home, X, Loader2, CheckCircle,
  ArrowUpRight, ShieldCheck, Camera,
  MessageSquare, Plus, ChevronLeft, Bookmark
} from 'lucide-react';

// --- Enhanced Types ---
interface Rental {
  id: string;
  title: string;
  price: number;
  city: string;
  street: string;
  category: string;
  furnishing: string;
  nearby: string[];
  rating: number;
  reviewsCount: number;
  liveVisitors: number;
  img: string[];
  tags: string[];
  desc: string;
  isBooked: boolean;
  isVerified: boolean;
  amenities: string[];
  phone?: string;
  ownerName?: string;
  likesCount?: number;
  commentsCount?: number;
}

export function RentalsPage() {
  const [properties, setProperties] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Rental | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', date: '', message: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

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
    furnishing: 'All',
    budget: 100000,
    amenities: [] as string[]
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/rentals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const mapped: Rental[] = data.items.map((r: any) => ({
            id: r.id,
            title: r.title || 'Beautiful Rental',
            price: r.rentPrice || 0,
            city: r.address?.split(',').pop()?.trim() || 'Unknown',
            street: r.address || '',
            category: r.title?.includes('Villa') ? 'Villa' : r.title?.includes('PG') ? 'PG' : 'Apartment',
            furnishing: 'Furnished', // Default
            nearby: r.nearbyAreas || [],
            rating: 4.8,
            reviewsCount: Math.floor(Math.random() * 50) + 10,
            liveVisitors: Math.floor(Math.random() * 10) + 1,
            img: r.imageUrls?.length ? r.imageUrls : ['https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80'],
            tags: ['Verified'],
            desc: r.description || 'Premium verified property ready to move in.',
            isBooked: r.status === 'Booked',
            isVerified: true,
            amenities: ['WiFi', 'Parking', 'AC', 'Security'],
            phone: r.phoneNumber || '',
            ownerName: 'Verified Owner',
            likesCount: Math.floor(Math.random() * 100) + 10,
            commentsCount: Math.floor(Math.random() * 20) + 2
          }));
          setProperties(mapped);
        }
      })
      .catch((err) => console.error("Failed to load rentals:", err))
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
      const matchesFurnishing = filters.furnishing === 'All' || p.furnishing === filters.furnishing;
      const matchesBudget = p.price <= filters.budget;
      const matchesAmenities = filters.amenities.length === 0 || filters.amenities.every(a => p.amenities.includes(a));

      return matchesSearch && matchesCity && matchesCategory && matchesFurnishing && matchesBudget && matchesAmenities;
    });
  }, [properties, searchQuery, filters]);

  // --- Functions ---
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSaved(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    
    setIsBooking(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: selectedProperty.id,
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
                <Home size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">LocalTown</span>
            </div>
            <button onClick={() => navigate(-1)} className="grid size-8 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition">
              <ChevronLeft size={18} className="text-zinc-300" />
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className="flex flex-1 flex-col gap-8 overflow-y-auto custom-scrollbar pr-2 mt-4">
            
            {/* Property Type */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Property Type</p>
              <div className="flex flex-col gap-3">
                {['All', 'Apartment', 'Villa', 'PG', 'Hostel', 'House'].map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilters({...filters, category: c})}>
                    <div className={`grid size-5 place-items-center rounded-md border transition-all ${filters.category === c ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {filters.category === c && <div className="size-2.5 rounded-sm bg-cyan-400" />}
                    </div>
                    <span className={`text-sm font-medium ${filters.category === c ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Furnishing</p>
              <div className="flex flex-col gap-3">
                {['All', 'Furnished', 'Semi Furnished', 'Unfurnished'].map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilters({...filters, furnishing: t})}>
                    <div className={`grid size-5 place-items-center rounded-md border transition-all ${filters.furnishing === t ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {filters.furnishing === t && <div className="size-2.5 rounded-sm bg-indigo-400" />}
                    </div>
                    <span className={`text-sm font-medium ${filters.furnishing === t ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{t === 'All' ? 'Any' : t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Amenities</p>
              <div className="flex flex-col gap-3">
                {['Parking', 'WiFi', 'AC', 'Security', 'Water'].map(a => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleAmenity(a)}>
                    <div className={`grid size-5 place-items-center rounded-md border transition-all ${filters.amenities.includes(a) ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                      {filters.amenities.includes(a) && <div className="size-2.5 rounded-sm bg-cyan-400" />}
                    </div>
                    <span className={`text-sm font-medium ${filters.amenities.includes(a) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Max Rent: ₹{filters.budget.toLocaleString()}</p>
              <input 
                type="range" min="1000" max="100000" step="1000" 
                value={filters.budget}
                onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value)})}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between mt-2 text-xs text-zinc-500 font-bold">
                <span>₹1K</span>
                <span>₹100K+</span>
              </div>
            </div>

          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105"
          >
            <Plus size={18}/> List Property
          </button>
        </aside>

        {/* --- RIGHT CONTENT AREA --- */}
        <main className="flex flex-1 flex-col overflow-y-auto custom-scrollbar relative">
          
          <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Find Your Perfect Stay</h1>
              <p className="mt-1 text-sm font-medium text-zinc-400">Explore verified rentals near your location</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-black/30 px-4 py-2 border border-white/10 w-[300px]">
                <Search size={18} className="text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search city, area, locality..." 
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
                {['Verified Places', 'New Arrivals', 'Trending'].map((tab, i) => (
                  <span key={tab} className={`text-sm font-bold cursor-pointer transition-colors ${i === 0 ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' : 'text-zinc-500 hover:text-zinc-300'}`}>{tab}</span>
                ))}
              </div>
              <p className="text-sm font-medium text-zinc-500">{filteredProperties.length} Properties Found</p>
            </div>

            {filteredProperties.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 mt-10 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-sm">
                <Home size={64} className="text-zinc-600 mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">No rentals found in this area</h3>
                <p className="text-zinc-400 mb-8 max-w-sm text-center">We couldn't find any properties matching your exact filters. Try adjusting your search.</p>
                <button onClick={() => setShowAddForm(true)} className="bg-white/10 hover:bg-white/20 transition-all text-white font-bold px-8 py-3 rounded-xl border border-white/10">
                  List your property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredProperties.map((p, idx) => (
                  <motion.div 
                    key={p.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { setSelectedProperty(p); setPaymentSuccess(false); setActiveImgIdx(0); }}
                    className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:bg-white/10 hover:shadow-cyan-500/10 ${p.isBooked ? 'opacity-60 grayscale-[30%]' : ''}`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={p.img[0]} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      {/* Booking Overlay */}
                      {p.isBooked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                          <div className="bg-red-500/90 text-white font-black px-6 py-2 rounded-xl tracking-widest uppercase border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] transform -rotate-12 scale-110">
                            BOOKED
                          </div>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-col gap-2 z-20">
                        {p.isVerified && <span className="flex items-center gap-1 rounded-full bg-cyan-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm"><ShieldCheck size={12}/> Verified</span>}
                        <span className="flex w-fit items-center gap-1 rounded-full bg-indigo-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">{p.category}</span>
                      </div>

                      <div className="absolute right-4 top-4 z-20">
                        <button 
                          onClick={(e) => toggleSave(e, p.id)}
                          className={`grid size-10 place-items-center rounded-full backdrop-blur-md transition-all border border-white/20 ${saved.includes(p.id) ? 'bg-indigo-500/90 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                        >
                          <Bookmark size={18} fill={saved.includes(p.id) ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="text-xl font-bold leading-tight text-white">{p.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-zinc-300">
                          <MapPin size={14} className="text-cyan-400" /> {p.street}, {p.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 relative z-20">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {p.amenities.slice(0,2).map(a => (
                            <span key={a} className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-zinc-300 border border-white/5">{a}</span>
                          ))}
                          {p.amenities.length > 2 && <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-zinc-300 border border-white/5">+{p.amenities.length - 2}</span>}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-yellow-400 border border-white/5">
                          <Star size={12} fill="currentColor" /> {p.rating}
                        </div>
                      </div>

                      <div className="mb-4 text-xs font-medium text-zinc-400">
                        Listed by <span className="text-zinc-200">{p.ownerName}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Monthly Rent</p>
                          <div className="text-2xl font-black text-white">₹{p.price.toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowBookingForm(true); setSelectedProperty(p); }}
                            className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                          >
                            Book
                          </button>
                          <button className="grid size-10 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20">
                            <ArrowUpRight size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Social Interactions Strip */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-4">
                          <button onClick={(e) => toggleFavorite(e, p.id)} className={`flex items-center gap-1.5 text-xs font-bold ${favorites.includes(p.id) ? 'text-red-400' : 'text-zinc-400 hover:text-zinc-200'}`}>
                            <Heart size={14} fill={favorites.includes(p.id) ? "currentColor" : "none"} /> {favorites.includes(p.id) ? p.likesCount! + 1 : p.likesCount}
                          </button>
                          <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-200">
                            <MessageSquare size={14} /> {p.commentsCount}
                          </button>
                        </div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {p.furnishing}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- ADD PROPERTY MODAL --- */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 w-full max-w-lg relative shadow-2xl">
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"><X size={24}/></button>
              <h2 className="text-3xl font-black mb-2">List Your Property</h2>
              <p className="text-zinc-400 text-sm mb-8 font-medium">Reach thousands of verified tenants.</p>
              
              <div className="space-y-4">
                <div className="h-32 border-2 border-dashed border-white/20 bg-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer group">
                  <Camera size={28} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Drop Photos Here</span>
                </div>
                <input type="text" placeholder="Property Title (e.g. Modern 2BHK)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium placeholder-zinc-500" />
                <div className="flex gap-4">
                  <select className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium appearance-none">
                    <option>Hyderabad</option>
                    <option>Bangalore</option>
                  </select>
                  <select className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium appearance-none">
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>PG</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input type="number" placeholder="Monthly Rent (₹)" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium placeholder-zinc-500" />
                </div>
                <button className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest mt-4 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">Submit Listing</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RENTAL DETAIL MODAL --- */}
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
                {/* Booked Overlay inside modal too */}
                {selectedProperty.isBooked && (
                  <div className="absolute top-8 left-8 bg-red-500/90 text-white font-black px-4 py-2 rounded-xl tracking-widest uppercase border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    BOOKED
                  </div>
                )}
              </div>

              <div className="md:w-1/2 flex flex-col p-8 overflow-y-auto custom-scrollbar bg-zinc-900/90 relative">
                <button onClick={() => setSelectedProperty(null)} className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors hidden md:block"><X size={24}/></button>
                
                <div className="flex gap-3 mb-4 flex-wrap">
                  <span className="rounded-full bg-cyan-500/20 text-cyan-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-cyan-500/30">{selectedProperty.category}</span>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">{selectedProperty.furnishing}</span>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight mb-2">{selectedProperty.title}</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium mb-6">
                  <MapPin size={16} className="text-cyan-400" /> {selectedProperty.street}, {selectedProperty.city}
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8">{selectedProperty.desc}</p>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Mini Map Placeholder */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-center gap-2 overflow-hidden relative group">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                     <div className="relative z-10 flex items-center gap-2 text-cyan-400">
                       <MapPin size={20} />
                       <p className="text-xs font-bold text-white">View on Map</p>
                     </div>
                  </div>
                  {/* Availability Card */}
                  <div className={`border p-4 rounded-2xl flex items-center justify-center gap-3 ${selectedProperty.isBooked ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                     {selectedProperty.isBooked ? <X size={24} /> : <CheckCircle size={24} />}
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Status</p>
                       <p className="text-sm font-bold">{selectedProperty.isBooked ? 'Currently Booked' : 'Available Now'}</p>
                     </div>
                  </div>
                </div>

                {/* Owner Info & Chat */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {selectedProperty.ownerName?.[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Owner</p>
                      <p className="text-sm font-bold text-white">{selectedProperty.ownerName}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors px-4 py-2 rounded-xl text-xs font-bold">
                    <MessageSquare size={16} /> Chat
                  </button>
                </div>

                {/* Booking Section */}
                <div className="mt-auto bg-black/40 border border-white/5 p-6 rounded-[2rem]">
                  {!paymentSuccess ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[10px] font-black uppercase text-zinc-500 mb-1">Monthly Rent</p>
                          <p className="text-3xl font-black text-white">₹{selectedProperty.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowBookingForm(true)}
                        disabled={selectedProperty.isBooked}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex justify-center disabled:opacity-50 text-white"
                      >
                        {isPaying ? <Loader2 className="animate-spin" /> : 'Book Visit'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle size={48} className="text-cyan-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-black mb-1">Visit Scheduled!</h3>
                      <p className="text-zinc-400 text-xs mb-6">We have notified the owner.</p>
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
              <h2 className="text-2xl font-black text-white mb-1">Schedule Visit</h2>
              <p className="text-zinc-400 text-sm mb-6 font-medium">Leave your details for the owner.</p>
              
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
                  {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm Visit'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}