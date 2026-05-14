import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, User, Heart, MessageSquare, Quote, Sparkles, Loader2, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Gathering the universe...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <header className="flex items-center justify-between p-6 sm:px-2 mb-8 sticky top-0 z-[100] bg-[#050506]/80 backdrop-blur-2xl -mx-4 sm:mx-0 border-b border-white/5 sm:border-none">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)} 
          className="p-4 bg-white/[0.03] rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5 shadow-xl"
        >
          <ArrowLeft size={22} />
        </motion.button>
        <div className="text-center">
          <h1 className="text-2xl font-serif glow-text leading-none">Edit Sanctuary</h1>
          <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.3em] mt-2">Refine your essence</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          form="edit-profile-form"
          disabled={isSaving}
          className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-xl disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={22} className="animate-spin" /> : <Check size={22} strokeWidth={3} />}
        </motion.button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="px-2 space-y-12">
        {/* Visual Identity Section */}
        <div className="space-y-6">
          <div className="relative h-48 sm:h-64 rounded-[3.5rem] overflow-hidden group border-2 border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-rose-500/30">
            <img 
              src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" 
              alt="Cover" 
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
              {isUploading === 'cover' ? <Loader2 className="animate-spin text-rose-500" size={32} /> : (
                <>
                  <div className="p-4 rounded-full bg-white/10 border border-white/20 mb-3">
                    <Camera size={32} className="text-white" />
                  </div>
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Change Banner</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
            
            {/* Avatar positioning */}
            <div className="absolute bottom-[-1.5rem] left-8 sm:left-12">
              <div className="relative group/avatar">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] sm:rounded-[3rem] p-1.5 bg-gradient-to-tr from-rose-500 to-orange-400 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] sm:rounded-[2.8rem] border-[6px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                    <img 
                      src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                      alt="Avatar" 
                    />
                  </div>
                </div>
                <label className="absolute inset-0 bg-black/50 rounded-[2.5rem] sm:rounded-[3rem] opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                  {isUploading === 'avatar' ? <Loader2 className="animate-spin text-rose-500" size={24} /> : (
                    <>
                      <Camera size={24} className="text-white" />
                      <span className="text-[8px] text-white font-black uppercase tracking-widest mt-1">Portrait</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="space-y-12 pt-10">
          {/* Identity Fields */}
          <div className="space-y-8 premium-card p-8 sm:p-10 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 px-1 mb-2">
              <ShieldCheck size={18} className="text-rose-400" />
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Sanctuary Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InputField 
                label="Display Name" 
                icon={User} 
                value={formData.display_name} 
                onChange={(v: string) => setFormData({...formData, display_name: v})} 
                placeholder="How should I call you?" 
              />
              <InputField 
                label="Handle (Username)" 
                icon={Sparkles} 
                value={formData.username} 
                onChange={(v: string) => setFormData({...formData, username: v})} 
                placeholder="Your unique handle" 
              />
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-8 premium-card p-8 sm:p-10 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 px-1 mb-2">
              <MessageSquare size={18} className="text-blue-400" />
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Our Narrative</h2>
            </div>

            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-rose-400 transition-colors">Our Collective Story (Bio)</label>
              <div className="relative">
                <div className="absolute top-6 left-6 text-gray-600 group-focus-within:text-rose-500 transition-colors">
                  <MessageSquare size={20} strokeWidth={2.5} />
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input-field min-h-[160px] pl-16 py-6 resize-none leading-relaxed text-base sm:text-lg font-medium"
                  placeholder="Share the whispers of our journey..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InputField 
                label="Heart Status" 
                icon={Heart} 
                value={formData.relationship_status} 
                onChange={(v: string) => setFormData({...formData, relationship_status: v})} 
                placeholder="e.g. In Love, Soulmates..." 
              />
              <InputField 
                label="The Shared Quote" 
                icon={Quote} 
                value={formData.favorite_quote} 
                onChange={(v: string) => setFormData({...formData, favorite_quote: v})} 
                placeholder="Words that define us..." 
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSaving}
          className="btn-primary w-full flex items-center justify-center gap-4 py-6 text-lg tracking-wide shadow-[0_20px_60px_rgba(244,63,94,0.2)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={24} /> : (
            <>
              <Check size={24} strokeWidth={3} />
              <span>Unify Sanctuary Changes</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

function InputField({ label, icon: Icon, value, onChange, placeholder }: { label: string; icon: any; value: string; onChange: (val: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-rose-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-6 text-gray-600 group-focus-within:text-rose-500 transition-colors">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-16 py-5 text-base sm:text-lg font-medium"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

