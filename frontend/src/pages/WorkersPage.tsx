import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Zap,
  Droplets,
  Paintbrush,
  Hammer,
  Wrench,
  Truck,
  Trash2,
  Monitor,
  HardHat,
  TrendingUp,
  Users,
  CheckCircle2,
  Phone,
  MessageSquare,
  Heart,
  Calendar,
  ChevronRight,
  BarChart3,
  Bot,
  Info,
  AlertCircle,
  Navigation,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import type { WorkerProfile } from '../types';
import { WorkerCard } from '../components/cards/WorkerCard';
import { Card } from '../components/ui/Card';
import { demoWorkers } from '../demo/data';


// --- Enhanced Service Categories ---
const CATEGORIES = [
  { id: 'electrician', label: 'Electrician', icon: <Zap className="size-4" />, color: 'bg-yellow-500' },
  { id: 'plumber', label: 'Plumber', icon: <Droplets className="size-4" />, color: 'bg-blue-500' },
  { id: 'painter', label: 'Painter', icon: <Paintbrush className="size-4" />, color: 'bg-rose-500' },
  { id: 'carpenter', label: 'Carpenter', icon: <Hammer className="size-4" />, color: 'bg-orange-600' },
  { id: 'mechanic', label: 'Mechanic', icon: <Wrench className="size-4" />, color: 'bg-slate-700' },
  { id: 'delivery', label: 'Delivery', icon: <Truck className="size-4" />, color: 'bg-emerald-500' },
  { id: 'cleaner', label: 'Cleaner', icon: <Trash2 className="size-4" />, color: 'bg-cyan-500' },
  { id: 'appliance', label: 'Appliance', icon: <Monitor className="size-4" />, color: 'bg-indigo-500' },
  { id: 'construction', label: 'Labour', icon: <HardHat className="size-4" />, color: 'bg-amber-700' },
];

