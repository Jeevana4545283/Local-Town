import { useState, useEffect } from 'react';
import { Camera, MapPin, Briefcase, Phone, Mail, Lock, LogOut, Loader2, TrendingUp, Star, Calendar, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../lib/auth';

export function OwnerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('lt_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('lt_token')}` 
        },
        body: JSON.stringify({ ...profile, categories: Array.isArray(profile.categories) ? profile.categories : profile.categories?.split(',').map((c: string) => c.trim()).filter(Boolean) || [] })
      });
      if (res.ok) {
        alert("Business Profile saved successfully");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile/upload`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('lt_token')}` 
          },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        const data = await res.json();
        if (data.avatarUrl) {
          setProfile({ ...profile, avatarUrl: data.avatarUrl });
          alert("Business logo updated");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('lt_token')}` 
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        alert("Password updated successfully");
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        setPasswordError(data.message || 'Update failed');
      }
    } catch (err) {
      setPasswordError('Server error');
    }
  };

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem('lt_owner_categories');
    navigate('/login');
  };

  if (loading) {
    return <div className="h-full w-full flex justify-center items-center"><Loader2 className="animate-spin text-zinc-400" size={48} /></div>;
  }

  if (!profile) return null;

  const totalListings = (profile._count?.rentals || 0) + (profile._count?.workers || 0) + (profile._count?.services || 0) + (profile._count?.offers || 0) + (profile._count?.events || 0);
  const totalBookings = profile._count?.bookings || 0;

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Business Profile</h1>
        <p className="text-zinc-400 mt-2">Manage your public storefront and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="size-40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                {profile.avatarUrl ? (
                  <img src={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}${profile.avatarUrl}`} alt="Business Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-zinc-700">
                    <Briefcase size={48} />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-3 -right-3 p-3 bg-indigo-500 hover:bg-indigo-400 rounded-2xl cursor-pointer transition shadow-lg text-white">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <h2 className="text-2xl font-black text-center">{profile.businessName || profile.name}</h2>
            <p className="text-zinc-400 font-medium text-center">{profile.email}</p>

            <div className="w-full h-px bg-white/10 my-6" />

            <div className="w-full space-y-3">
              <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition font-bold">
                <Lock size={18} className="text-indigo-400" /> Security
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10 rounded-xl transition font-bold">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <TrendingUp size={24} className="text-indigo-400 mb-2" />
              <span className="text-2xl font-black">{totalListings}</span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Listings</span>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Calendar size={24} className="text-emerald-400 mb-2" />
              <span className="text-2xl font-black">{totalBookings}</span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Bookings</span>
            </div>
            <div className="col-span-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Star size={24} className="text-amber-400 mb-2" />
              <span className="text-2xl font-black">4.9 / 5</span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Global Rating</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Store Information</h2>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Details'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Owner Name</label>
                <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Name</label>
                <input type="text" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Description / Bio</label>
                <textarea rows={4} value={profile.description || ''} onChange={e => setProfile({...profile, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition resize-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact Email</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-4">
                  <Mail size={18} className="text-zinc-500 mr-3" />
                  <input type="email" disabled value={profile.email || ''} className="bg-transparent border-none outline-none w-full text-zinc-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Phone</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-indigo-500 transition">
                  <Phone size={18} className="text-zinc-500 mr-3" />
                  <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-transparent border-none outline-none w-full" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Address</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-indigo-500 transition">
                  <MapPin size={18} className="text-zinc-500 mr-3" />
                  <input type="text" value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} className="bg-transparent border-none outline-none w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">State</label>
                <input type="text" value={profile.state || ''} onChange={e => setProfile({...profile, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pincode</label>
                <input type="text" value={profile.pincode || ''} onChange={e => setProfile({...profile, pincode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Categories</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-indigo-500 transition">
                  <Tag size={18} className="text-zinc-500 mr-3" />
                  <input type="text" placeholder="Rentals, Services, Workers (comma separated)" value={Array.isArray(profile.categories) ? profile.categories.join(', ') : profile.categories || ''} onChange={e => setProfile({...profile, categories: e.target.value})} className="bg-transparent border-none outline-none w-full" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Security Settings</h3>
            {passwordError && <div className="p-3 bg-red-500/20 text-red-400 rounded-xl mb-4 text-sm font-medium">{passwordError}</div>}
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold transition">Cancel</button>
              <button onClick={handleChangePassword} className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold transition text-white">Save Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
