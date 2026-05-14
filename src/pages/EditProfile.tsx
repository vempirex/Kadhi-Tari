import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, User, Heart, MessageSquare, Quote, Sparkles, MapPin, Loader2, Image as ImageIcon } from 'lucide-react';
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
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        navigate('/profile');
      }
    }
    setIsSaving(false);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <Loader2 className="animate-spin text-rose-500" size={32} />
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Gathering universe...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 bg-[#050506]/80 backdrop-blur-xl z-50">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-serif glow-text">Edit Sanctuary</h1>
          <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Customize your vibe</p>
        </div>
        <button 
          form="edit-profile-form"
          disabled={isSaving}
          className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
        </button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="p-6 space-y-10">
        <div className="space-y-6">
          <div className="relative h-48 rounded-[2.5rem] overflow-hidden group border border-white/5 bg-white/5">
            <img 
              src={formData.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
              alt="" 
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              {isUploading === 'cover' ? <Loader2 className="animate-spin text-white" size={32} /> : (
                <>
                  <Camera size={32} className="text-white mb-2" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Update Cover</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
            
            <div className="absolute -bottom-2 left-6">
              <div className="relative group/avatar">
                <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-tr from-rose-500 to-orange-400 shadow-2xl">
                  <div className="w-full h-full rounded-[1.8rem] border-4 border-[#050506] overflow-hidden bg-card-bg">
                    <img 
                      src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                </div>
                <label className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer">
                  {isUploading === 'avatar' ? <Loader2 className="animate-spin text-white" size={20} /> : <Camera size={20} className="text-white" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Sparkles size={14} className="text-rose-400" />
              <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Core Identity</h2>
            </div>
            
            <InputField 
              label="Display Name" 
              icon={User} 
              value={formData.display_name} 
              onChange={(v: string) => setFormData({...formData, display_name: v})} 
              placeholder="How should I call you?" 
            />
            
            <InputField 
              label="Username" 
              icon={Sparkles} 
              value={formData.username} 
              onChange={(v: string) => setFormData({...formData, username: v})} 
              placeholder="Your unique handle" 
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1 mb-2">
              <MessageSquare size={14} className="text-blue-400" />
              <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Our Story</h2>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">About Us</label>
              <div className="relative">
                <MessageSquare className="absolute top-4 left-4 text-gray-600" size={18} />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input-field min-h-[120px] pl-12 resize-none leading-relaxed"
                  placeholder="Share a snippet of our beautiful journey..."
                />
              </div>
            </div>

            <InputField 
              label="Relationship Status" 
              icon={Heart} 
              value={formData.relationship_status} 
              onChange={(v: string) => setFormData({...formData, relationship_status: v})} 
              placeholder="e.g., In Love, Soulmates..." 
            />
            
            <InputField 
              label="Our Sanctuary Quote" 
              icon={Quote} 
              value={formData.favorite_quote} 
              onChange={(v: string) => setFormData({...formData, favorite_quote: v})} 
              placeholder="A quote that resonates with us..." 
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSaving}
          className="btn-primary w-full flex items-center justify-center gap-3 py-5 shadow-2xl shadow-rose-500/20 mt-8"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <Check size={20} strokeWidth={3} />
              <span>Unify Changes</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

function InputField({ label, icon: Icon, value, onChange, placeholder }: { label: string; icon: any; value: string; onChange: (val: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{label}</label>
      <div className="relative">
        <Icon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-12"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

