import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Search, Navigation, Home, HardHat, Store, Crosshair } from 'lucide-react';

// --- Custom HTML Markers ---
const createCustomIcon = (type: 'rental' | 'worker' | 'business') => {
  const bgClass = type === 'rental' ? 'bg-indigo-600' : type === 'worker' ? 'bg-emerald-500' : 'bg-amber-500';
  const shadowClass = type === 'rental' ? 'shadow-indigo-500/50' : type === 'worker' ? 'shadow-emerald-500/50' : 'shadow-amber-500/50';
  
  // We use simple CSS since we can't mount React components directly to Leaflet icons easily here
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" class="${bgClass} ${shadowClass}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

const icons = {
  rental: createCustomIcon('rental'),
  worker: createCustomIcon('worker'),
  business: createCustomIcon('business'),
  user: L.divIcon({
    className: 'user-location-icon',
    html: `<div style="width: 24px; height: 24px; border-radius: 50%; background-color: #06b6d4; border: 3px solid white; box-shadow: 0 0 20px rgba(6,182,212,0.8); display: flex; align-items: center; justify-content: center;">
             <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
};

// --- Map View Recenter ---
function ChangeView({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

// --- Mock Data Generator based on Location ---
type Place = { id: string, lat: number, lng: number, type: 'rental'|'worker'|'business', title: string, desc: string, price: string };

function generateMockData(centerLat: number, centerLng: number): Place[] {
  return Array.from({ length: 30 }).map((_, i) => {
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    const types = ['rental', 'worker', 'business'] as const;
    const type = types[i % 3];
    
    let title = '';
    let desc = '';
    let price = '';
    
    if (type === 'rental') {
      title = `Premium Property ${i}`;
      desc = 'Fully furnished space available for immediate move-in.';
      price = '₹' + (10000 + Math.floor(Math.random() * 40000)).toLocaleString() + '/mo';
    } else if (type === 'worker') {
      title = `Verified Professional ${i}`;
      desc = 'Expert technician & repairman. Highly rated.';
      price = (4 + Math.random()).toFixed(1) + ' ⭐';
    } else {
      title = `Community Store ${i}`;
      desc = 'Daily essentials and trending local offers.';
      price = 'Active Offers';
    }

    return {
      id: i.toString(),
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
      type,
      title,
      desc,
      price
    };
  });
}

// Distance calculation
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d.toFixed(1);
}

export function MapPage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<'all'|'rental'|'worker'|'business'>('all');
  const [loadingLoc, setLoadingLoc] = useState(true);

  // Use a fallback location (e.g., Central London or Hyderabad)
  const defaultLocation: [number, number] = [17.4399, 78.4983];

  useEffect(() => {
    // 1. Detect Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setPlaces(generateMockData(loc[0], loc[1]));
          setLoadingLoc(false);
        },
        (error) => {
          console.error("Location error:", error);
          // Fallback
          setUserLocation(defaultLocation);
          setPlaces(generateMockData(defaultLocation[0], defaultLocation[1]));
          setLoadingLoc(false);
        }
      );
    } else {
      setUserLocation(defaultLocation);
      setPlaces(generateMockData(defaultLocation[0], defaultLocation[1]));
      setLoadingLoc(false);
    }
  }, []);

  const filteredPlaces = places.filter(p => filter === 'all' || p.type === filter);

  const requestLocationAgain = () => {
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(loc);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    setTimeout(() => setLoadingLoc(false), 1000);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-900 font-sans">
      
      {/* FLOATING HEADER (GLASS) */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          
          <div className="flex items-center gap-4 pointer-events-auto">
            <button onClick={() => navigate(-1)} className="grid size-12 place-items-center rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/20 hover:scale-105 transition-transform">
              <ChevronLeft className="text-zinc-800" />
            </button>
            
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl shadow-lg border border-white/20 rounded-2xl px-5 py-3 w-[250px] md:w-[350px]">
              <Search size={20} className="text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search nearby places..." 
                className="bg-transparent border-none outline-none w-full text-zinc-900 placeholder-zinc-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 pointer-events-auto max-w-full">
            <button onClick={() => setFilter('all')} className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all border ${filter === 'all' ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white/80 text-zinc-600 border-white/20 hover:bg-white'}`}>All</button>
            <button onClick={() => setFilter('rental')} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all border ${filter === 'rental' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/80 text-zinc-600 border-white/20 hover:bg-white'}`}><Home size={16}/> Rentals</button>
            <button onClick={() => setFilter('worker')} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all border ${filter === 'worker' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/80 text-zinc-600 border-white/20 hover:bg-white'}`}><HardHat size={16}/> Workers</button>
            <button onClick={() => setFilter('business')} className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all border ${filter === 'business' ? 'bg-amber-500 text-white border-amber-400' : 'bg-white/80 text-zinc-600 border-white/20 hover:bg-white'}`}><Store size={16}/> Shops</button>
          </div>

        </div>
      </div>

      {/* FLOATING BOTTOM CONTROLS */}
      <div className="absolute bottom-8 right-8 z-50 pointer-events-auto flex flex-col gap-4">
        <button 
          onClick={requestLocationAgain}
          className="grid size-14 place-items-center rounded-2xl bg-cyan-500 text-white shadow-xl hover:bg-cyan-400 transition-colors border border-cyan-400 group relative"
        >
          <Crosshair size={24} className={loadingLoc ? 'animate-spin' : ''} />
          <span className="absolute right-full mr-4 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Find My Location</span>
        </button>
      </div>

      {/* MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={userLocation || defaultLocation} 
          zoom={14} 
          zoomControl={false}
          className="w-full h-full"
          style={{ background: '#f4f4f5' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <ChangeView center={userLocation} />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={icons.user}>
              <Popup className="custom-popup">
                <div className="p-1 font-sans">
                  <div className="font-bold text-cyan-600 flex items-center gap-1 mb-1"><MapPin size={14}/> You are here</div>
                  <div className="text-xs text-zinc-500 font-medium">Your current detected location.</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Places Markers */}
          {filteredPlaces.map(place => (
            <Marker key={place.id} position={[place.lat, place.lng]} icon={icons[place.type]}>
              <Popup closeButton={false} className="custom-popup-clean">
                <div className="w-[260px] rounded-2xl bg-white shadow-2xl border border-zinc-100 overflow-hidden font-sans flex flex-col">
                  {/* Header */}
                  <div className={`p-4 text-white ${place.type === 'rental' ? 'bg-indigo-600' : place.type === 'worker' ? 'bg-emerald-600' : 'bg-amber-500'}`}>
                    <div className="flex items-center gap-2 mb-1 opacity-90 text-xs font-bold uppercase tracking-widest">
                      {place.type === 'rental' && <><Home size={12}/> Rental</>}
                      {place.type === 'worker' && <><HardHat size={12}/> Verified Worker</>}
                      {place.type === 'business' && <><Store size={12}/> Local Business</>}
                    </div>
                    <h3 className="text-lg font-black leading-tight drop-shadow-sm">{place.title}</h3>
                  </div>
                  
                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3">
                    <p className="text-sm text-zinc-500 font-medium leading-snug">{place.desc}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-1">
                      <span className="font-black text-lg text-zinc-900">{place.price}</span>
                      {userLocation && (
                        <span className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <MapPin size={10} /> {getDistanceFromLatLonInKm(userLocation[0], userLocation[1], place.lat, place.lng)} km
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-zinc-900 text-white p-3 font-bold text-sm hover:bg-zinc-800 transition-colors"
                  >
                    <Navigation size={16} /> Open Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        /* Overriding Leaflet default popup styles to look modern */
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 1rem !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: normal !important;
        }
        .leaflet-popup-tip-container {
          display: none !important; /* Hide default arrow */
        }
        .custom-popup-clean {
          margin-bottom: 20px !important;
        }
      `}</style>

    </div>
  );
}
