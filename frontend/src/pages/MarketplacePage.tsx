import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Plus,
  X,
  Camera,
  Sparkles,
  Navigation,
  Crosshair,
  Target,
  Heart,
  TrendingUp,
  ShieldCheck,
  Filter,

  Compass,
  Check,
  Phone,
  MessageSquare,
  Zap,
  Droplet,
  ArrowRight,
  BarChart3,
  Landmark,
  ChevronRight
} from 'lucide-react'

// --- Extended Luxury Types ---
type Listing = {
  _id: string
  category: 'Plot' | 'Villa' | 'Commercial' | 'Farmland' | 'Gated Community'
  title: string
  seller: string
  location: string
  street: string
  price: number 
  sqyd: number
  sqft: number
  acres: number
  lengthMeters: number
  widthMeters: number
  roadWidthFt: number
  waterAvailable: boolean
  electricityAvailable: boolean
  verified: boolean
  images: string[]
  distance: string
  roi: string
  appreciation: number
  landmarks: string[]
  dimensions: string
  facing: 'East' | 'West' | 'North' | 'South' | 'Corner'
  investmentScore: number
  readyToConstruct: boolean
  tags: string[]
  amenities: string[]
  infrastructure: {
    schools: string
    hospitals: string
    itParks: string
    transit: string
    lifestyle: string
  }
}

