import { useState, useMemo } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Star, Share2, Plus, 
  Home, X, Loader2, CheckCircle,
  ArrowUpRight, Filter, Camera,

  Wifi, Coffee, ShieldCheck, Heart, Users, 
  TrendingUp, BarChart3, Building2, 
  Eye, IndianRupee, Zap, Download

} from 'lucide-react';

// --- Enhanced Types ---
interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  street: string;
  category: 'PG' | 'Hostel' | 'Apartment' | 'Villa' | '1BHK' | '2BHK' | '3BHK';
  type: 'Furnished' | 'Unfurnished' | 'Semi-Furnished';
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
}

// --- Realistic Expanded Data ---
const INITIAL_PROPERTIES: Property[] = [
  { 
    id: 'p1', 
    title: 'Skyline Luxury Penthouse', 
    price: 55000, 
    city: 'Hyderabad',
    street: 'Financial District',
    category: '3BHK',
    type: 'Furnished',
    nearby: ['Wipro Circle', 'Microsoft IT Park', 'Continental Hospital'],
    rating: 4.9, 
    reviewsCount: 124,
    liveVisitors: 12,
    img: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80'],
    tags: ['Luxury', 'Trending'],
    desc: 'Breathtaking city views with automated smart home features. Prime location for IT professionals.',
    isBooked: false,
    isVerified: true,
    amenities: ['Wifi', 'Gym', 'Pool', 'Parking']
  },
  { 
    id: 'p2', 
    title: 'Modern Student Co-Living', 
    price: 12500, 
    city: 'Bangalore',
    street: 'Koramangala',
    category: 'PG',
    type: 'Furnished',
    nearby: ['Christ College', 'St. Johns Hospital', 'Forum Mall'],
    rating: 4.5, 
    reviewsCount: 89,
    liveVisitors: 45,
    img: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'],
    tags: ['Student Friendly', 'Verified'],
    desc: 'High-speed internet and home-style meals included. Walkable distance to major colleges.',
    isBooked: false,
    isVerified: true,
    amenities: ['Wifi', 'Food', 'Laundry']
  },
  { 
    id: 'p3', 
    title: 'The Green Villa', 
    price: 85000, 
    city: 'Hyderabad',
    street: 'Jubilee Hills',
    category: 'Villa',
    type: 'Furnished',
    nearby: ['Apollo Hospital', 'KBR Park', 'Metro Station'],
    rating: 5.0, 
    reviewsCount: 42,
    liveVisitors: 5,
    img: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80'],
    tags: ['Premium', 'Family'],
    desc: 'Independent villa with private lawn, 24/7 security, and ultra-modern kitchen.',
    isBooked: false,
    isVerified: true,
    amenities: ['Garden', 'Security', 'EV Charging']
  },
  { 
    id: 'p4', 
    title: 'Urban Hive Hostel', 
    price: 8000, 
    city: 'Pune',
    street: 'Viman Nagar',
    category: 'Hostel',
    type: 'Semi-Furnished',
    nearby: ['Symbiosis College', 'Phoenix Mall', 'IT Park'],
    rating: 4.2, 
    reviewsCount: 210,
    liveVisitors: 67,
    img: ['https://images.unsplash.com/photo-1555854817-5b2738a75574?auto=format&fit=crop&q=80'],
    tags: ['Budget', 'Popular'],
    desc: 'Vibrant community living with shared workspaces and rooftop cafe.',
    isBooked: true,
    isVerified: true,
    amenities: ['Wifi', 'Cafe', 'Gaming Zone']
  }
];

