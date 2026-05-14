import { motion } from 'framer-motion';
import { Settings, MapPin, Heart, Calendar, Edit3, Grid, Image as ImageIcon, Sparkles, LogOut, ShieldCheck, Award } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('memories');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading || !profile) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Restoring your presence...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Cinematic Header Section */}
      <div className="relative h-[22rem] sm:h-[26rem] -mx-4 sm:mx-0 overflow-hidden sm:rounded-[4rem] group">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/40 to-black/30" />
        
        {/* Floating Actions */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/profile/edit')} 
            className="p-4 glass-panel rounded-2xl text-white border-white/10 hover:bg-white/20 transition-all shadow-xl"
          >
            <Settings size={22} />
          </motion.button>
          <div className="flex gap-4">
            <Link to="/profile/edit">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 glass-panel rounded-2xl text-white border-white/10 hover:bg-white/20 transition-all shadow-xl"
              >
                <Edit3 size={22} />
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout} 
              className="p-4 bg-rose-500/20 backdrop-blur-xl rounded-2xl text-rose-400 border border-rose-500/30 hover:bg-rose-500/40 transition-all shadow-xl shadow-rose-500/10"
            >
              <LogOut size={22} />
            </motion.button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-12 left-8 right-8 flex flex-col sm:flex-row items-center sm:items-end gap-8 z-10">
          <div className="relative">
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-[3.5rem] p-1.5 bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full rounded-[3.2rem] border-[6px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-7 h-7 bg-green-500 border-[5px] border-[#050506] rounded-full shadow-lg" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3 pb-2">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">{profile.display_name || profile.username}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <p className="text-rose-400 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2">
                  <Sparkles size={12} className="animate-pulse" />
                  @{profile.username}
                </p>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                  <ShieldCheck size={12} className="text-blue-400" />
                  Sanctuary Guardian
                </p>
              </div>
            </div>
            <p className="text-gray-300 font-handwritten text-2xl italic opacity-90 max-w-lg leading-relaxed">
              "{profile.bio || 'Living in our private universe...'}"
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="px-2 mt-12 space-y-12">
        {/* Statistics & Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Heart} value={profile.relationship_status || 'In Love'} label="Status" color="text-rose-400" />
          <StatCard icon={Calendar} value={new Date(profile.joined_at).getFullYear().toString()} label="Since" color="text-blue-400" />
          <StatCard icon={Grid} value={posts.length.toString()} label="Memories" color="text-purple-400" />
          <StatCard icon={Award} value="Gold Soul" label="Level" color="text-orange-400" />
        </div>

        {/* Content Tabs */}
        <div className="space-y-8">
          <div className="flex gap-4 p-1.5 bg-white/[0.03] rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-inner">
            <TabButton active={activeTab === 'memories'} onClick={() => setActiveTab('memories')} icon={Grid} label="Our Memories" />
            <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={ImageIcon} label="The Gallery" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.length > 0 ? (
              posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden premium-card p-0 border-white/5 hover:border-rose-500/20 group shadow-2xl"
                >
                  <img 
                    src={post.post_photos?.[0]?.image_url || `https://picsum.photos/seed/${post.id}/400/400`} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center premium-card border-dashed border-2 opacity-50 space-y-6">
                <div className="p-8 bg-rose-500/5 rounded-full w-fit mx-auto">
                  <ImageIcon size={64} strokeWidth={1} className="text-rose-400/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-white/80">Silent Archives</h3>
                  <p className="text-sm italic font-medium max-w-xs mx-auto">No shared memories captured yet. Let's create something beautiful.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: any) {
  return (
    <div className="premium-card p-6 flex flex-col items-center gap-3 text-center border-white/5">
      <div className={twMerge("p-3 rounded-2xl bg-white/[0.03] border border-white/5", color)}>
        <Icon size={20} />
      </div>
      <div className="space-y-0.5">
        <p className="text-lg font-bold text-white truncate max-w-[120px]">{value}</p>
        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">{label}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
        active ? "bg-white text-black shadow-2xl shadow-white/10" : "text-gray-500 hover:text-white"
      )}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="tab-pill"
          className="absolute inset-0 bg-white rounded-[2rem] -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
