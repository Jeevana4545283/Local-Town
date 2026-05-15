type LatLng = { lat: number; lng: number }

function uid(prefix: string, n: number) {
  return `${prefix}_${n}`
}

// const unsplash = (q: string, sig: number) =>
//   `https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sig=${sig}&${q}`

export type DemoRental = {
  _id: string
  title: string
  kind: 'house' | 'room'
  address: string
  location: LatLng
  rentPerMonth: number
  deposit: number
  rating: number
  reviewsCount: number
  availableFrom: string
  isAvailable: boolean
  owner: { name: string; phone: string; avatarUrl: string }
  images: string[]
  badges: string[]
}

export type DemoWorker = {
  _id: string
  category: string
  headline: string
  serviceArea: string
  experienceYears: number
  rating: number
  completedJobs: number
  priceNote: string
  isVerified: boolean
  isOnline: boolean
  avatarUrl: string
  name: string
  phone: string
  badges: string[]
}

export type DemoOffer = {
  _id: string
  shopName: string
  title: string
  description: string
  bannerUrl: string
  discountLabel: string
  expiresAt: string
  trending: boolean
  tags: string[]
}

export type DemoEvent = {
  _id: string
  title: string
  startsAt: string
  venue: string
  description: string
  bannerUrl: string
  category: 'festival' | 'wedding' | 'workshop' | 'community'
}

export type DemoNotification = {
  _id: string
  type: 'power-cut' | 'emergency' | 'news' | 'offer'
  title: string
  message: string
  createdAt: string
  read: boolean
}

export type DemoTestimonial = {
  _id: string
  name: string
  role: string
  avatarUrl: string
  rating: number
  text: string
}

export type DemoMapPin = {
  _id: string
  title: string
  kind: 'rental' | 'worker' | 'offer' | 'emergency'
  location: LatLng
  distanceKm: number
  badge: string
}