export function RentalsPage() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // --- Advanced Filter State ---
  const [filters, setFilters] = useState({
    city: 'All',
    category: 'All',
    type: 'All',
    budget: 100000,
    proximity: 'All'
  });

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
      const matchesBudget = p.price <= filters.budget;
      const matchesProx = filters.proximity === 'All' || p.nearby.some(n => n.includes(filters.proximity));

      return matchesSearch && matchesCity && matchesCategory && matchesType && matchesBudget && matchesProx;
    });
  }, [properties, searchQuery, filters]);

  // --- Functions ---
  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handlePayment = async (property: Property) => {
    setIsPaying(true);
    // Mock Razorpay / Backend Handshake
    setTimeout(() => {
      setPaymentSuccess(true);
      setIsPaying(false);
      setProperties(prev => prev.map(p => p.id === property.id ? { ...p, isBooked: true } : p));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-indigo-600 p-2 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Home size={22} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">SmartTown</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddForm(true)}
              className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all"
            >
              <Plus size={18}/> List Property
            </button>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Heart className={favorites.length > 0 ? "text-red-500 fill-red-500" : "text-slate-600"} size={24} />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{favorites.length}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- ANALYTICS DASHBOARD WIDGETS --- */}
      <section className="max-w-7xl mx-auto px-8 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Live Demand', val: 'High', icon: <TrendingUp size={16}/>, color: 'text-orange-500' },
          { label: 'Avg Rent', val: '₹22,400', icon: <IndianRupee size={16}/>, color: 'text-emerald-500' },
          { label: 'Occupancy', val: '94%', icon: <BarChart3 size={16}/>, color: 'text-indigo-500' },
          { label: 'Popular Area', val: 'Hitech City', icon: <Building2 size={16}/>, color: 'text-blue-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4">

            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-black">{stat.val}</p>
            </div>
          </div>
        ))}
      </section>

      {/* --- HERO & ADVANCED SEARCH --- */}
      <section className="max-w-7xl mx-auto px-8 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8">
            Find your next <br/><span className="text-indigo-600">Smart Stay.</span>
          </h1>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 max-w-5xl">
              <div className="flex-[2] flex items-center gap-4 px-6 py-3 border-r border-slate-100">
                <Search className="text-indigo-500" size={22} />
                <input 
                  type="text" 
                  placeholder="Search street, college, or IT park..." 
                  className="w-full bg-transparent outline-none font-semibold placeholder:text-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 hidden md:flex items-center gap-3 px-4">
                <MapPin className="text-slate-400" size={18} />
                <select 
                  className="bg-transparent outline-none font-bold text-sm w-full cursor-pointer"
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                >
                  <option value="All">All Cities</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-100 text-slate-900 px-6 py-4 rounded-[2rem] font-black uppercase text-xs flex items-center gap-2 hover:bg-slate-200 transition-all"
              >
                <Filter size={16}/> Filters
              </button>
              <button className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors">
                Search
              </button>
            </div>

            {/* --- EXPANDABLE FILTERS --- */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Property Category</p>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'PG', 'Hostel', 'Apartment', 'Villa'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setFilters({...filters, category: c})}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filters.category === c ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Max Budget: ₹{filters.budget.toLocaleString()}</p>
                      <input 
                        type="range" min="5000" max="100000" step="5000" 
                        value={filters.budget}
                        onChange={(e) => setFilters({...filters, budget: parseInt(e.target.value)})}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Furnishing</p>
                      <select 
                        className="w-full p-3 bg-slate-50 rounded-2xl text-sm font-bold outline-none"
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                      >
                        <option value="All">All Types</option>
                        <option value="Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Near Places</p>
                      <select 
                        className="w-full p-3 bg-slate-50 rounded-2xl text-sm font-bold outline-none"
                        onChange={(e) => setFilters({...filters, proximity: e.target.value})}
                      >
                        <option value="All">Anywhere</option>
                        <option value="Metro">Near Metro</option>
                        <option value="College">Near College</option>
                        <option value="IT Park">Near IT Park</option>
                        <option value="Hospital">Near Hospital</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* --- PROPERTY GRID --- */}
      <main className="max-w-7xl mx-auto px-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Curated Collections</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {['Trending', 'Luxury', 'Student-Friendly', 'Family'].map(tab => (
                <span key={tab} className="whitespace-nowrap text-sm font-black text-slate-900 border-b-2 border-indigo-600 pb-1 cursor-pointer">{tab}</span>
              ))}
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400">{filteredProperties.length} Properties Found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProperties.map((p, idx) => (
            <motion.div 
              key={p.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              onClick={() => { setSelectedProperty(p); setPaymentSuccess(false); setActiveImgIdx(0); }}
              className={`group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer relative ${p.isBooked ? 'opacity-75' : ''}`}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={p.img[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                {/* Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   {p.isBooked && <span className="bg-red-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg">Sold Out</span>}
                   {p.isVerified && <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1"><ShieldCheck size={10}/> Owner Verified</span>}
                </div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => toggleFavorite(e, p.id)}
                    className={`bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl transition-all ${favorites.includes(p.id) ? 'bg-red-500 text-white' : 'hover:bg-red-500 hover:text-white'}`}
                  >
                    <Heart size={18} fill={favorites.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 flex gap-2">
                  <span className="bg-slate-900/80 backdrop-blur text-white text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Eye size={10}/> {p.liveVisitors} viewing
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black tracking-tight">{p.title}</h3>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                    <Star size={12} fill="currentColor" /> {p.rating} ({p.reviewsCount})
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex items-center gap-1 font-medium italic">
                   {p.street}, {p.city}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.amenities.slice(0,3).map(a => (
                    <span key={a} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">{a}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent</span>
                    <p className="text-2xl font-black text-slate-900">₹{p.price.toLocaleString()}</p>
                  </div>
                  <button className={`p-4 rounded-2xl transition-all ${p.isBooked ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    {p.isBooked ? <X size={22}/> : <ArrowUpRight size={22} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- DETAILED BOOKING MODAL --- */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
            <motion.div 
              layoutId={selectedProperty.id} 
              className="bg-white rounded-[3rem] md:rounded-[4rem] w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProperty(null)} 
                className="absolute top-6 right-6 z-10 size-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl hover:rotate-90 transition-all md:hidden"
              ><X /></button>

              {/* Left: Gallery Slider */}
              <div className="md:w-1/2 bg-slate-100 relative group/slider">
                <img src={selectedProperty.img[activeImgIdx]} className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedProperty.img.map((img, i) => (
                    <button 
                      key={`${img}-${i}`} onClick={() => setActiveImgIdx(i)}
                      className={`h-2 rounded-full transition-all ${activeImgIdx === i ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedProperty(null)} 
                  className="hidden md:flex absolute top-8 left-8 size-14 bg-white rounded-full items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                ><X /></button>
              </div>

              {/* Right: Detailed Info */}
              <div className="md:w-1/2 p-8 md:p-14 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Available Now</span>
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={12}/> Verified Owner
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{selectedProperty.title}</h2>
                  <div className="flex items-center gap-2 text-slate-400 font-bold mb-8">
                    <MapPin size={18} className="text-indigo-500" />
                    <span>{selectedProperty.street}, {selectedProperty.city}</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-indigo-600 underline">View on Map</span>
                  </div>
                  
                  <p className="text-slate-500 leading-relaxed mb-10 text-lg">{selectedProperty.desc}</p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {[
                      { icon: <Wifi />, label: 'Fiber Wifi', val: '100 Mbps' },
                      { icon: <Zap />, label: 'Electricity', val: '24/7 Backup' },
                      { icon: <Users />, label: 'Tenant Type', val: 'Professionals' },
                      { icon: <Coffee />, label: 'Furnishing', val: selectedProperty.type },
                    ].map((feat) => (
                      <div key={feat.label} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">

                        <div className="text-indigo-500 mb-3">{feat.icon}</div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{feat.label}</p>
                        <p className="text-sm font-bold">{feat.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Nearby Highlights */}
                  <div className="bg-indigo-50/50 p-6 rounded-3xl mb-10">
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
                      <MapPin size={14}/> Location Advantage
                    </p>
                    <div className="space-y-3">
                  {selectedProperty.nearby.map((n, i) => (
                        <div key={`${n}-${i}`} className="flex items-center justify-between text-sm font-bold text-slate-700">
                          <span>{n}</span>
                          <span className="text-slate-400 font-medium">~5-10 mins</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Action Card */}
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white sticky bottom-0">
                  {!paymentSuccess ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Reservation Fee</p>
                          <p className="text-4xl font-black tracking-tighter">₹{(selectedProperty.price * 0.1).toLocaleString()}</p>
                          <p className="text-[10px] text-indigo-400 font-bold mt-1">*Adjustable in first month rent</p>
                        </div>
                        <div className="text-right">
                           <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Full Rent</p>
                           <p className="text-xl font-bold">₹{selectedProperty.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <button 
                        disabled={isPaying || selectedProperty.isBooked}
                        onClick={() => handlePayment(selectedProperty)}
                        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${selectedProperty.isBooked ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                      >
                        {isPaying ? <Loader2 className="animate-spin" /> : selectedProperty.isBooked ? 'Already Booked' : 'Pay & Reserve Now'}
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4">
                      <CheckCircle size={50} className="text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-black mb-1">Booking Confirmed!</h3>
                      <p className="text-slate-400 text-sm mb-6">Payment ID: #ST_{Math.floor(Math.random()*100000)}</p>
                      <div className="flex gap-3">
                         <button className="flex-1 py-4 bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                           <Download size={14}/> Invoice
                         </button>
                         <button onClick={() => setSelectedProperty(null)} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-[10px]">Back to Home</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD PROPERTY MODAL (EXISTING UI KEPT) --- */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[3rem] p-10 w-full max-w-lg relative shadow-2xl">
              <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-slate-400 hover:rotate-90 transition-all"><X size={28}/></button>
              <h2 className="text-3xl font-black mb-2">List Your House</h2>
              <p className="text-slate-400 text-sm mb-8 font-medium">Join 500+ premium homeowners today.</p>
              <div className="space-y-4">
                <div className="h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Drop Photos Here</span>
                </div>
                <input type="text" placeholder="Apartment Name / Street" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-semibold" />
                <div className="flex gap-4">
                  <select className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-semibold">
                    <option>Hyderabad</option>
                    <option>Bangalore</option>
                  </select>
                  <select className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-semibold">
                    <option>Apartment</option>
                    <option>PG</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input type="number" placeholder="Rent (₹)" className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-semibold" />
                  <input type="text" placeholder="BHK Type" className="flex-1 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-semibold" />
                </div>
                <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95">Submit Listing</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}