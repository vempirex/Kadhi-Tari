import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, ArrowLeft, Check, User, Heart, MessageSquare, 
  Quote, Sparkles, Loader2, Image as ImageIcon, ShieldCheck, 
  Zap, Fingerprint, Shield, MapPin, Globe, Smile, Calendar,
  ArrowRight, Lock, LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function EditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<'avatar' | 'cover' | null>(null);
  const [activeTab, setActiveTab] = useState<'essence' | 'security'>('essence');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    full_name: '',
    bio: '',
    relationship_status: '',
    favorite_quote: '',
    avatar_url: '',
    cover_url: '',
    anniversary: '',
    birthday: '',
    location: '',
    interests: '',
  });

  const [securityData, setSecurityData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setFormData({
          username: data.username || '',
          display_name: data.display_name || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          relationship_status: data.relationship_status || '',
          favorite_quote: data.favorite_quote || '',
          avatar_url: data.avatar_url || '',
          cover_url: data.cover_url || '',
          anniversary: data.anniversary || '',
          birthday: data.birthday || '',
          location: data.location || '',
          interests: data.interests || '',
        });
      }
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(type);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);
      
      setFormData(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMessage(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (securityData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: securityData.newPassword });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Security passphrase updated.' });
      setSecurityData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing presence...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-2">
      <header className="flex items-center justify-between py-4 sticky top-0 z-[100] bg-warm-50/80 backdrop-blur-md -mx-4 px-4 border-b border-warm-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} size="sm" className="p-2 h-auto rounded-xl">
            <ArrowLeft size={20} />
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-charcoal leading-none">Tune Presence</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Vibe Modulation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'essence' && (
            <Button 
              form="edit-profile-form"
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <span className="flex items-center gap-2">Save <Check size={16} /></span>}
            </Button>
          )}
        </div>
      </header>

      <div className="flex gap-2 p-1 bg-warm-100 rounded-xl w-fit">
        <button 
          onClick={() => { setActiveTab('essence'); setMessage(null); }}
          className={twMerge(
            "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'essence' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
          )}
        >
          Essence
        </button>
        <button 
          onClick={() => { setActiveTab('security'); setMessage(null); }}
          className={twMerge(
            "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'security' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
          )}
        >
          Security
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'essence' ? (
          <motion.div 
            key="essence-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Visuals */}
              <section className="space-y-6">
                <div className="relative h-48 rounded-3xl bg-warm-50 border border-dashed border-warm-200 overflow-hidden group">
                  <img src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="Cover" />
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Camera size={24} className="text-white mb-2" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Banner</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                  </label>
                  {isUploading === 'cover' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-rose-500" />
                    </div>
                  )}
                </div>

                <div className="flex justify-center -mt-24 relative z-10">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full p-1 bg-white shadow-xl relative overflow-hidden">
                      <div className="w-full h-full rounded-full bg-warm-50 overflow-hidden flex items-center justify-center border border-warm-100">
                        <img src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} className="w-full h-full object-cover" alt="Avatar" />
                      </div>
                    </div>
                    <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera size={20} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                    </label>
                    {isUploading === 'avatar' && (
                      <div className="absolute inset-0 bg-black/40 rounded-full backdrop-blur-sm flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-rose-500" />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center gap-3 text-rose-600">
                    <User size={20} />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Identity</h2>
                  </div>
                  <div className="space-y-4">
                    <FormInput label="Nickname" value={formData.display_name} onChange={(v) => setFormData({...formData, display_name: v})} placeholder="How I call you" />
                    <FormInput label="Full Name" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} placeholder="As written in the stars" />
                    <FormInput label="Handle" value={formData.username} onChange={(v) => setFormData({...formData, username: v})} placeholder="unique_handle" />
                  </div>
                </Card>

                <Card className="p-6 space-y-6">
                  <div className="flex items-center gap-3 text-rose-600">
                    <Heart size={20} />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Resonance</h2>
                  </div>
                  <div className="space-y-4">
                    <FormInput label="Status" value={formData.relationship_status} onChange={(v) => setFormData({...formData, relationship_status: v})} placeholder="In Harmony, Exploring..." />
                    <FormInput label="Anniversary" value={formData.anniversary} onChange={(v) => setFormData({...formData, anniversary: v})} type="date" />
                    <FormInput label="Birthday" value={formData.birthday} onChange={(v) => setFormData({...formData, birthday: v})} type="date" />
                  </div>
                </Card>

                <Card className="p-6 space-y-6 md:col-span-2">
                  <div className="flex items-center gap-3 text-rose-600">
                    <MessageSquare size={20} />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Saga & World</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-warm-400 ml-1">Bio</label>
                        <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-warm-50/50 border border-warm-100 rounded-xl p-3 text-sm font-medium text-charcoal min-h-[120px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none" placeholder="Share your story..." />
                      </div>
                      <FormInput label="Favorite Quote" value={formData.favorite_quote} onChange={(v) => setFormData({...formData, favorite_quote: v})} placeholder="Words that resonate..." />
                    </div>
                    <div className="space-y-4">
                      <FormInput label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} placeholder="Where you reside..." icon={MapPin} />
                      <FormInput label="Interests" value={formData.interests} onChange={(v) => setFormData({...formData, interests: v})} placeholder="Art, Music, Dreams..." icon={Globe} />
                    </div>
                  </div>
                </Card>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="security-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl mx-auto w-full"
          >
            <Card className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <Shield size={32} />
                </div>
                <h2 className="text-2xl font-bold text-charcoal">Security Frequency</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-warm-400">Update your access passphrase</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-warm-400 ml-1">New Passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-600 transition-colors" size={20} />
                      <input 
                        type="password" 
                        value={securityData.newPassword} 
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-warm-400 ml-1">Confirm Passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-600 transition-colors" size={20} />
                      <input 
                        type="password" 
                        value={securityData.confirmPassword} 
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all tracking-widest"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : "Update Security"}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            <div className={twMerge(
              "px-6 py-3 rounded-2xl shadow-premium border text-xs font-bold uppercase tracking-widest",
              message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
            )}>
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: any;
}

function FormInput({ label, value, onChange, placeholder, type = 'text', icon: Icon }: FormInputProps) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[10px] font-bold uppercase tracking-widest text-warm-400 ml-1 group-focus-within:text-rose-600 transition-colors">{label}</label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" />}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={twMerge(
            "w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all placeholder:text-warm-300",
            Icon && "pl-11"
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
