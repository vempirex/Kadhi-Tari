import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Check, User, Heart, MessageSquare, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    relationship_status: '',
    favorite_quote: '',
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
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="flex justify-between items-center p-6 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif glow-text">Edit Profile</h1>
        <button 
          form="edit-profile-form"
          disabled={isLoading}
          className="p-2 text-rose-400 hover:text-rose-300 disabled:opacity-50"
        >
          {isLoading ? <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /> : <Check size={24} />}
        </button>
      </header>

      <form id="edit-profile-form" onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Profile Photos Preview (Static for now) */}
        <div className="flex flex-col items-center gap-6 pb-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-rose-500/20 shadow-2xl">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-rose-400/60 uppercase tracking-widest font-bold">Change Profile Photo</p>
        </div>

        <div className="space-y-6">
          <InputField 
            label="Display Name" 
            icon={User} 
            value={formData.display_name} 
            onChange={(v: string) => setFormData({...formData, display_name: v})} 
            placeholder="How you're seen..." 
          />
          <InputField 
            label="Username" 
            icon={User} 
            value={formData.username} 
            onChange={(v: string) => setFormData({...formData, username: v})} 
            placeholder="Unique handle" 
          />
          
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold ml-1">About Us</label>
            <div className="relative">
              <MessageSquare className="absolute top-4 left-4 text-gray-500" size={18} />
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-rose-500/50 transition-colors h-32 resize-none"
                placeholder="A short bio about our journey..."
              />
            </div>
          </div>

          <InputField 
            label="Relationship Status" 
            icon={Heart} 
            value={formData.relationship_status} 
            onChange={(v: string) => setFormData({...formData, relationship_status: v})} 
            placeholder="In a happy relationship..." 
          />
          <InputField 
            label="Our Quote" 
            icon={Quote} 
            value={formData.favorite_quote} 
            onChange={(v: string) => setFormData({...formData, favorite_quote: v})} 
            placeholder="A quote that defines us..." 
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 mt-8"
        >
          {isLoading ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