export const demoRentals: DemoRental[] = [
  {
    _id: uid('rental', 1),
    title: 'Sunlit 2BHK near Central Park',
    kind: 'house',
    address: 'Green Avenue, Block B',
    location: { lat: 12.9718, lng: 77.5946 },
    rentPerMonth: 18500,
    deposit: 50000,
    rating: 4.8,
    reviewsCount: 124,
    availableFrom: new Date(Date.now() + 3 * 86400000).toISOString(),
    isAvailable: true,
    owner: {
      name: 'Rohit Mehra',
      phone: '+91 98765 12345',
      avatarUrl: 'https://i.pravatar.cc/120?img=12',
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582582429416-07f4bbfc7f88?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Top rated', 'Near metro'],
  },
  {
    _id: uid('rental', 2),
    title: 'Budget single room • walk to bus stand',
    kind: 'room',
    address: 'Market Road, Near Bus Stand',
    location: { lat: 12.9752, lng: 77.6001 },
    rentPerMonth: 6500,
    deposit: 12000,
    rating: 4.4,
    reviewsCount: 61,
    availableFrom: new Date(Date.now() + 1 * 86400000).toISOString(),
    isAvailable: true,
    owner: {
      name: 'Shalini Rao',
      phone: '+91 99887 22110',
      avatarUrl: 'https://i.pravatar.cc/120?img=32',
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Fast move-in'],
  },
  {
    _id: uid('rental', 3),
    title: 'Premium 3BHK • skyline view • gated',
    kind: 'house',
    address: 'Skyline Residency, Tower 3',
    location: { lat: 12.9659, lng: 77.5857 },
    rentPerMonth: 32000,
    deposit: 90000,
    rating: 4.9,
    reviewsCount: 203,
    availableFrom: new Date(Date.now() + 10 * 86400000).toISOString(),
    isAvailable: false,
    owner: {
      name: 'Ayesha Khan',
      phone: '+91 90000 77881',
      avatarUrl: 'https://i.pravatar.cc/120?img=5',
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Premium', 'Gated'],
  },
  {
    _id: uid('rental', 4),
    title: 'Co-living room • wifi • meals nearby',
    kind: 'room',
    address: 'Tech Street, Phase 2',
    location: { lat: 12.9691, lng: 77.6123 },
    rentPerMonth: 9200,
    deposit: 15000,
    rating: 4.6,
    reviewsCount: 88,
    availableFrom: new Date(Date.now() + 5 * 86400000).toISOString(),
    isAvailable: true,
    owner: {
      name: 'Manoj Patil',
      phone: '+91 98111 01121',
      avatarUrl: 'https://i.pravatar.cc/120?img=18',
    },
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    ],
    badges: ['Wi‑Fi', 'Co-living'],
  },
]

export const demoWorkers: DemoWorker[] = [
  {
    _id: uid('worker', 1),
    category: 'electrician',
    headline: 'Wiring, MCB, inverter, smart lights',
    serviceArea: 'Green Avenue + 5km',
    experienceYears: 8,
    rating: 4.9,
    completedJobs: 612,
    priceNote: 'Starts ₹249 • Visit in 30 mins',
    isVerified: true,
    isOnline: true,
    avatarUrl: 'https://i.pravatar.cc/160?img=45',
    name: 'Karthik S.',
    phone: '+91 90012 34567',
    badges: ['Top Pro', 'Fast'],
  },
  {
    _id: uid('worker', 2),
    category: 'plumber',
    headline: 'Leak fix, bathroom fitting, motor issues',
    serviceArea: 'Market Road',
    experienceYears: 11,
    rating: 4.8,
    completedJobs: 840,
    priceNote: 'Starts ₹199 • Same day',
    isVerified: true,
    isOnline: false,
    avatarUrl: 'https://i.pravatar.cc/160?img=21',
    name: 'Ramesh N.',
    phone: '+91 98888 10002',
    badges: ['Verified', 'Warranty'],
  },
  {
    _id: uid('worker', 3),
    category: 'painter',
    headline: 'Texture paint, putty, waterproofing',
    serviceArea: 'Skyline Residency',
    experienceYears: 6,
    rating: 4.7,
    completedJobs: 233,
    priceNote: '₹14/sqft • Premium finish',
    isVerified: false,
    isOnline: true,
    avatarUrl: 'https://i.pravatar.cc/160?img=8',
    name: 'Neha P.',
    phone: '+91 91234 56780',
    badges: ['Trending'],
  },
  {
    _id: uid('worker', 4),
    category: 'carpenter',
    headline: 'Modular repair, doors, custom shelves',
    serviceArea: 'Tech Street',
    experienceYears: 9,
    rating: 4.8,
    completedJobs: 418,
    priceNote: 'Starts ₹299 • Quote in app',
    isVerified: true,
    isOnline: true,
    avatarUrl: 'https://i.pravatar.cc/160?img=60',
    name: 'Vijay R.',
    phone: '+91 99110 40008',
    badges: ['Top rated'],
  },
  {
    _id: uid('worker', 5),
    category: 'mechanic',
    headline: 'Bike/car service • pickup & drop',
    serviceArea: 'Town Center',
    experienceYears: 12,
    rating: 4.6,
    completedJobs: 1205,
    priceNote: 'Service ₹499 • Emergency towing',
    isVerified: true,
    isOnline: false,
    avatarUrl: 'https://i.pravatar.cc/160?img=14',
    name: 'Sameer A.',
    phone: '+91 98989 20112',
    badges: ['24/7'],
  },
  {
    _id: uid('worker', 6),
    category: 'cleaning',
    headline: 'Deep cleaning • kitchen/bathroom',
    serviceArea: 'All zones',
    experienceYears: 5,
    rating: 4.9,
    completedJobs: 980,
    priceNote: '2BHK ₹999 • Today slots',
    isVerified: true,
    isOnline: true,
    avatarUrl: 'https://i.pravatar.cc/160?img=28',
    name: 'Asha M.',
    phone: '+91 90090 10101',
    badges: ['Popular', 'Fast'],
  },
]

export const demoOffers: DemoOffer[] = [
  {
    _id: uid('offer', 1),
    shopName: 'FreshMart Supermarket',
    title: 'Festival Mega Sale on Groceries',
    description: 'Up to 35% off on oils, rice, and essentials. Free home delivery above ₹799.',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    discountLabel: 'Up to 35% OFF',
    expiresAt: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
    trending: true,
    tags: ['Festival', 'Delivery', 'Trending'],
  },
  {
    _id: uid('offer', 2),
    shopName: 'Town Electronics',
    title: 'Smart Home Week: switches & lights',
    description: 'Save 20% on smart switches, bulbs and installation packages.',
    bannerUrl: 'https://images.unsplash.com/photo-1518444021438-4c8b1edfe9a6?auto=format&fit=crop&w=1200&q=80',
    discountLabel: 'Flat 20% OFF',
    expiresAt: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    trending: false,
    tags: ['Smart Home', 'Limited'],
  },
  {
    _id: uid('offer', 3),
    shopName: 'Swad Corner',
    title: 'Weekend Combo: snacks + beverages',
    description: 'Buy 2 get 1 free on select snacks. Perfect for movie night.',
    bannerUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
    discountLabel: 'Buy2Get1',
    expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    trending: true,
    tags: ['Weekend', 'Combo', 'Hot'],
  },
]

export const demoEvents: DemoEvent[] = [
  {
    _id: uid('event', 1),
    title: 'Community Wedding Expo',
    startsAt: new Date(Date.now() + 2 * 86400000 + 3 * 3600000).toISOString(),
    venue: 'Town Hall • Main Auditorium',
    description: 'Meet local vendors: décor, catering, photography, and venue offers.',
    bannerUrl: 'https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=80',
    category: 'wedding',
  },
  {
    _id: uid('event', 2),
    title: 'Monsoon Festival & Food Street',
    startsAt: new Date(Date.now() + 5 * 86400000 + 6 * 3600000).toISOString(),
    venue: 'Central Park',
    description: 'Live music, food stalls, and local brands. Family-friendly event.',
    bannerUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    category: 'festival',
  },
  {
    _id: uid('event', 3),
    title: 'Weekend Workshop: DIY Home Repairs',
    startsAt: new Date(Date.now() + 1 * 86400000 + 2 * 3600000).toISOString(),
    venue: 'Library • Workshop Room',
    description: 'Learn basic plumbing/electrical safety tips with a certified trainer.',
    bannerUrl: 'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?auto=format&fit=crop&w=1200&q=80',
    category: 'workshop',
  },
]

export const demoTestimonials: DemoTestimonial[] = [
  {
    _id: uid('t', 1),
    name: 'Meera Iyer',
    role: 'Renter',
    avatarUrl: 'https://i.pravatar.cc/160?img=47',
    rating: 5,
    text: 'Found a room in one evening. The AI suggestions were scarily accurate — loved the experience.',
  },
  {
    _id: uid('t', 2),
    name: 'Arjun Verma',
    role: 'Shop owner',
    avatarUrl: 'https://i.pravatar.cc/160?img=23',
    rating: 5,
    text: 'Publishing offers instantly boosted footfall. Notifications feel like a premium app.',
  },
  {
    _id: uid('t', 3),
    name: 'Sana K.',
    role: 'Resident',
    avatarUrl: 'https://i.pravatar.cc/160?img=9',
    rating: 4,
    text: 'Emergency system is extremely helpful. The interface is clean and fast on mobile.',
  },
]

export const demoNotifications: DemoNotification[] = [
  {
    _id: uid('n', 1),
    type: 'power-cut',
    title: 'Power cut alert',
    message: 'Green Avenue: outage expected 6:30PM–7:15PM for maintenance.',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    read: false,
  },
  {
    _id: uid('n', 2),
    type: 'news',
    title: 'Local news',
    message: 'New speed-breakers installed near Central Park junction.',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
  },
  {
    _id: uid('n', 3),
    type: 'offer',
    title: 'Offer notification',
    message: 'FreshMart: Festival Mega Sale (Up to 35% OFF) — ends tonight.',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    read: false,
  },
  {
    _id: uid('n', 4),
    type: 'emergency',
    title: 'Emergency alert',
    message: 'Ambulance request raised near Market Road. Admin team notified.',
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
    read: true,
  },
]

export const demoMapPins: DemoMapPin[] = [
  {
    _id: uid('pin', 1),
    title: '2BHK • Green Avenue',
    kind: 'rental',
    location: { lat: 12.971, lng: 77.594 },
    distanceKm: 1.2,
    badge: 'New',
  },
  {
    _id: uid('pin', 2),
    title: 'Electrician • 4.9',
    kind: 'worker',
    location: { lat: 12.972, lng: 77.601 },
    distanceKm: 2.4,
    badge: 'Online',
  },
  {
    _id: uid('pin', 3),
    title: 'FreshMart • 35% OFF',
    kind: 'offer',
    location: { lat: 12.968, lng: 77.588 },
    distanceKm: 1.8,
    badge: 'Trending',
  },
  {
    _id: uid('pin', 4),
    title: 'Emergency help',
    kind: 'emergency',
    location: { lat: 12.975, lng: 77.606 },
    distanceKm: 3.0,
    badge: '24/7',
  },
]

export const demoAnalytics = {
  activeUsers: 12482,
  bookingsToday: 86,
  ordersToday: 41,
  earningsMonth: 642900,
  growthWeeklyPct: 18.2,
  growthMonthlyPct: 41.7,
  liveActivities: [
    'Offer pushed: FreshMart Festival Mega Sale',
    'Worker verified: Electrician (Karthik S.)',
    'New rental listed: Budget single room near bus stand',
    'Emergency request resolved: Police assistance',
    'Material order paid via QR: ₹2,499',
  ],
}