export function MarketplacePage() {
  const [items, setItems] = useState<Listing[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'high' | 'low' | 'roi' | 'new'>('new')
  
  // Advanced Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [filterBudget, setFilterBudget] = useState<number>(50000000)
  const [filterFacing, setFilterFacing] = useState<string>('All')
  const [filterVerified, setFilterVerified] = useState<boolean>(false)
  // bookingStep/filters state in this page is UI-only; keep only used setters

  const [filterGated] = useState<boolean>(false)
  const [filterReady] = useState<boolean>(false)

  // Modals & Triggers State
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null)
  const [bookingStep, setBookingStep] = useState<'schedule' | 'payment' | 'confirmed'>('schedule')
  const [reservedPlots, setReservedPlots] = useState<string[]>([])

  const [compareList, setCompareList] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])


  useEffect(() => {
    // Premium dynamic dataset optimized for ultra-rich detailed view
    setItems([
      { 
        _id: '1', 
        category: 'Plot', 
        title: 'North-Facing Premium Corner Plot', 
        seller: 'HNTDA Approved Authority', 
        location: 'Green Valley', 
        street: 'NSP Canal Corridor Rd',
        price: 4850000, 
        sqyd: 166,
        sqft: 1500, 
        acres: 0.034,
        lengthMeters: 13.1,
        widthMeters: 10.6,
        roadWidthFt: 40,
        waterAvailable: true,
        electricityAvailable: true,
        verified: true, 
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=1000',
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000',
          'https://images.unsplash.com/photo-1464234470469-98538b841703?q=80&w=1000'
        ], 
        distance: '0.4 km',
        roi: '12.4% ARR',
        appreciation: 18.5,
        landmarks: ['Highway 65 Junction', 'Global Tech International School'],
        dimensions: '35 x 43 ft',
        facing: 'Corner',
        investmentScore: 94,
        readyToConstruct: true,
        tags: ['HNTDA approved plots', 'corner plots', 'highway-facing plots'],
        amenities: ['24/7 Surveillance Grid', 'Underground Optical Fiber', 'Rainwater Harvesting Pit', 'Premium Blacktop Roads'],
        infrastructure: {
          schools: 'Global Tech International (0.2 km), St. Marys Academy (1.5 km)',
          hospitals: 'NSP Multi-Specialty Core (1.2 km), Apollo Clinic (3.0 km)',
          itParks: 'Miryalaguda Tech Hub Phase 1 (2.5 km)',
          transit: 'Highway 65 Express Node (0.5 km), Central Bus Terminus (4.0 km)',
          lifestyle: 'Green Valley Country Club (0.8 km), Grand Arcade Mall (2.1 km)'
        }
      },
      { 
        _id: '2', 
        category: 'Gated Community', 
        title: 'The Boulevard Estate Enclave', 
        seller: 'Zenith Premium Holdings', 
        location: 'Sagar Road', 
        street: 'Avenue 4 Prime Alpha',
        price: 18500000, 
        sqyd: 444,
        sqft: 4000, 
        acres: 0.091,
        lengthMeters: 24.3,
        widthMeters: 15.2,
        roadWidthFt: 60,
        waterAvailable: true,
        electricityAvailable: true,
        verified: true, 
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000'
        ], 
        distance: '1.2 km',
        roi: '14.2% ARR',
        appreciation: 22.1,
        landmarks: ['KIMS Elite Hospital', 'Outer Ring Road Touch'],
        dimensions: '50 x 80 ft',
        facing: 'East',
        investmentScore: 98,
        readyToConstruct: true,
        tags: ['gated community plots', 'east-facing plots', 'premium ventures'],
        amenities: ['Architectural Entrance Plaza', 'Clubhouse & Hydro-Spa', 'Solar Smart Microgrid', 'Encapsulated Drainage Line'],
        infrastructure: {
          schools: 'Delhi Public School Campus (2.0 km), Oakridge International (5.5 km)',
          hospitals: 'KIMS Sovereign Hospital (0.4 km), Sunshine Medical Zone (1.8 km)',
          itParks: 'Sagar High-Growth Tech Park (3.2 km)',
          transit: 'ORR Interchange Section (0.2 km), Metro Terminal Planned (1.5 km)',
          lifestyle: 'The Pavilion Elite Club (Inside), Capital Galleria (1.0 km)'
        }
      },
      { 
        _id: '3', 
        category: 'Farmland', 
        title: 'Sandalwood Managed Agro Farms', 
        seller: 'Pioneer Eco Assets', 
        location: 'Yadadri Foothills', 
        street: 'Valigonda High-Yield Way',
        price: 6500000, 
        sqyd: 1210,
        sqft: 10890, 
        acres: 0.25,
        lengthMeters: 36.8,
        widthMeters: 27.4,
        roadWidthFt: 33,
        waterAvailable: true,
        electricityAvailable: true,
        verified: true, 
        images: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000',
          'https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=1000',
          'https://images.unsplash.com/photo-1464234470469-98538b841703?q=80&w=1000'
        ], 
        distance: '8.5 km',
        roi: '16.8% ARR',
        appreciation: 25.4,
        landmarks: ['Proposed Regional Ring Road (RRR)'],
        dimensions: '90 x 121 ft',
        facing: 'North',
        investmentScore: 89,
        readyToConstruct: false,
        tags: ['farmland', 'investment plots', 'nearby growth areas'],
        amenities: ['Automated Drip Irrigation Grid', 'Sandalwood Crop Management Cover', 'Fenced Peripheral Border', 'Geothermal Wells'],
        infrastructure: {
          schools: 'Pragati Residential Gurukul (4.0 km)',
          hospitals: 'Rural Emergency Center (2.5 km)',
          itParks: 'Proposed Agro Tech Incubator Zone (6.0 km)',
          transit: 'RRR Planned Expressway (1.2 km), Local Rail Station (5.0 km)',
          lifestyle: 'Yadadri Wellness Resort Cluster (3.5 km)'
        }
      }
    ])
  }, [])

  const handleAiSearch = (prompt: string) => {
    setSearchQuery(prompt);
    if (prompt.toLowerCase().includes('gated')) setActiveCategory('Gated Community');
    else if (prompt.toLowerCase().includes('farm')) setActiveCategory('Farmland');
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(i => {
      const matchesCategory = activeCategory === 'All' || i.category === activeCategory;
      const matchesSearch = 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.street.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBudget = i.price <= filterBudget;
      const matchesFacing = filterFacing === 'All' || i.facing === filterFacing;
      const matchesVerified = !filterVerified || i.verified;
      const matchesGated = !filterGated || i.category === 'Gated Community' || i.tags.includes('gated community plots');
      const matchesReady = !filterReady || i.readyToConstruct;

      return matchesCategory && matchesSearch && matchesBudget && matchesFacing && matchesVerified && matchesGated && matchesReady;
    })

    if (sortOrder === 'high') result.sort((a, b) => b.price - a.price)
    if (sortOrder === 'low') result.sort((a, b) => a.price - b.price)
    if (sortOrder === 'roi') result.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi))
    return result
  }, [items, activeCategory, searchQuery, sortOrder, filterBudget, filterFacing, filterVerified, filterGated, filterReady])


  // bookingStep/filters state is UI-only

  const toggleCompare = (id: string) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handlePropertyClick = (property: Listing) => {
    setSelectedProperty(property);
    setBookingStep('schedule');

  }

  const similarPlots = useMemo(() => {
    if (!selectedProperty) return [];
    return items.filter(i => i._id !== selectedProperty._id && (i.category === selectedProperty.category || i.location === selectedProperty.location));
  }, [selectedProperty, items]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-800 font-light antialiased selection:bg-indigo-50 selection:text-indigo-900">
      
      {/* Top Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- PLATFORM TOP BAR --- */}
      <div className="bg-white/60 backdrop-blur-md border-b border-zinc-100 py-3 px-8 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs tracking-wider text-zinc-500">
            <Crosshair size={13} className="text-indigo-500 animate-pulse" /> 
            <span className="font-normal text-zinc-800">Discovery Corridor:</span> Miryalaguda Hub, TS
          </div>
          <div className="hidden md:flex gap-6 text-xs text-zinc-400 tracking-wide">
            <span className="flex items-center gap-1.5"><Target size={13} className="text-emerald-500"/> Real-time Yield Track Active</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-indigo-500"/> HNTDA / DTCP Registered Zones</span>
          </div>
        </div>
      </div>

      {/* --- MAIN HEADER SECTION --- */}
      <section className="pt-16 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-indigo-600 font-medium">Sovereign Investment Platform</span>
              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-zinc-900 leading-[1.15]">
                Premium Lands & <br />
                <span className="font-serif italic font-light text-zinc-800">High-Growth Strategic Plots.</span>
              </h1>
              <p className="text-zinc-400 text-sm max-w-md font-light leading-relaxed">
                Empowering tier-1 private portfolios with predictive real estate land verification, structured ventures, and immediate digital hold orchestration.
              </p>
            </div>

            {/* Smart Core Search Integration */}
            <div className="w-full lg:w-auto space-y-3">
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-1.5 flex flex-col sm:flex-row gap-1 items-stretch sm:items-center min-w-[320px] lg:min-w-[560px]">
                <div className="relative flex-1 flex items-center px-3">
                  <Search className="text-zinc-400 shrink-0" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search street, strategic landmark, venture or AI criteria..." 
                    className="w-full bg-transparent pl-3 pr-2 py-3 outline-none text-sm text-zinc-800 font-light"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Sparkles size={14} className="text-indigo-400 animate-pulse ml-1" />
                </div>
                
                <div className="hidden sm:block w-px h-6 bg-zinc-200 self-center" />

                <div className="flex items-center gap-1.5 px-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${showFilters ? 'bg-zinc-900 border-zinc-950 text-white' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                  >
                    <Filter size={14} /> Filters
                  </button>
                  <button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Plus size={14} /> Post Land
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center text-xs text-zinc-400 px-1">
                <span className="flex items-center gap-1 text-[11px]"><Sparkles size={11} className="text-indigo-500" /> AI Prompts:</span>
                {['High ROI Gated Plots near Highway 65', 'Premium East-facing farmland'].map((sug) => (
                  <button key={sug} onClick={() => handleAiSearch(sug)} className="text-zinc-600 underline decoration-zinc-200 hover:decoration-indigo-500 transition-colors text-[11px]">

                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-10 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Max Cap Valuation: ₹{(filterBudget / 100000).toFixed(0)} Lakhs</label>
                    <input type="range" min={1000000} max={50000000} step={500000} value={filterBudget} onChange={(e) => setFilterBudget(Number(e.target.value))} className="w-full accent-indigo-600 h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Tract Facing</label>
                    <select value={filterFacing} onChange={(e) => setFilterFacing(e.target.value)} className="w-full bg-transparent border border-zinc-200 rounded-xl px-3 py-2 text-xs font-light outline-none">
                      <option value="All">All Directions</option>
                      <option value="East">East-Facing</option>
                      <option value="North">North-Facing</option>
                      <option value="Corner">Corner Variant</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500">Strategic Parameters</label>
                    <div className="flex border border-zinc-200 rounded-xl p-0.5 text-xs">
                      <button onClick={() => setSortOrder('new')} className={`flex-1 py-1.5 text-center rounded-lg ${sortOrder === 'new' ? 'bg-zinc-100 font-normal' : ''}`}>Recent</button>
                      <button onClick={() => setSortOrder('roi')} className={`flex-1 py-1.5 text-center rounded-lg ${sortOrder === 'roi' ? 'bg-zinc-100 font-normal' : ''}`}>Yield Tier</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} className="accent-indigo-600 rounded" /> Verified Core Only
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Soft Filter Tabs Hierarchy */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-100 pb-px">
            {['All', 'Plot', 'Gated Community', 'Farmland', 'Villa', 'Commercial'].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-3 text-xs tracking-wider transition-all relative whitespace-nowrap ${activeCategory === cat ? 'text-indigo-600 font-normal' : 'text-zinc-400 hover:text-zinc-900'}`}>
                {cat}s {activeCategory === cat && <motion.div layoutId="activeCatUnderline" className="absolute bottom-0 left-0 right-0 h-px bg-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAIN GRID OF PLOTS --- */}
      <main className="max-w-7xl mx-auto px-8 py-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedItems.map((item, idx) => (
              <AssetLuxuryCard 
                key={item._id} 
                item={item} 
                index={idx}
                isReserved={reservedPlots.includes(item._id)}
                isComparing={compareList.includes(item._id)}
                isFavorite={favorites.includes(item._id)}
                onToggleFavorite={() => toggleFavorite(item._id)}
                onToggleCompare={() => toggleCompare(item._id)}
                onSelect={() => handlePropertyClick(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- PREMIUM COMPREHENSIVE PROPERTY PROFILE MODAL (FULL DRAWER) --- */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[220] flex justify-end overflow-hidden">
            {/* Soft Ambient Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProperty(null)} 
              className="absolute inset-0 bg-zinc-950/20 backdrop-blur-md" 
            />

            {/* Dynamic Sliding Luxury Core Canvas */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-white shadow-2xl overflow-y-auto flex flex-col z-10 border-l border-zinc-100"
            >
              {/* Header Context Action Line */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-8 py-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-600 font-medium bg-indigo-50/60 px-2 py-0.5 rounded">Tract System Record</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-light">Available Near Your Core Selection Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleCompare(selectedProperty._id)}
                    className={`p-2 rounded-xl border text-xs transition-all ${compareList.includes(selectedProperty._id) ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-500'}`}
                  >
                    <BarChart3 size={14} />
                  </button>
                  <button onClick={() => setSelectedProperty(null)} className="size-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Comprehensive Luxury View Content */}
              <div className="p-8 space-y-10 flex-1">
                
                {/* 1. High Definition Dynamic Gallery Component */}
                <ImageCarouselSection images={selectedProperty.images} title={selectedProperty.title} />

                {/* 2. Primary Title Block & Core Economics */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>{selectedProperty.category} Assets</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {selectedProperty.location}, {selectedProperty.street}</span>
                    </div>
                    <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">{selectedProperty.title}</h2>
                  </div>
                  <div className="text-right md:text-right">
                    <span className="text-xs uppercase tracking-widest text-zinc-400 block font-light">Structured Valuation</span>
                    <span className="text-2xl font-light text-indigo-600 tracking-tight">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProperty.price)}
                    </span>
                  </div>
                </div>

                {/* 3. Comprehensive Metric Architectural Spec Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-50/60 border border-zinc-100 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Total Area (Acres)</span>
                    <span className="text-base text-zinc-800 font-light">{selectedProperty.acres} Acres</span>
                  </div>
                  <div className="bg-zinc-50/60 border border-zinc-100 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Square Yards / Feet</span>
                    <span className="text-base text-zinc-800 font-light">{selectedProperty.sqyd} / {selectedProperty.sqft}</span>
                  </div>
                  <div className="bg-zinc-50/60 border border-zinc-100 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Metric Bounds</span>
                    <span className="text-base text-zinc-800 font-light">{selectedProperty.lengthMeters}m x {selectedProperty.widthMeters}m</span>
                  </div>
                  <div className="bg-zinc-50/60 border border-zinc-100 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Road Infrastructure</span>
                    <span className="text-base text-zinc-800 font-light">{selectedProperty.roadWidthFt} ft Width</span>
                  </div>
                </div>

                {/* 4. Strategic Investment Analytics Dashboard Layer */}
                <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-light">
                      <TrendingUp size={14} className="text-indigo-600" /> Platform Score Index
                    </div>
                    <p className="text-2xl font-extralight text-zinc-900">{selectedProperty.investmentScore} <span className="text-xs text-indigo-600 font-normal">Highly Secured</span></p>
                    <p className="text-[11px] text-zinc-400">Exceeds municipal baseline checks for seamless liquidation.</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-light">
                      <Landmark size={14} className="text-amber-600" /> Regulation Standing
                    </div>
                    <p className="text-sm text-zinc-800 font-normal pt-1 flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-500" /> HNTDA Approved Venture
                    </p>
                    <p className="text-[11px] text-zinc-400">Clear titles completely cataloged with direct clear ancestry logs.</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-light">
                      <Zap size={14} className="text-indigo-600" /> Immediate Infrastructure
                    </div>
                    <div className="flex gap-4 pt-1 text-xs text-zinc-700">
                      <span className="flex items-center gap-1"><Droplet size={12} className="text-blue-500"/> Phase-1 Water</span>
                      <span className="flex items-center gap-1"><Zap size={12} className="text-amber-500"/> Substation Grid</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Ready to break ground with residential/commercial layouts instantly.</p>
                  </div>
                </div>

                {/* 5. Split Grid: Highlights & Strategic Analytics Engine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-normal uppercase tracking-widest text-zinc-400">Premium Tract Signature Amenities</h4>
                    <ul className="space-y-2.5">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <li key={`${amenity}-${idx}`} className="flex items-center gap-2 text-xs text-zinc-600 font-light">

                          <div className="size-1.5 rounded-full bg-indigo-500" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 bg-zinc-50/50 p-5 border border-zinc-100 rounded-xl">
                    <h4 className="text-xs font-normal uppercase tracking-widest text-zinc-400">Future Growth & Area Value Modeling</h4>
                    <div className="space-y-3 text-xs font-light text-zinc-600">
                      <div className="flex justify-between items-center">
                        <span>Expected 3-Year Compounding</span>
                        <span className="text-emerald-600 font-medium">+45.2% Predictive Spike</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Demand Velocity Metric</span>
                        <span className="text-zinc-800 font-normal">9.4 / 10 Volumetric Index</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-200/60 pt-2">
                        Micro-market analytics map strong multi-sector growth patterns driven by upcoming transport junctions and commercial tech sprawl zones.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Surrounding Institutional Matrix (Schools, Hospitals, IT Parks) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-normal uppercase tracking-widest text-zinc-400">Strategic External Infrastructure Connectivity</h4>
                  <div className="border border-zinc-100 rounded-xl divide-y divide-zinc-100 text-xs font-light text-zinc-700">
                    <div className="p-3.5 flex justify-between items-start gap-4">
                      <span className="text-zinc-400 min-w-[100px]">Education Nodes</span>
                      <span className="text-right text-zinc-800">{selectedProperty.infrastructure.schools}</span>
                    </div>
                    <div className="p-3.5 flex justify-between items-start gap-4">
                      <span className="text-zinc-400 min-w-[100px]">Medical Core</span>
                      <span className="text-right text-zinc-800">{selectedProperty.infrastructure.hospitals}</span>
                    </div>
                    <div className="p-3.5 flex justify-between items-start gap-4">
                      <span className="text-zinc-400 min-w-[100px]">IT & High-Value Parks</span>
                      <span className="text-right text-zinc-800">{selectedProperty.infrastructure.itParks}</span>
                    </div>
                    <div className="p-3.5 flex justify-between items-start gap-4">
                      <span className="text-zinc-400 min-w-[100px]">Transit Hubs</span>
                      <span className="text-right text-zinc-800">{selectedProperty.infrastructure.transit}</span>
                    </div>
                  </div>
                </div>

                {/* 7. Virtual Mapping Preview Layer Placeholder */}
                <div className="space-y-3">
                  <h4 className="text-xs font-normal uppercase tracking-widest text-zinc-400">Integrated GPS Cadastral Map View</h4>
                  <div className="h-44 w-full bg-zinc-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-zinc-200">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    <div className="z-10 text-center space-y-1 px-4">
                      <span className="text-xs font-light text-zinc-500 flex items-center justify-center gap-1"><Compass className="animate-spin text-indigo-500" size={13} /> Live Geospatial Blueprint Latency Lock</span>
                      <p className="text-[11px] text-zinc-400">Direct integration mapping showing exact coordinates: {selectedProperty.location} Section.</p>
                    </div>
                  </div>
                </div>

                {/* 8. AI Tailored Variants Carousel */}
                {similarPlots.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-normal uppercase tracking-widest text-zinc-400">AI Predictive Recommendations: Similar High-Yield Alternatives</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {similarPlots.map(plot => (
                        <div 
                          key={plot._id} 
                          onClick={() => handlePropertyClick(plot)}
                          className="p-4 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-100 rounded-xl transition-all cursor-pointer flex gap-3 items-center"
                        >
                          <img src={plot.images[0]} className="size-14 rounded-lg object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-normal text-zinc-800 truncate">{plot.title}</h5>
                            <p className="text-[11px] text-zinc-400">{plot.location} • {plot.roi}</p>
                          </div>
                          <ChevronRight size={14} className="text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Secure Direct Orchestration Footer Dock */}
              <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-6 px-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 z-20">
                <div className="flex gap-3">
                  <a href={`https://wa.me/919000000000?text=Inquiry regarding ${encodeURIComponent(selectedProperty.title)}`} target="_blank" rel="noreferrer" className="border border-zinc-200 hover:border-zinc-300 text-zinc-700 size-11 rounded-xl flex items-center justify-center transition-colors">
                    <MessageSquare size={16} />
                  </a>
                  <a href="tel:+919000000000" className="border border-zinc-200 hover:border-zinc-300 text-zinc-700 size-11 rounded-xl flex items-center justify-center transition-colors">
                    <Phone size={16} />
                  </a>
                </div>

                <div className="flex gap-3 flex-1 sm:flex-none justify-end">
                  <button 
                    disabled={reservedPlots.includes(selectedProperty._id)}
                    onClick={() => setBookingStep('payment')}
                    className="px-5 py-3 border border-indigo-200 text-indigo-700 hover:bg-indigo-50/50 rounded-xl text-xs font-medium tracking-wide transition-colors disabled:opacity-40"
                  >
                    {reservedPlots.includes(selectedProperty._id) ? 'Tract Held' : 'Reserve Plot Spot'}
                  </button>
                  <button 
                    disabled={reservedPlots.includes(selectedProperty._id)}
                    onClick={() => setBookingStep('schedule')}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium tracking-wide transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    Schedule Concierge Visit <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD PORTFOLIO TRACT DRAWER --- */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 180 }} className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl p-10 overflow-y-auto shadow-2xl border-l border-zinc-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-10">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium flex items-center gap-2"><Sparkles size={12} className="text-indigo-500" /> Digital Asset Vault</span>
                  <button onClick={() => setIsAddOpen(false)} className="size-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800"><X size={14}/></button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-extralight text-zinc-900 tracking-tight">Onboard Strategic Real-Estate</h2>
                    <p className="text-xs text-zinc-400">Your plot undergoes architectural verification prior to indexing.</p>
                  </div>
                  <div className="space-y-4 pt-4">
                    <Input label="Venture / Sovereign Estate Title" placeholder="e.g. Sovereign Golden Crest Plot 40" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Premium Valuation (₹)" placeholder="e.g. 75,00,000" />
                      <Input label="Tract Dimensions (W x L)" placeholder="e.g. 40 x 60 ft" />
                    </div>
                    <div className="p-8 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 flex flex-col items-center gap-2 hover:border-indigo-400 transition-all cursor-pointer group">
                      <Camera className="text-zinc-300 group-hover:text-indigo-400 transition-colors" size={24} />
                      <span className="text-xs font-light text-zinc-400">Upload Ultra-HD Site Blueprints</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8 mt-8 border-t border-zinc-100">
                <button onClick={() => setIsAddOpen(false)} className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-colors tracking-wider">
                  Deploy Asset for Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PRIVATE ADVANCE BOOKING MODAL INNER ARCHITECTURE --- */}
      <AnimatePresence>
        {bookingStep && selectedProperty && (bookingStep === 'payment' || bookingStep === 'confirmed') && (
          <div className="fixed inset-0 z-[230] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setBookingStep('schedule')} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl border border-zinc-100 overflow-hidden z-10">
              
              {bookingStep === 'payment' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-600 font-medium">Priority Token Assignment</span>
                      <h3 className="text-xl font-extralight text-zinc-900 tracking-tight mt-1">Reserve Secure Escrow Allocation</h3>
                    </div>
                    <button onClick={() => setBookingStep('schedule')} className="p-1 text-zinc-400 hover:text-zinc-900"><X size={16}/></button>
                  </div>
                  
                  <div className="bg-zinc-50 p-4 rounded-xl space-y-2 border border-zinc-100">
                    <div className="flex justify-between text-xs font-light text-zinc-500">
                      <span>Priority Allotment Hold Fee</span>
                      <span className="text-zinc-800 font-normal">₹25,000</span>
                    </div>
                    <div className="flex justify-between text-xs font-light text-zinc-400">
                      <span>Escrow Security Cover</span>
                      <span>100% Fully Refundable</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setReservedPlots(prev => [...prev, selectedProperty._id]);
                      setBookingStep('confirmed');
                    }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium tracking-wider transition-colors shadow-lg shadow-indigo-100"
                  >
                    Authorize Escrow Allocation & Hold Tract
                  </button>
                </div>
              )}

              {bookingStep === 'confirmed' && (
                <div className="text-center py-6 space-y-4">
                  <div className="size-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-light text-zinc-900">Allocation Token Primed</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto font-light">Your private land slot hold sequence has been initialized securely.</p>
                  </div>
                  <button onClick={() => { setBookingStep('schedule'); setSelectedProperty(null); }} className="mt-4 px-6 py-2 border border-zinc-200 text-zinc-700 text-xs rounded-xl hover:bg-zinc-50 transition-colors">
                    Close Secure Window
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- SUB CONTENT LOGIC COMPONENTS ---

function ImageCarouselSection({ images, title }: { images: string[], title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[2.1/1] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
        <img src={images[activeIdx]} className="w-full h-full object-cover transition-all duration-500" alt={title} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-4 flex justify-between items-end">
          <span className="text-[10px] text-white/90 font-light tracking-wider uppercase bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded">Asset Perspective {activeIdx + 1} of {images.length}</span>
        </div>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button 
            key={`${img || 'img'}-${i}`} 
            onClick={() => setActiveIdx(i)}
            className={`relative size-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeIdx === i ? 'border-indigo-600' : 'border-transparent opacity-60'}`}
          >
            <img src={img} className="w-full h-full object-cover" alt="" />
          </button>
        ))}
      </div>
    </div>
  )
}

function AssetLuxuryCard({ 
  item, 
  index, 
  isReserved, 
  isComparing, 
  isFavorite,
  onToggleFavorite,
  onToggleCompare, 
  onSelect 
}: { 
  item: Listing
  index: number
  isReserved: boolean
  isComparing: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onToggleCompare: () => void
  onSelect: () => void
}) {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.5 }}
      className="group relative cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative bg-white rounded-3xl border border-zinc-200/60 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.01)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-zinc-300 flex flex-col h-full">
        
        <div className="relative aspect-[1.35/1] overflow-hidden bg-zinc-50">
          <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out" alt={item.title} />
          
          <div className="absolute inset-x-4 top-4 flex justify-between items-center pointer-events-none">
            <div className="bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/40 flex items-center gap-1.5 shadow-sm pointer-events-auto">
              <Navigation size={10} className="text-indigo-600 fill-indigo-600" />
              <span className="text-[10px] text-zinc-800 font-normal">{item.distance}</span>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className={`size-8 rounded-full flex items-center justify-center transition-all border pointer-events-auto ${isFavorite ? 'bg-white border-red-100 text-red-500 shadow-sm' : 'bg-white/70 backdrop-blur-md border-white/40 text-zinc-700 hover:bg-white'}`}
            >
              <Heart size={13} className={isFavorite ? 'fill-red-500' : ''} />
            </button>
          </div>

          {isReserved && (
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl border border-white text-xs tracking-widest text-zinc-900 font-medium uppercase">Acquisition Locked</span>
            </div>
          )}

          <div className="absolute bottom-3 left-4 bg-zinc-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-zinc-800 text-[10px] font-light text-zinc-300 flex items-center gap-2">
            <span className="text-emerald-400 font-normal">{item.roi}</span>
            <div className="w-px h-2.5 bg-zinc-700" />
            <span>{item.appreciation}% Yield</span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-light">
              <span className="flex items-center gap-1"><MapPin size={11} className="text-indigo-500" /> {item.location}, {item.street}</span>
              {item.verified && <span className="text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded-md text-[10px]">HNTDA Regulated</span>}
            </div>
            <h3 className="text-lg font-light text-zinc-900 tracking-tight leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-100 text-xs font-light text-zinc-500">
            <div>
              <span className="block text-[10px] text-zinc-300 uppercase tracking-wider mb-0.5">Area Matrix</span>
              <span className="text-zinc-800 font-normal">{item.sqyd} <span className="text-zinc-400 text-[11px] font-light">sq.yd</span></span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-300 uppercase tracking-wider mb-0.5">Dimensions</span>
              <span className="text-zinc-700 text-[11px]">{item.dimensions}</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-300 uppercase tracking-wider mb-0.5">Orientation</span>
              <span className="text-zinc-800 font-normal">{item.facing}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Acquisition Rate</span>
              <span className="text-lg font-light text-zinc-900 tracking-tight">{formatINR(item.price)}</span>
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
                className={`p-2.5 rounded-xl border transition-all ${isComparing ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'border-zinc-200 text-zinc-400'}`}
              >
                <BarChart3 size={13} />
              </button>
              <span className="bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide inline-flex items-center">Explore Tract</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

function Input({ label, placeholder }: { label: string, placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        className="w-full bg-zinc-50 border border-zinc-100 px-4 py-3.5 rounded-xl outline-none text-xs font-light text-zinc-800 focus:bg-white transition-all"
        placeholder={placeholder}
      />
    </div>
  )
}