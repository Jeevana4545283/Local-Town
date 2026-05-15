import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Store, Clock, Check, Sparkles, Zap, Search,
  Flame, Star, MapPin,
  Plus, X, Camera, Percent
} from 'lucide-react'

// --- Types ---
type Offer = { 
  _id: string; 
  shopName: string; 
  title: string; 
  description?: string;
  discount: string;
  expiryMinutes: number;
  category: string;
  code?: string;
  image: string;
  rating: number;
}

export function OffersPage() {
  const [items, setItems] = useState<Offer[]>([])
  // const [loading, setLoading] = useState(true)

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false)

  useEffect(() => {
    const fetchOffers = async () => {
    		// setLoading(false)

      const demoData: Offer[] = [
        { _id: '1', shopName: 'Fresh Mart', title: 'Organic Produce Blowout', description: 'Massive discounts on all farm-fresh organic produce and premium dairy.', discount: '50% OFF', expiryMinutes: 45, category: 'Grocery', code: 'FRESH50', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000', rating: 4.8 },
        { _id: '2', shopName: 'Tech Hub', title: 'Pro Gaming Setup Gear', description: 'Mechanical keyboards and RGB wireless mice for professional e-sports.', discount: '₹1000 OFF', expiryMinutes: 12, category: 'Tech', code: 'GAMER', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000', rating: 4.9 },
        { _id: '3', shopName: 'Style Studio', title: 'Luxury Cotton Wear', description: 'Premium summer collection. Sustainable fabrics, modern cuts.', discount: 'BOGO', expiryMinutes: 120, category: 'Fashion', code: 'SUMMER', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000', rating: 4.7 },
        { _id: '4', shopName: 'The Bakehouse', title: 'Artisan Pastry Rush', description: 'Freshly baked sourdough and French pastries at half price.', discount: 'FLAT 50%', expiryMinutes: 30, category: 'Food', code: 'BAKE', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000', rating: 4.5 },
      ]
      setItems(demoData)
    }
    fetchOffers()
  }, [])

  const categories = ['All', 'Fashion', 'Tech', 'Food', 'Grocery']

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, activeCategory])

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const addNewOffer = (newOffer: any) => {
    setItems([newOffer, ...items])
    setIsAddOfferOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-zinc-950">
      {/* --- FLASH DEALS TICKER --- */}
      <div className="bg-zinc-900 py-3 overflow-hidden whitespace-nowrap">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="flex gap-10 items-center text-white font-bold text-sm tracking-widest">
          {[...Array(10)].map((_, i) => (
            <div key={`ticker-${i}`} className="flex items-center gap-2">
              <Flame className="text-orange-500 size-4" /> <span>MALL-WIDE FLASH SALE ENDS IN 04:55:12</span>
              <span className="text-zinc-600">•</span> <span>FREE PARKING FOR PURCHASES OVER ₹2000</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* --- HEADER SECTION --- */}
        <header className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="size-4 animate-spin-slow" />
                <span className="text-xs font-black uppercase tracking-widest">New Rewards Available</span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                Unlock <br /> The <span className="text-indigo-600 italic font-serif">City.</span>
              </h1>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => setIsAddOfferOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2">
                  <Plus size={20} /> List Your Offer
                </button>
                <button className="bg-white border border-zinc-200 text-zinc-600 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-50 transition-all">
                  Mall Map
                </button>
              </div>
            </div>

            <div className="relative bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl border border-zinc-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Search className="text-indigo-600" /> Find a Store</h3>
              <input 
                type="text" placeholder="Search brands or categories..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-indigo-600/20 mb-4 transition-all"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* --- OFFERS GRID --- */}
        <main>
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((offer, idx) => (
                <OfferCard key={offer._id} offer={offer} onCopy={handleCopy} isCopied={copiedId === offer._id} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* --- ADD OFFER SLIDE-OVER --- */}
      <AnimatePresence>
        {isAddOfferOpen && (
          <AddOfferModal onClose={() => setIsAddOfferOpen(false)} onSubmit={addNewOffer} />
        )}
      </AnimatePresence>
    </div>
  )
}

// --- SUB-COMPONENT: ADD OFFER FORM ---
function AddOfferModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (offer: Offer) => void }) {
  const [formData, setFormData] = useState({
    shopName: '',
    title: '',
    discount: '',
    category: 'Fashion',
    expiry: '60',
    code: ''
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative h-full w-full max-w-xl bg-white p-12 shadow-2xl overflow-y-auto">
        <button onClick={onClose} className="mb-12 text-zinc-400 hover:text-zinc-900 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"><X size={20}/> Close Panel</button>
        
        <div className="mb-10">
          <h2 className="text-5xl font-black tracking-tighter italic font-serif">Grow Your</h2>
          <h2 className="text-5xl font-black tracking-tighter">Business.</h2>
          <p className="mt-4 text-zinc-500 font-medium">List your flash deal and reach thousands of shoppers in the mall today.</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            _id: Math.random().toString(),
            ...formData,
            expiryMinutes: parseInt(formData.expiry),
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000' // Default placeholder
          });
        }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Store Identity</label>
              <div className="relative">
                <Store className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                <input required value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} type="text" placeholder="e.g. Zara Home" className="w-full border-b-2 border-zinc-100 pl-8 py-4 outline-none focus:border-indigo-600 transition-colors font-bold text-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Offer Headline</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="e.g. Midnight Shoe Drop" className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 transition-colors font-bold text-lg" />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discount Label</label>
                <div className="relative">
                  <Percent className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input required value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} type="text" placeholder="70% OFF" className="w-full border-b-2 border-zinc-100 pl-8 py-4 outline-none focus:border-indigo-600 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Expires In (Mins)</label>
                <div className="relative">
                  <Clock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} type="number" className="w-full border-b-2 border-zinc-100 pl-8 py-4 outline-none focus:border-indigo-600 font-bold" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Promo Code</label>
                <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} type="text" placeholder="e.g. SAVE20" className="w-full border-b-2 border-zinc-100 py-4 outline-none focus:border-indigo-600 font-bold tracking-widest uppercase text-indigo-600" />
            </div>

            <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-10 text-center hover:border-indigo-600 hover:bg-indigo-50/50 cursor-pointer transition-all group">
              <Camera className="mx-auto mb-3 text-zinc-300 group-hover:text-indigo-600" size={32} />
              <p className="text-xs font-bold text-zinc-400">Drop your product photo here</p>
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all">
            Publish Offer Live
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// --- UPGRADED CARD COMPONENT (Shared) ---
function OfferCard({ offer, onCopy, isCopied, index }: { offer: Offer, onCopy: any, isCopied: boolean, index: number }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/40 hover:shadow-2xl transition-all">
      <div className="relative h-56 overflow-hidden">
        <img src={offer.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Star className="size-3 text-amber-500 fill-amber-500" /> {offer.rating}</div>
        </div>
      </div>
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-zinc-400"><MapPin size={14} className="text-indigo-500" /><span className="text-xs font-black uppercase tracking-widest">{offer.shopName}</span></div>
           <div className={`text-[10px] font-black px-2 py-1 rounded-md ${offer.expiryMinutes < 20 ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>{offer.expiryMinutes}M LEFT</div>
        </div>
        <h3 className="text-2xl font-black leading-tight group-hover:text-indigo-600 transition-colors">{offer.title}</h3>
        <div className="flex items-center gap-4 py-4 border-y border-dashed border-zinc-100">
           <div className="text-3xl font-black text-indigo-600">{offer.discount}</div>
           <div className="text-[10px] font-bold text-zinc-400 uppercase leading-tight tracking-tighter">Limited Time<br/>Mall Exclusive</div>
        </div>
        <button onClick={() => onCopy(offer.code || 'MALL2026', offer._id)} className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-indigo-600'}`}>
          {isCopied ? <><Check size={20} /> Applied</> : <><Zap size={20} className="fill-current" /> Reveal Code</>}
        </button>
      </div>
      {/* Visual Ticket Cutouts */}
      <div className="absolute top-[224px] -left-3 size-6 bg-[#FDFDFF] rounded-full" />
      <div className="absolute top-[224px] -right-3 size-6 bg-[#FDFDFF] rounded-full" />
    </motion.div>
  )
}