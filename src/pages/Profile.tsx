import { motion } from 'framer-motion';
import { Settings, MapPin, Heart, Calendar, Camera, Edit3, Grid, Image as ImageIcon, Bookmark, Sparkles, LogOut } from 'lucide-react';
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
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
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

  const fetchUserPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('posts')
        .select('*, post_photos(image_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setPosts(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!profile) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Entering Sanctuary...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-1000">
      {/* Cover Section */}
      <div className="relative h-72 -mx-4 overflow-hidden rounded-b-[4rem]">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-black/30" />
        
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
          <button onClick={() => navigate(-1)} className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/40 transition-all">
            <Settings size={20} className="rotate-90" />
          </button>
          <div className="flex gap-2">
            <Link to="/profile/edit" className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-black/40 transition-all">
              <Edit3 size={20} />
            </Link>
            <button onClick={handleLogout} className="p-3 bg-rose-500/20 backdrop-blur-md rounded-full text-rose-400 border border-rose-500/20 hover:bg-rose-500/40 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header Info */}
      <div className="px-4 -mt-20 relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-40 h-40 rounded-[3rem] p-1.5 bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-400 shadow-2xl">
              <div className="w-full h-full rounded-[2.8rem] border-4 border-[#050506] overflow-hidden bg-card-bg">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-[#050506] rounded-full shadow-lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-serif glow-text leading-tight">{profile.display_name || profile.username}</h1>
            <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
              <Sparkles size={10} />
              @{profile.username}
            </p>
          </div>

          <p className="text-gray-400 font-handwritten text-xl italic max-w-sm px-4">
            "{profile.bio || 'Living in our private universe...'}"
          </p>

          <div className="flex gap-4 pt-2">
            <Badge icon={Heart} label={profile.relationship_status || 'In Love'} />
            <Badge icon={MapPin} label="Our Sanctuary" />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="pt-8 space-y-8">
          <div className="flex gap-4 p-1 bg-white/5 rounded-[2rem] border border-white/5">
            <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={Grid} label="Memories" />
            <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} icon={ImageIcon} label="Gallery" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            {posts.length > 0 ? (
              posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square rounded-[2.5rem] overflow-hidden premium-card p-0"
                >
                  <img 
                    src={post.post_photos?.[0]?.image_url || `https://picsum.photos/seed/${post.id}/400/400`} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    alt=""
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center space-y-4 opacity-50">
                <ImageIcon size={48} className="mx-auto text-rose-500/50" />
                <p className="text-sm font-medium italic">No memories here yet...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      <Icon size={12} className="text-rose-500" />
      <span>{label}</span>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
        active ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-gray-500 hover:text-white"
      )}
    >
      <Icon size={16} strokeWidth={active ? 3 : 2} />
      <span>{label}</span>
    </button>
  );
}
