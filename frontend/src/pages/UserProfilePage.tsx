import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, MapPin, Globe, Moon, Sun, Lock, LogOut, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [savedOffers, setSavedOffers] = useState<any[]>([]);
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

  useEffect(() => {
    fetchSavedOffers();
  }, []);

  const fetchSavedOffers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/offers/saved`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('lt_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedOffers(data.items || []);
      }
    } catch (err) {
      console.error(err);
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
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert("Profile saved successfully");
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
          alert("Profile image updated");
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
    localStorage.removeItem('lt_token');
    localStorage.removeItem('lt_user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex justify-center items-center"><Loader2 className="animate-spin text-white" size={48} /></div>;
  }

  if (!profile) return null;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white font-sans p-6 overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-[40rem] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 size-[40rem] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 pt-20">
        
        {/* Left Column: Avatar & Actions */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 flex flex-col items-center shadow-xl">
            <div className="relative mb-6">
              <div className="size-32 rounded-full overflow-hidden border-4 border-indigo-500/50 shadow-lg bg-zinc-800">
                {profile.avatarUrl ? (
                  <img src={`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}${profile.avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-600">
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full cursor-pointer transition shadow-lg">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="text-zinc-400 font-medium">{profile.email}</p>

            <div className="w-full h-px bg-white/10 my-6" />

            <div className="w-full space-y-3">
              <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition font-medium">
                <Lock size={18} className="text-indigo-400" /> Change Password
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition font-medium">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-400"/> Quick Stats</h3>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-3">
              <span className="text-zinc-400">My Bookings</span>
              <span className="font-bold text-xl">0</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <span className="text-zinc-400">Saved Favorites</span>
              <span className="font-bold text-xl">{savedOffers.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Form */}
        <div className="w-full md:w-2/3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black">Edit Profile</h1>
                <p className="text-zinc-400 mt-1">Manage your personal information</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-transparent border-none outline-none w-full ml-2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3">
                  <Mail size={18} className="text-zinc-500" />
                  <input type="email" disabled value={profile.email || ''} className="bg-transparent border-none outline-none w-full ml-3 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <Phone size={18} className="text-zinc-500" />
                  <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-transparent border-none outline-none w-full ml-3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Country</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <Globe size={18} className="text-zinc-500" />
                  <input type="text" value={profile.country || ''} onChange={e => setProfile({...profile, country: e.target.value})} className="bg-transparent border-none outline-none w-full ml-3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">State</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <MapPin size={18} className="text-zinc-500" />
                  <input type="text" value={profile.state || ''} onChange={e => setProfile({...profile, state: e.target.value})} className="bg-transparent border-none outline-none w-full ml-3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Village / City</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <MapPin size={18} className="text-zinc-500" />
                  <input type="text" value={profile.village || ''} onChange={e => setProfile({...profile, village: e.target.value})} className="bg-transparent border-none outline-none w-full ml-3" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Pincode</label>
                <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-3 focus-within:border-indigo-500 transition">
                  <input type="text" value={profile.pincode || ''} onChange={e => setProfile({...profile, pincode: e.target.value})} className="bg-transparent border-none outline-none w-full ml-2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Theme Preference</label>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => setProfile({...profile, theme: 'dark'})} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${profile.theme === 'dark' ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-400' : 'bg-black/30 border border-white/10'}`}>
                    <Moon size={18} /> Dark
                  </button>
                  <button onClick={() => setProfile({...profile, theme: 'light'})} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${profile.theme === 'light' ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-400' : 'bg-black/30 border border-white/10'}`}>
                    <Sun size={18} /> Light
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Saved Offers Section */}
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-black mb-6">Saved Offers</h2>
            {savedOffers.length === 0 ? (
              <p className="text-zinc-500 font-medium">You haven't saved any offers yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedOffers.map(offer => (
                  <div key={offer.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-white/10 transition-all" onClick={() => navigate('/offers')}>
                    <img src={offer.imageUrls?.[0]} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-white text-lg">{offer.title}</h4>
                      <p className="text-zinc-400 text-xs mt-1"><MapPin size={12} className="inline mr-1 text-cyan-400"/> {offer.address?.split(',')[0]}</p>
                      <p className="text-cyan-400 font-black mt-2 text-sm">₹{offer.discountPrice} OFF</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Change Password</h3>
            {passwordError && <div className="p-3 bg-red-500/20 text-red-400 rounded-xl mb-4 text-sm">{passwordError}</div>}
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition">Cancel</button>
              <button onClick={handleChangePassword} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold transition">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
