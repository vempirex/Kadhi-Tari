import { motion } from 'framer-motion';
import { 
  Camera, ArrowLeft, Check, User, Heart, MessageSquare, 
  Quote, Sparkles, Loader2, Image as ImageIcon, ShieldCheck, 
  Zap, Fingerprint, Shield, MapPin, Globe, Smile, Calendar,
  ArrowRight
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
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <Loader2 size={48} className="animate-spin text-rose-500" />
      <p className="text-[12px] text-gray-400 font-black uppercase tracking-[1em] italic">Gathering frequencies...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-48 space-y-12 relative px-4">
      <header className="flex items-center justify-between py-12 sticky top-0 z-[100] bg-black/60 backdrop-blur-3xl -mx-4 px-4">
        <div className="flex items-center gap-6">
          <Button variant="glass" onClick={() => navigate(-1)} className="p-4 h-auto aspect-square rounded-2xl">
            <ArrowLeft size={32} />
          </Button>
          <div className="space-y-1">
            <h1 className="text-5xl font-serif italic text-white leading-none">Tune Essence</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60 italic">Vibe Modulation</p>
          </div>
        </div>
        <Button 
          form="edit-profile-form"
          disabled={isSaving}
          className="rounded-3xl px-12 py-4 bg-rose-500 text-white shadow-lg shadow-rose-500/20"
        >
          {isSaving ? <Loader2 size={24} className="animate-spin" /> : <span className="flex items-center gap-4 italic font-serif text-3xl">Crystalize <Check size={24} /></span>}
        </Button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-16">
        {/* Visuals */}
        <section className="space-y-8">
          <div className="relative h-64 rounded-[4rem] bg-white/[0.02] border-2 border-dashed border-white/5 overflow-hidden group">
            <img 
              src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[5000ms]" 
              alt="Cover" 
            />
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={48} className="text-white/60 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">Change Banner</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
            {isUploading === 'cover' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-rose-500" />
              </div>
            )}
          </div>

          <div className="flex justify-center -mt-32 relative z-10">
            <div className="relative group">
              <div className="w-64 h-64 rounded-[4rem] p-1 bg-gradient-to-tr from-rose-500 to-orange-500 shadow-2xl relative overflow-hidden">
                <div className="w-full h-full rounded-[3.8rem] bg-black overflow-hidden flex items-center justify-center">
                  <img 
                    src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[3000ms]" 
                    alt="Avatar" 
                  />
                </div>
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white/60" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
              </label>
              {isUploading === 'avatar' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-[4rem] flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-rose-500" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="glass" className="p-8 space-y-8">
            <h2 className="text-4xl font-serif italic text-white/90 flex items-center gap-4">
              <User size={32} className="text-rose-500" /> Identity
            </h2>
            <div className="space-y-6">
              <FormInput label="Display Name" value={formData.display_name} onChange={(v) => setFormData({...formData, display_name: v})} placeholder="The name I call you" />
              <FormInput label="Full Name" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} placeholder="As written in the stars" />
              <FormInput label="Handle" value={formData.username} onChange={(v) => setFormData({...formData, username: v})} placeholder="starlight_echo" disabled />
            </div>
          </Card>

          <Card variant="glass" className="p-8 space-y-8">
            <h2 className="text-4xl font-serif italic text-white/90 flex items-center gap-4">
              <Heart size={32} className="text-rose-500" /> Resonance
            </h2>
            <div className="space-y-6">
              <FormInput label="Core Connection" value={formData.relationship_status} onChange={(v) => setFormData({...formData, relationship_status: v})} placeholder="In Love, Harmony..." />
              <FormInput label="The Genesis" value={formData.anniversary} onChange={(v) => setFormData({...formData, anniversary: v})} type="date" />
              <FormInput label="Solar Return" value={formData.birthday} onChange={(v) => setFormData({...formData, birthday: v})} type="date" />
            </div>
          </Card>

          <Card variant="glass" className="p-8 space-y-8 md:col-span-2">
            <h2 className="text-4xl font-serif italic text-white/90 flex items-center gap-4">
              <MessageSquare size={32} className="text-rose-500" /> Saga & World
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-2 italic">The Collective Narrative (Bio)</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-3xl font-serif italic text-white min-h-[200px] outline-none focus:border-rose-500/30 transition-all resize-none"
                    placeholder="Whisper our shared story..."
                  />
                </div>
                <FormInput label="Shared Echo (Quote)" value={formData.favorite_quote} onChange={(v) => setFormData({...formData, favorite_quote: v})} placeholder="Words that bind..." />
              </div>
              <div className="space-y-6">
                <FormInput label="Coordinates" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} placeholder="Where you breathe..." icon={MapPin} />
                <FormInput label="Spiritual Echoes" value={formData.interests} onChange={(v) => setFormData({...formData, interests: v})} placeholder="Art, Music, Souls..." icon={Globe} />
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = 'text', icon: Icon, disabled = false }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 px-2 italic group-focus-within:text-rose-500 transition-colors">{label}</label>
      <div className="relative">
        {Icon && <Icon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" />}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={twMerge(
            "w-full bg-white/[0.02] border border-white/5 rounded-[2rem] py-4 px-6 text-3xl font-serif italic text-white outline-none focus:border-rose-500/30 transition-all placeholder:text-white/5",
            Icon && "pl-16",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