export function WorkersPage() {
  const [items, setItems] = useState<WorkerProfile[]>([]);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  // activeTab removed (was unused); keep existing UI intact by leaving state unused

  const [isEmergency, setIsEmergency] = useState(false);

  // --- Real-time Analytics Mock ---
  const marketplaceStats = useMemo(() => ({
    onlineCount: 142,
    avgArrival: '14 min',
    savedJobs: 12,
    satisfaction: 99.2
  }), []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/workers', { params: category ? { category } : undefined })
      .then((r) => setItems(r.data.items || []))
      .catch(() => {
        // Advanced client-side filtering logic for fallback
        let filtered = category ? demoWorkers.filter((w) => w.category === category) : demoWorkers;
        if (searchQuery) {
          filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            w.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (isEmergency) {
          filtered = filtered.filter(w => (w as any).isEmergency);
        }
        setItems(filtered as any);
      })
      .finally(() => setLoading(false));
  }, [category, searchQuery, isEmergency]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 pb-20 font-sans selection:bg-indigo-100">
      
      {/* --- PREMIUM HEADER & AI SEARCH --- */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Background Depth Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] bg-fuchsia-100/30 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold mb-6 shadow-xl shadow-slate-200">
                <Bot className="size-4 text-indigo-400" />
                <span>AI-Engine Powered Search</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
                Premium Help, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600">
                  Instantly Dispatched.
                </span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-xl">
                Book verified professionals for home maintenance, logistics, and technical repairs with real-time tracking.
              </p>
            </motion.div>

            {/* Live Stats Glassmorphism Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl shadow-indigo-100/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Service Demand</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-emerald-500" />
                  <span className="text-2xl font-black">High</span>
                </div>
              </div>
              <div className="p-6 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl shadow-indigo-100/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Pros</p>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-indigo-600" />
                  <span className="text-2xl font-black">{marketplaceStats.onlineCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Search Interface */}
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-slate-100">
            <div className="flex-1 flex items-center gap-4 px-6 py-2 border-r border-slate-50">
              <Search className="size-6 text-indigo-500" />
              <input 
                type="text" 
                placeholder="Try 'electrician for AC repair near me'..."
                className="w-full bg-transparent border-none outline-none font-bold text-lg placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 px-6 py-2">
              <Navigation className="size-5 text-slate-400" />
              <span className="font-bold text-slate-600 whitespace-nowrap">Current Location</span>
            </div>
            <button className="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95">
              Find Expert
            </button>
          </div>
        </div>
      </section>

      {/* --- CATEGORY NAVIGATION --- */}
      <div className="sticky top-0 z-[40] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setCategory('')}
              className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${!category ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              All Services
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${category === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* --- MAIN LISTINGS --- */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Verified Professionals</h2>
                <p className="text-slate-400 font-medium">Found {items.length} experts matching your needs</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEmergency(!isEmergency)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${isEmergency ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'}`}
                >
                  <AlertCircle size={14} /> Emergency
                </button>
                <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={`worker-skel-${i}`} className="h-64 bg-white border border-slate-100 rounded-[2.5rem] p-8 animate-pulse">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-16 bg-slate-100 rounded-2xl" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-10 bg-slate-100 rounded-2xl w-full" />
                      <div className="h-10 bg-slate-100 rounded-2xl w-full" />
                    </div>
                  </div>
                ))
              ) : (
                items.map((w) => (
                  <motion.div 
                    key={w._id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedWorker(w)}
                    className="relative cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <WorkerCard worker={w} />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* --- PREMIUM SIDEBAR WIDGETS --- */}
          <div className="lg:col-span-4 space-y-8">
            {/* AI Recommendation Widget */}
            <Card className="p-8 border-none bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Bot className="size-10 text-indigo-500 opacity-20" />
              </div>
              <h3 className="text-xl font-black mb-4">Smart Tips</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Info className="size-5 text-indigo-400" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Most users in your area are currently booking <span className="text-white font-bold">Deep Cleaning</span> services for the weekend.
                  </p>
                </div>
                <button className="w-full py-3 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all mt-4">
                  View Nearby Trends
                </button>
              </div>
            </Card>

            {/* Analytics Summary */}
            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
                Marketplace Health
                <BarChart3 className="size-4 text-emerald-500" />
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Avg Arrival', val: marketplaceStats.avgArrival, color: 'text-indigo-600' },
                  { label: 'Saved Pros', val: marketplaceStats.savedJobs, color: 'text-rose-500' },
                  { label: 'Rating', val: `${marketplaceStats.satisfaction}%`, color: 'text-emerald-500' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">

                    <span className="text-sm font-bold text-slate-600">{stat.label}</span>
                    <span className={`text-lg font-black ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- ADVANCED BOOKING MODAL --- */}
      <AnimatePresence>
        {selectedWorker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl"
              onClick={() => setSelectedWorker(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-5xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row"
            >
              {/* Profile Side */}
              <div className="md:w-[40%] bg-slate-50 p-12 border-r border-slate-100">
                <div className="relative size-40 mx-auto mb-8">
                  <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] rotate-6 shadow-2xl" />
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedWorker.name}&background=6366f1&color=fff&size=256`} 
                    className="relative size-full object-cover rounded-[2.5rem] border-4 border-white"
                    alt={selectedWorker.name}
                  />
                  <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 text-white rounded-2xl shadow-lg border-4 border-white">
                    <ShieldCheck className="size-6" />
                  </div>
                </div>

                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black text-slate-900">{selectedWorker.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-emerald-600 font-black mt-2">
                    <Star className="size-5 fill-current" />
                    <span>{selectedWorker.rating || 4.9} (120+ reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-white rounded-2xl flex items-center justify-between border border-slate-100">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Fare</span>
                     <span className="text-lg font-black text-slate-900">₹399</span>
                   </div>
                   <div className="p-4 bg-white rounded-2xl flex items-center justify-between border border-slate-100">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Distance</span>
                     <span className="text-lg font-black text-slate-900">2.4 KM</span>
                   </div>
                </div>

                <div className="mt-12 flex gap-3">
                  <button className="flex-1 p-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:border-indigo-600 hover:text-indigo-600 transition-all">
                    <MessageSquare size={20} />
                  </button>
                  <button className="flex-1 p-4 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:border-indigo-600 hover:text-indigo-600 transition-all">
                    <Phone size={20} />
                  </button>
                </div>
              </div>

              {/* Booking Action Side */}
              <div className="flex-1 p-12 overflow-y-auto max-h-[85vh]">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black tracking-tight">Confirm Appointment</h2>
                  <button onClick={() => setSelectedWorker(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full">
                    <ChevronRight className="size-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Arrival Window</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['9 AM - 12 PM', '1 PM - 4 PM', '5 PM - 8 PM', 'Immediate'].map((slot) => (
                        <button key={slot} className="p-5 border-2 border-slate-100 rounded-[1.5rem] font-bold text-sm text-slate-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Add Voice/Text Note</p>
                    <textarea 
                      placeholder="Describe the issue in detail..."
                      className="w-full p-6 bg-slate-50 border-none rounded-[1.5rem] min-h-[120px] font-medium outline-none focus:ring-2 ring-indigo-100"
                    />
                  </div>

                  <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-indigo-200">
                    <div>
                      <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">Total Pay</p>
                      <p className="text-4xl font-black">₹449</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all">
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}