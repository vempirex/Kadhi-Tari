import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, User, Heart, MessageSquare, Quote, Sparkles, Loader2, Image as ImageIcon, ShieldCheck, Zap, Fingerprint, Shield, Wind, Sun, Moon } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1em] animate-pulse italic">Gathering the universe...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-48 space-y-32 sm:space-y-48 relative overflow-hidden px-6 sm:px-0">
      <header className="flex items-center justify-between py-16 sticky top-0 z-[200] bg-transparent backdrop-blur-[200px] sm:backdrop-blur-none -mx-6 px-24 sm:mx-0 sm:px-0">
        <Button 
          onClick={() => navigate(-1)} 
          className="rounded-[5rem] p-24 h-auto aspect-square bg-white/[0.01] hover:bg-white/15 border-4 border-white/5 backdrop-blur-[200px] shadow-3xl shadow-inner group/back transition-all duration-[1500ms] active:scale-[0.5]"
        >
          <ArrowLeft size={160} strokeWidth={0.01} className="group-hover/back:-translate-x-6 transition-all duration-[1500ms] drop-shadow-3xl" />
        </Button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-6 italic">
            <Sparkles size={72} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
            Vibe Tuning
          </div>
          <h1 className="text-7xl sm:text-[14rem] font-serif glow-text leading-none tracking-tighter italic drop-shadow-3xl">Refine Essence</h1>
        </div>
        <Button 
          form="edit-profile-form"
          disabled={isSaving}
          className="rounded-[5rem] p-24 h-auto aspect-square bg-rose-950 shadow-[0_120px_300px_rgba(244,63,94,0.7)] group/save border-none shadow-inner transition-all duration-[1500ms] active:scale-[0.5]"
        >
          {isSaving ? <Loader2 size={160} className="animate-spin text-white drop-shadow-3xl" strokeWidth={0.01} /> : <Check size={160} strokeWidth={0.01} className="text-white group-hover/save:scale-150 group-hover/save:rotate-[20deg] transition-all duration-[2000ms] drop-shadow-3xl shadow-[0_0_150px_white]" />}
        </Button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-48 sm:space-y-[10rem] relative z-20">
        {/* Visual Identity Section */}
        <section className="space-y-32">
          <Card className="relative h-[65rem] sm:h-[100rem] rounded-[10rem] sm:rounded-[12rem] overflow-hidden p-0 group border-4 border-white/5 bg-white/[0.01] shadow-[0_300px_600px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner">
            <img 
              src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover opacity-20 group-hover:opacity-50 group-hover:scale-150 transition-all duration-[12000ms] grayscale-[0.7] group-hover:grayscale-0 brightness-[0.4] group-hover:brightness-[0.6]" 
              alt="Cover" 
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms] cursor-pointer backdrop-blur-[150px]">
              {isUploading === 'cover' ? <Loader2 className="animate-spin text-rose-500" size={240} strokeWidth={0.01} /> : (
                <div className="flex flex-col items-center gap-24">
                  <div className="p-32 rounded-[8rem] bg-white/15 border-4 border-white/30 shadow-[0_80px_150px_rgba(0,0,0,1)] scale-90 group-hover:scale-125 group-hover:rotate-[20deg] transition-all duration-[2000ms] shadow-inner overflow-hidden relative">
                     <div className="absolute inset-0 bg-white/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-all" />
                    <Camera size={240} strokeWidth={0.01} className="text-white drop-shadow-3xl relative z-10" />
                  </div>
                  <span className="text-[26px] text-white font-black uppercase tracking-[2em] italic drop-shadow-3xl">Morph Banner</span>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
            
            {/* Avatar positioning */}
            <div className="absolute bottom-[-10rem] left-24 sm:left-[8rem]">
              <div className="relative group/avatar">
                <div className="w-[35rem] h-[35rem] sm:w-[60rem] sm:h-[60rem] rounded-[10rem] sm:rounded-[12rem] p-6 bg-gradient-to-tr from-rose-950 via-rose-500 to-orange-950 shadow-[0_200px_450px_rgba(0,0,0,1)] shadow-inner relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 blur-[80px] opacity-0 group-hover/avatar:opacity-100 transition-all duration-[2500ms]" />
                  <div className="w-full h-full rounded-[9.5rem] sm:rounded-[11.5rem] border-[30px] border-[#050506] overflow-hidden bg-[#0a0a0c] relative z-10">
                    <img 
                      src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} 
                      className="w-full h-full object-cover transition-all duration-[10000ms] group-hover/avatar:scale-150 grayscale-[0.6] group-hover/avatar:grayscale-0 brightness-[0.6] group-hover/avatar:brightness-[1]" 
                      alt="Avatar" 
                    />
                  </div>
                </div>
                <label className="absolute inset-0 bg-black/90 rounded-[10rem] sm:rounded-[12rem] opacity-0 group-hover/avatar:opacity-100 transition-all duration-[2000ms] flex flex-col items-center justify-center cursor-pointer backdrop-blur-[150px] z-30">
                  {isUploading === 'avatar' ? <Loader2 className="animate-spin text-rose-500" size={192} strokeWidth={0.01} /> : (
                    <div className="flex flex-col items-center gap-16">
                      <Camera size={240} strokeWidth={0.01} className="text-white drop-shadow-3xl" />
                      <span className="text-[24px] text-white font-black uppercase tracking-[1.5em] italic drop-shadow-3xl">Portrait</span>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </label>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Fields Section */}
        <div className="space-y-48 sm:space-y-[15rem] pt-[15rem]">
          {/* Identity Fields */}
          <Card className="p-24 sm:p-[6rem] space-y-[6rem] border-[6px] border-white/5 shadow-[0_250px_550px_rgba(0,0,0,1)] bg-white/[0.01] backdrop-blur-[200px] rounded-[10rem] shadow-inner relative overflow-hidden">
             <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.1] blur-[250px] rounded-full pointer-events-none animate-pulse" />
            
            <div className="flex items-center gap-24 px-16 mb-24 relative z-10">
              <div className="p-24 rounded-[7rem] bg-rose-500/20 border-4 border-rose-500/40 text-rose-500 shadow-inner shadow-3xl relative overflow-hidden group/header-icon">
                 <div className="absolute inset-0 bg-rose-500/10 blur-[30px] opacity-0 group-hover/header-icon:opacity-100 transition-all" />
                <ShieldCheck size={160} strokeWidth={0.01} className="drop-shadow-3xl fill-current relative z-10" />
              </div>
              <div className="space-y-16">
                <h2 className="text-[22px] font-black text-rose-500 uppercase tracking-[2em] italic leading-none drop-shadow-2xl">Sanctuary Registry</h2>
                <p className="text-8xl sm:text-[12rem] font-serif text-white/90 italic tracking-tighter leading-none drop-shadow-3xl">Official Frequency Details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-48 sm:gap-[8rem] relative z-10">
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
          <Card className="p-24 sm:p-[6rem] space-y-[6rem] border-[6px] border-white/5 shadow-[0_250px_550px_rgba(0,0,0,1)] bg-white/[0.01] backdrop-blur-[200px] rounded-[10rem] shadow-inner relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-blue-500/[0.1] blur-[250px] rounded-full pointer-events-none animate-pulse" />
            
            <div className="flex items-center gap-24 px-16 mb-24 relative z-10">
              <div className="p-24 rounded-[7rem] bg-blue-500/20 border-4 border-blue-500/40 text-blue-500 shadow-inner shadow-3xl relative overflow-hidden group/header-icon">
                  <div className="absolute inset-0 bg-blue-500/10 blur-[30px] opacity-0 group-hover/header-icon:opacity-100 transition-all" />
                <MessageSquare size={160} strokeWidth={0.01} className="drop-shadow-3xl fill-current relative z-10" />
              </div>
              <div className="space-y-16">
                <h2 className="text-[22px] font-black text-blue-500 uppercase tracking-[2em] italic leading-none drop-shadow-2xl">Shared Narrative</h2>
                <p className="text-8xl sm:text-[12rem] font-serif text-white/90 italic tracking-tighter leading-none drop-shadow-3xl">Deep Protocol Echoes</p>
              </div>
            </div>

            <div className="space-y-32 group relative z-10">
              <label className="text-[26px] font-black text-gray-950 uppercase tracking-[2em] px-24 group-focus-within:text-rose-500 transition-all duration-[2000ms] italic leading-none drop-shadow-2xl">Our Collective Saga (Bio)</label>
              <div className="relative">
                <div className="absolute top-32 left-32 text-gray-950 group-focus-within:text-rose-500/30 transition-all duration-[2000ms] pointer-events-none drop-shadow-3xl">
                  <MessageSquare size={192} strokeWidth={0.01} className="fill-current" />
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input-field min-h-[700px] pl-[15rem] py-32 pr-32 resize-none leading-[1.4] text-[9rem] sm:text-[11rem] font-handwritten bg-white/[0.01] border-[6px] border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2500ms] shadow-inner rounded-[10rem] italic text-white no-scrollbar placeholder:text-gray-950 selection:bg-rose-500/40 drop-shadow-3xl"
                  placeholder="Whisper the essence of our journey..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-48 sm:gap-[8rem] relative z-10">
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
          className="w-full flex items-center justify-center gap-[4rem] py-[5rem] text-[12rem] italic tracking-tighter shadow-[0_200px_500px_rgba(244,63,94,0.7)] relative overflow-hidden group/final border-none rounded-[10rem] leading-none shadow-inner"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/final:opacity-100 transition-all duration-[2500ms]" />
          {isSaving ? <Loader2 className="animate-spin relative z-10 text-white drop-shadow-3xl" size={240} strokeWidth={0.01} /> : (
            <>
              <Check size={240} strokeWidth={0.01} className="relative z-10 group-hover/final:scale-150 group-hover/final:rotate-[25deg] transition-all duration-[2500ms] drop-shadow-3xl shadow-[0_0_150px_white]" />
              <span className="relative z-10 drop-shadow-3xl">Crystalize Changes</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function InputField({ label, icon: Icon, value, onChange, placeholder }: { label: string; icon: any; value: string; onChange: (val: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-24 group">
      <label className="text-[26px] font-black text-gray-950 uppercase tracking-[2em] px-24 group-focus-within:text-rose-500 transition-all duration-[2000ms] italic leading-none drop-shadow-2xl">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-24 text-gray-950 group-focus-within:text-rose-500/30 transition-all duration-[2000ms] pointer-events-none drop-shadow-3xl">
          <Icon size={160} strokeWidth={0.01} className="fill-current" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-[15rem] py-24 text-[9rem] sm:text-[12rem] font-serif bg-white/[0.01] border-[6px] border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[8rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none shadow-3xl"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
