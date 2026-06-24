import { useState, useEffect, useRef } from 'react'
import { Card } from '../components/ui/Card'
import { Plus, MapPin, Edit, Trash2, Home, Crosshair, Camera, Image as ImageIcon, Sun, Moon, Loader2, CheckCircle, X } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

const MOCK_OWNER_ID = 'e2b347bb-a988-46cb-8495-2c833543d3b6' // Will be removed when auth is fully plugged into fetch.

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return position === null ? null : <Marker position={position} />
}

export function OwnerMarketplacePage() {
  const [marketplace, setMarketplaceItems] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [nearbyAreas, setNearbyAreas] = useState('')
  const [itemPrice, setMarketplaceItemPrice] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [status, setStatus] = useState('Available')
  
  // UI States
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])
  
  // Map State
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    fetchMarketplaceItems()
  }, [])

  const fetchMarketplaceItems = async () => {
    try {
      const token = localStorage.getItem('lt_token') || ''
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/marketplace/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setMarketplaceItems(data.items || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAutoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrls(prev => [...prev, reader.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx))
  }

  const handleAddMarketplaceItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!position) return alert('Please pick a location on the map')
    if (imageUrls.length === 0) return alert('Please add at least one image')

    setIsPublishing(true)

    const payload = {
      title,
      address,
      pincode: parseInt(pincode),
      nearbyAreas: nearbyAreas.split(',').map(s => s.trim()),
      itemPrice: parseFloat(itemPrice),
      phoneNumber,
      description,
      imageUrls,
      latitude: position[0],
      longitude: position[1],
      status
    }

    try {
      const token = localStorage.getItem('lt_token') || ''
      const url = editingId 
        ? `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/marketplace/${editingId}` 
        : `${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/marketplace`
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setPublishSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setEditingId(null)
          setPublishSuccess(false)
          setIsPublishing(false)
          setShowToast(true)
          setTimeout(() => setShowToast(false), 4000)
          fetchMarketplaceItems() // Refresh list
          
          // Reset form
          setTitle('')
          setAddress('')
          setPincode('')
          setNearbyAreas('')
          setMarketplaceItemPrice('')
          setPhoneNumber('')
          setDescription('')
          setImageUrls([])
          setPosition(null)
        }, 1500)
      } else {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 401) {
          alert('Your session has expired or is invalid. Please log out and log back in.')
          localStorage.removeItem('lt_token')
          localStorage.removeItem('lt_user')
          window.location.href = '/login'
        } else if (res.status === 400 && errorData.errors) {
          alert(`Validation Error: ${JSON.stringify(errorData.errors)}`)
        } else {
          alert(`Failed to ${editingId ? 'update' : 'add'} marketplace item`)
        }
        setIsPublishing(false)
      }
    } catch (err) {
      console.error(err)
      setIsPublishing(false)
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setTitle(item.title)
    setAddress(item.address)
    setPincode(item.pincode.toString())
    setNearbyAreas(item.nearbyAreas.join(', '))
    setMarketplaceItemPrice(item.itemPrice.toString())
    setPhoneNumber(item.phoneNumber)
    setDescription(item.description)
    setImageUrls(item.imageUrls || [])
    setStatus(item.status)
    setPosition([item.latitude, item.longitude])
    setShowModal(true)
  }

  const openNewModal = () => {
    setEditingId(null)
    setTitle('')
    setAddress('')
    setPincode('')
    setNearbyAreas('')
    setMarketplaceItemPrice('')
    setPhoneNumber('')
    setDescription('')
    setImageUrls([])
    setStatus('Available')
    setPosition(null)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this marketplaceItem?')) return
    try {
      const token = localStorage.getItem('lt_token') || ''
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/marketplace/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        fetchMarketplaceItems()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">My MarketplaceItems</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">Manage your existing marketplaceItem properties or add new ones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="grid size-11 place-items-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={openNewModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95 h-11"
          >
            <Plus size={20} /> Add Item
          </button>
        </div>
      </div>

      {/* MarketplaceItems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplace.map((r) => (
          <Card key={r.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-all hover:scale-[1.02]">
            <div className="h-48 overflow-hidden relative">
              <img src={r.imageUrls[0] || 'https://via.placeholder.com/400x300?text=No+Image'} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                {r.status}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{r.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-4">
                <MapPin size={14} /> {r.address}
              </p>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-4">
                ₹{r.itemPrice}/mo
              </div>
              <div className="mt-auto flex gap-3 pt-4 border-t border-zinc-100 dark:border-white/10">
                <button 
                  onClick={() => handleEdit(r)}
                  className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-zinc-100 dark:bg-white/5 py-2 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition">
                  <Edit size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(r.id)}
                  className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-2 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
        {marketplace.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl">
            <Home size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold">No MarketplaceItems Found</h3>
            <p className="mt-2">You haven't posted any marketplaceItem properties yet.</p>
          </div>
        )}
      </div>

      {/* Add MarketplaceItem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl shadow-2xl my-8">
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10 rounded-t-3xl">
              <h2 className="text-2xl font-bold dark:text-white">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleAddMarketplaceItem} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Property Title</label>
                  <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. 2BHK Flat" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Full Address</label>
                  <textarea required value={address} onChange={e=>setAddress(e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Pincode</label>
                    <input required type="number" value={pincode} onChange={e=>setPincode(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-zinc-300">item Price (₹)</label>
                    <input required type="number" value={itemPrice} onChange={e=>setMarketplaceItemPrice(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Nearby Areas (comma separated)</label>
                  <input required value={nearbyAreas} onChange={e=>setNearbyAreas(e.target.value)} placeholder="Madhapur, Gachibowli..." className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Phone Number</label>
                  <input required type="number" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Description</label>
                  <textarea required value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder="24/7 water, Parking available..." className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-zinc-300">Property Photos</label>
                  <div className="flex gap-3 mb-4">
                    <label className="flex-1 flex flex-col items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                      <ImageIcon size={24} className="text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Gallery</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <label className="flex-1 flex flex-col items-center justify-center gap-2 bg-purple-50 dark:bg-purple-500/10 border-2 border-dashed border-purple-200 dark:border-purple-500/30 rounded-2xl p-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                      <Camera size={24} className="text-purple-500" />
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Camera</span>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  {imageUrls.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {imageUrls.map((url, i) => (
                        <div key={i} className="relative size-16 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <img src={url} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 grid size-5 place-items-center bg-black/60 rounded-full text-white backdrop-blur-md">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1 dark:text-zinc-300">Availability Status</label>
                  <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 dark:text-white">
                    <option>Available</option>
                    <option>Occupied</option>
                    <option>Coming Soon</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-bold dark:text-zinc-300">Exact Live Location</label>
                    <button type="button" onClick={handleAutoLocate} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                      <Crosshair size={12} /> Auto-Detect
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">Click on the map to drop a pin.</p>
                  <div className="h-48 w-full rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 z-0 relative">
                    <MapContainer center={position || [17.3850, 78.4867]} zoom={13} className="h-full w-full z-0">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isPublishing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 font-bold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-70"
                  >
                    {publishSuccess ? (
                      <><CheckCircle size={20} /> Published Successfully</>
                    ) : isPublishing ? (
                      <><Loader2 size={20} className="animate-spin" /> Publishing...</>
                    ) : (
                      editingId ? 'Save Changes' : 'Publish Item'
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-2xl bg-zinc-900 dark:bg-white px-6 py-4 shadow-2xl border border-zinc-800 dark:border-zinc-200 animate-in slide-in-from-bottom-5">
          <div className="grid size-8 place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
            <CheckCircle size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-white dark:text-zinc-900">Item {editingId ? 'Updated' : 'Published'} Successfully!</div>
            <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">It is now visible to users.</div>
          </div>
        </div>
      )}
    </div>
  )
}
