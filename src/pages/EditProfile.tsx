import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, User, Heart, MessageSquare, Quote, Sparkles, Loader2, Image as ImageIcon, ShieldCheck, Zap } from 'lucide-react';
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
    bio: '',
    relationship_status: '',
    favorite_quote: '',
    avatar_url: '',
    cover_url: '',
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
          bio: data.bio || '',
          relationship_status: data.relationship_status || '',
          favorite_quote: data.favorite_quote || '',
          avatar_url: data.avatar_url || '',
          cover_url: data.cover_url || '',
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
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Gathering the universe...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <header className="flex items-center justify-between p-6 sm:px-0 mb-12 sticky top-0 z-[100] sm:relative bg-transparent">
        <Button 
          variant="glass"
          size="sm"
          onClick={() => navigate(-1)} 
          className="rounded-2xl p-4 h-auto aspect-square border-white/5"
        >
          <ArrowLeft size={22} />
        </Button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-1">
            <Sparkles size={12} className="animate-pulse" />
            Vibe Tuning
          </div>
          <h1 className="text-3xl font-serif glow-text leading-tight tracking-tight">Refine Essence</h1>
        </div>
        <Button 
          variant="primary"
          size="sm"
          form="edit-profile-form"
          disabled={isSaving}
          className="rounded-2xl p-4 h-auto aspect-square"
        >
          {isSaving ? <Loader2 size={22} className="animate-spin" /> : <Check size={22} strokeWidth={3} />}
        </Button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="px-2 sm:px-0 space-y-16">
        {/* Visual Identity Section */}
        <section className="space-y-8">
          <Card className="relative h-56 sm:h-80 rounded-[3.5rem] sm:rounded-[4.5rem] overflow-hidden p-0 group border-white/5 bg-white/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
            <img 
              src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[3000ms]" 
              alt="Cover" 
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-sm">
              {isUploading === 'cover' ? <Loader2 className="animate-spin text-rose-500" size={40} /> : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-5 rounded-full bg-white/10 border border-white/20 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                    <Camera size={32} className="text-white" />
                  </div>
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.4em]">Morph Banner</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
            
            {/* Avatar positioning */}
            <div className="absolute bottom-[-1.5rem] left-10 sm:left-14">
              <div className="relative group/avatar">
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[3.5rem] sm:rounded-[4rem] p-1.5 bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                  <div className="w-full h-full rounded-[3.2rem] sm:rounded-[3.8rem] border-[6px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                    <img 
                      src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110" 
                      alt="Avatar" 
                    />
                  </div>
                </div>
                <label className="absolute inset-0 bg-black/60 rounded-[3.5rem] sm:rounded-[4rem] opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                  {isUploading === 'avatar' ? <Loader2 className="animate-spin text-rose-500" size={28} /> : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera size={24} className="text-white" />
                      <span className="text-[8px] text-white font-black uppercase tracking-[0.4em]">Portrait</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </label>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Fields Section */}
        <div className="space-y-12 pt-8">
          {/* Identity Fields */}
          <Card className="p-10 sm:p-14 space-y-10 border-white/5 shadow-3xl bg-white/[0.01]">
            <div className="flex items-center gap-4 px-1 mb-2">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h2 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Sanctuary Registry</h2>
                <p className="text-lg font-serif text-white/90">Official Frequency Details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <InputField 
                label="Display Name" 
                icon={User} 
                value={formData.display_name} 
                onChange={(v: string) => setFormData({...formData, display_name: v})} 
                placeholder="What should I call you?" 
              />
              <InputField 
                label="Frequency Handle" 
                icon={Sparkles} 
                value={formData.username} 
                onChange={(v: string) => setFormData({...formData, username: v})} 
                placeholder="Your unique handle" 
              />
            </div>
          </Card>

          {/* Bio & Details */}
          <Card className="p-10 sm:p-14 space-y-10 border-white/5 shadow-3xl bg-white/[0.01]">
            <div className="flex items-center gap-4 px-1 mb-2">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <MessageSquare size={20} />
              </div>
              <div className="space-y-1">
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Shared Narrative</h2>
                <p className="text-lg font-serif text-white/90">Deep Protocol Echoes</p>
              </div>
            </div>

            <div className="space-y-4 group">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-1 group-focus-within:text-rose-400 transition-colors">Our Collective Saga (Bio)</label>
              <div className="relative">
                <div className="absolute top-7 left-7 text-gray-700 group-focus-within:text-rose-500 transition-colors pointer-events-none">
                  <MessageSquare size={22} strokeWidth={2.5} />
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input-field min-h-[180px] pl-16 py-7 resize-none leading-relaxed text-lg font-medium bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500"
                  placeholder="Whisper the essence of our journey..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <InputField 
                label="Core Resonance" 
                icon={Heart} 
                value={formData.relationship_status} 
                onChange={(v: string) => setFormData({...formData, relationship_status: v})} 
                placeholder="e.g. In Love, Soulmates..." 
              />
              <InputField 
                label="The Shared Frequency" 
                icon={Quote} 
                value={formData.favorite_quote} 
                onChange={(v: string) => setFormData({...formData, favorite_quote: v})} 
                placeholder="Words that bind us..." 
              />
            </div>
          </Card>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-5 py-8 text-xl tracking-tight shadow-[0_30px_80px_rgba(244,63,94,0.25)] relative overflow-hidden group"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          {isSaving ? <Loader2 className="animate-spin relative z-10" size={28} /> : (
            <>
              <Check size={28} strokeWidth={3} className="relative z-10 group-hover:scale-125 transition-transform" />
              <span className="relative z-10">Crystalize Changes</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function InputField({ label, icon: Icon, value, onChange, placeholder }: { label: string; icon: any; value: string; onChange: (val: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-4 group">
      <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-1 group-focus-within:text-rose-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-7 text-gray-700 group-focus-within:text-rose-500 transition-colors pointer-events-none">
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-16 py-6 text-lg font-medium bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

