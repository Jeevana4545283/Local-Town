import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, Heart, 
  Home, ArrowUpRight, ShieldCheck, 
  Users, Zap, Map as MapIcon, 
  Briefcase, Calendar, Tag, Building2, Bell, User, ArrowRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Mock Data ---
const MOCK_RENTALS = [
  { id: '1', title: 'Skyline Penthouse', price: '₹55,000', location: 'Financial District', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', tag: 'Luxury' },
  { id: '2', title: 'Co-Living Hub', price: '₹12,500', location: 'Koramangala', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80', tag: 'Student' },
  { id: '3', title: 'Green Villa', price: '₹85,000', location: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80', tag: 'Premium' },
];

const MOCK_OFFERS = [
  { id: '1', title: '50% Off Designer Wear', discount: '50% OFF', valid: 'Tonight', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80' },
  { id: '2', title: 'Gaming Gear Clearance', discount: 'Flat ₹1500', valid: 'Ends Soon', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80' },
  { id: '3', title: 'Buy 1 Get 1 Pastry', discount: 'BOGO', valid: 'Weekend', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
  { id: '4', title: 'Organic Produce', discount: '40% OFF', valid: 'Today', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80' },
];

const RENT_OPTIONS = ['Family Homes', 'Student Rooms', 'Luxury Apartments', 'PG', 'Hostels', 'Commercial'];

const MOCK_WORKERS = [
  { id: '1', title: 'Ravi Electrician', rate: '₹500/hr', skill: 'Wiring', img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80' },
  { id: '2', title: 'TechFix Appliance', rate: '₹800/fix', skill: 'AC Repair', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80' },
  { id: '3', title: 'Prakash Woodworks', rate: '₹600/hr', skill: 'Carpenter', img: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?auto=format&fit=crop&q=80' },
];

const MOCK_EVENTS = [
  { id: '1', title: 'Neon Nights Festival', price: '₹1500', date: 'This Weekend', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80' },
  { id: '2', title: 'Future Tech Summit', price: '₹5000', date: 'Next Month', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80' },
  { id: '3', title: 'Morning Marathon', price: 'Free', date: 'Sunday', img: 'https://images.unsplash.com/photo-1552674605-171ff525a3d7?auto=format&fit=crop&q=80' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- BACKGROUND (Fixed Full Screen) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f0f8ff] to-[#e6f2ff]" />
        
        {/* Glowing orbs */}
        <div className="absolute -left-32 top-0 size-[40rem] rounded-full bg-cyan-400/30 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 size-[40rem] rounded-full bg-blue-400/30 blur-[100px]" />
      </div>

      {/* --- MAIN SCROLLABLE CONTENT --- */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-12 pb-32 pt-8">
        
        {/* 1. HERO SECTION (Outer Glass Box) */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-white/60 shadow-2xl backdrop-blur-3xl p-8 md:p-16 text-center flex flex-col items-center">
          
          {/* Nested Welcome Box */}
          <div className="relative rounded-[2rem] bg-white/80 border border-slate-200 p-8 md:p-16 w-full shadow-inner mb-12">
            <div className="absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[80px]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-900 shadow-lg mb-8">
                <Home size={32} />
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
                Welcome Back!
              </h1>
              <p className="text-lg text-slate-600 font-medium max-w-xl drop-shadow">
                Manage your town activities easily. Find rentals, local pros, and local events all in one place.
              </p>
            </div>
          </div>

          {/* Nested Search Bar Box */}
          <div className="flex w-full max-w-3xl items-center gap-3 rounded-[2rem] bg-white/90 p-3 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/60 border border-slate-200 text-cyan-400 shadow-inner">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search rentals, workers, offers..." 
              className="w-full bg-transparent text-lg font-medium text-slate-900 placeholder-zinc-400 outline-none px-4"
            />
            <button className="shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 font-bold uppercase tracking-widest text-sm transition hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-95 text-slate-900">
              Search
            </button>
          </div>

        </section>

        {/* 2. FEATURE CARDS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Rentals Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/rentals')}
            className="group cursor-pointer rounded-[2rem] bg-white/60 border border-slate-200 p-6 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/10 hover:border-indigo-500/50 flex flex-col justify-between h-56 relative overflow-hidden"
          >
            {/* Inner nested glow box */}
            <div className="absolute top-0 right-0 size-32 bg-indigo-500/10 blur-[40px] rounded-full" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/70 text-indigo-400 border border-slate-200 group-hover:bg-indigo-500 group-hover:text-slate-900 transition-colors shadow-inner">
                <Home size={28} />
              </div>
              <span className="bg-white/70 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 backdrop-blur-md">142 Active</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Rentals</h3>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:text-indigo-300">
                Browse <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Workers Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/workers')}
            className="group cursor-pointer rounded-[2rem] bg-white/60 border border-slate-200 p-6 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/10 hover:border-emerald-500/50 flex flex-col justify-between h-56 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-32 bg-emerald-500/10 blur-[40px] rounded-full" />
            <div className="flex justify-between items-start relative z-10">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/70 text-emerald-400 border border-slate-200 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors shadow-inner">
                <Briefcase size={28} />
              </div>
              <span className="bg-white/70 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 backdrop-blur-md">45 Pros</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Workers</h3>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:text-emerald-300">
                Find Pros <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Offers Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/offers')}
            className="group cursor-pointer rounded-[2rem] bg-white/60 border border-slate-200 p-6 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/10 hover:border-pink-500/50 flex flex-col justify-between h-56 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-32 bg-pink-500/10 blur-[40px] rounded-full" />
            <div className="flex justify-between items-start relative z-10">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/70 text-pink-400 border border-slate-200 group-hover:bg-pink-500 group-hover:text-slate-900 transition-colors shadow-inner">
                <Tag size={28} />
              </div>
              <span className="bg-white/70 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 backdrop-blur-md">12 Deals</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Offers</h3>
              <div className="flex items-center gap-2 text-pink-400 text-sm font-bold group-hover:text-pink-300">
                Claim <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Events Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => navigate('/events')}
            className="group cursor-pointer rounded-[2rem] bg-white/60 border border-slate-200 p-6 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/10 hover:border-purple-500/50 flex flex-col justify-between h-56 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-32 bg-purple-500/10 blur-[40px] rounded-full" />
            <div className="flex justify-between items-start relative z-10">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/70 text-purple-400 border border-slate-200 group-hover:bg-purple-500 group-hover:text-slate-900 transition-colors shadow-inner">
                <Calendar size={28} />
              </div>
              <span className="bg-white/70 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 backdrop-blur-md">8 Events</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Events</h3>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-bold group-hover:text-purple-300">
                View <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. MAPS SECTION */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <MapIcon className="text-cyan-400" /> Interactive Town Map
            </h2>
            <Link to="/map" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow">Expand Map</Link>
          </div>
          {/* Nested Map Box */}
          <div className="h-96 w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-inner relative z-0 p-2">
            <div className="h-full w-full rounded-[1.5rem] overflow-hidden">
              <MapContainer center={[17.3850, 78.4867]} zoom={13} className="h-full w-full z-0">
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">Carto</a>'
                />
                <Marker position={[17.3850, 78.4867]}>
                  <Popup className="text-black font-bold">You are here</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        {/* 4. RENT OPTIONS GRID */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <Building2 className="text-indigo-400" /> Explore Property Types
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {RENT_OPTIONS.map(opt => (
              <div 
                key={opt}
                onClick={() => navigate('/rentals')}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white/70 p-4 text-center backdrop-blur-md transition-all hover:bg-indigo-500/20 hover:border-indigo-500/50 shadow-inner"
              >
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-white/60 text-slate-600 transition-colors group-hover:bg-indigo-500 group-hover:text-slate-900 border border-slate-200">
                  <Home size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{opt}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURED RENTALS */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <Home className="text-indigo-400" /> Featured Rentals
            </h2>
            <Link to="/rentals" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors drop-shadow">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_RENTALS.map((p) => (
              <motion.div 
                key={p.id} 
                whileHover={{ y: -8 }}
                onClick={() => navigate('/rentals')}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-xl cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={p.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="flex items-center gap-1 rounded-xl bg-indigo-500/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md shadow-md">
                      <ShieldCheck size={12}/> Verified
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-slate-900">
                    <h3 className="text-xl font-bold leading-tight drop-shadow-lg">{p.title}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <MapPin size={14} className="text-indigo-400" /> {p.location}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex items-end justify-between bg-gradient-to-b from-transparent to-black/20">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1">Monthly Rent</p>
                    <div className="text-2xl font-black text-slate-900">{p.price}</div>
                  </div>
                  <button className="grid size-12 place-items-center rounded-xl bg-white/60 border border-slate-200 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-900 transition-colors">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. TRENDING OFFERS */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <Tag className="text-pink-400" /> Trending Offers
            </h2>
            <Link to="/offers" className="text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors drop-shadow">See Deals</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
            {MOCK_OFFERS.map((o) => (
              <motion.div 
                key={o.id}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/offers')}
                className="group relative flex w-80 shrink-0 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-xl cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={o.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-slate-900">
                    <h3 className="text-lg font-bold leading-tight drop-shadow-lg">{o.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex items-end justify-between bg-gradient-to-b from-transparent to-black/20">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1">Discount</p>
                    <div className="text-2xl font-black text-pink-400">{o.discount}</div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200 backdrop-blur-md">Valid: {o.valid}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. WORKERS SECTION */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <Briefcase className="text-emerald-400" /> Nearby Workers
            </h2>
            <Link to="/workers" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors drop-shadow">Find Pros</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_WORKERS.map((w) => (
              <motion.div 
                key={w.id} 
                whileHover={{ y: -6 }}
                onClick={() => navigate('/workers')}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-xl cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="flex p-6 gap-5 items-center border-b border-slate-200 bg-white/60">
                  <img src={w.img} className="size-16 rounded-2xl object-cover shadow-lg border border-slate-200" />
                  <div>
                    <h3 className="text-lg font-bold leading-tight text-slate-900 mb-1">{w.title}</h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-flex border border-amber-500/20">
                      <Star size={10} fill="currentColor" /> 4.9 Rating
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-end justify-between bg-gradient-to-b from-transparent to-black/20">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1">Base Rate</p>
                    <div className="text-xl font-black text-slate-900">{w.rate}</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-md">{w.skill}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 8. EVENTS SECTION */}
        <section className="rounded-[3rem] bg-white/60 border border-slate-200 p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 drop-shadow-md">
              <Calendar className="text-purple-400" /> Upcoming Events
            </h2>
            <Link to="/events" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors drop-shadow">View Schedule</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_EVENTS.map((e) => (
              <motion.div 
                key={e.id} 
                whileHover={{ y: -6 }}
                onClick={() => navigate('/events')}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 shadow-xl cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={e.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 rounded-xl bg-purple-500/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md shadow-md">{e.date}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-slate-900">
                    <h3 className="text-lg font-bold leading-tight drop-shadow-lg">{e.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex items-end justify-between bg-gradient-to-b from-transparent to-black/20">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1">Entry</p>
                    <div className="text-2xl font-black text-slate-900">{e.price}</div>
                  </div>
                  <button className="grid size-10 place-items-center rounded-xl bg-white/60 border border-slate-200 text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-900 transition-colors">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
