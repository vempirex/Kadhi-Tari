import { motion } from 'framer-motion';
import { Settings, MapPin, Heart, Calendar, Camera, Edit3, Grid, Image as ImageIcon, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string;
  cover_url: string;
  bio: string;
  relationship_status: string;
  favorite_quote: string;
  joined_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

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
      
      if (!error && data) setProfile(data);
    }
  };

  if (!profile) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-500"></div></div>;

  return (
    <div className="min-h-screen pb-20">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] to-transparent opacity-60" />
        <Link to="/profile/edit" className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/60 transition-all">
          <Settings size={20} />
        </Link>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl border-4 border-[#050506] overflow-hidden bg-card-bg shadow-2xl">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-[#050506] rounded-full shadow-lg" />
          </div>
          <Link to="/profile/edit">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 text-sm"
            >
              Edit Profile
            </motion.button>
          </Link>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-serif glow-text">{profile.display_name || profile.username}</h1>
            <p className="text-rose-400 font-medium">@{profile.username}</p>
          </div>

          <p className="text-gray-300 leading-relaxed max-w-md italic">
            "{profile.bio || 'Living in our private universe...'}"
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Heart size={14} className="text-rose-500" />
              <span>{profile.relationship_status || 'In Love'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={14} />
              <span>Joined {new Date(profile.joined_at || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-white/5 px-4">
        <div className="flex gap-8 justify-center">
          <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={Grid} label="Memories" />
          <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} icon={ImageIcon} label="Gallery" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-4 grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square rounded-xl overflow-hidden glass-card group cursor-pointer"
          >
            <img 
              src={`https://picsum.photos/seed/${profile.username}${i}/400/400`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt=""
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
        active ? "text-rose-400" : "text-gray-500"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="profile-tab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(251,113,133,0.5)]"
        />
      )}
    </button>
  );
}
