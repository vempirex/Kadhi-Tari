import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Heart, Calendar, Edit3, Grid, Image as ImageIcon, Sparkles, LogOut, ShieldCheck, Award, Zap, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Heart size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Restoring your presence...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Cinematic Header Section */}
      <section className="relative h-[28rem] sm:h-[35rem] -mx-4 sm:mx-0 overflow-hidden sm:rounded-[4rem] group shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-0" />
        
        {/* Floating Actions */}
        <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-30">
          <Button 
            variant="glass"
            size="sm"
            onClick={() => navigate('/profile/edit')} 
            className="rounded-2xl p-4 h-auto aspect-square"
          >
            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </Button>
          <div className="flex gap-4">
            <Button 
              variant="glass"
              size="sm"
              onClick={() => navigate('/profile/edit')}
              className="rounded-2xl p-4 h-auto aspect-square"
            >
              <Edit3 size={22} />
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLogout} 
              className="rounded-2xl p-4 h-auto aspect-square border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
            >
              <LogOut size={22} />
            </Button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-16 left-10 right-10 flex flex-col sm:flex-row items-center sm:items-end gap-10 z-20">
          <div className="relative group/avatar">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-[4rem] p-1.5 bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 shadow-[0_30px_80px_rgba(0,0,0,0.6)] group-hover/avatar:scale-105 transition-transform duration-700">
              <div className="w-full h-full rounded-[3.8rem] border-[8px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-5 right-5 w-8 h-8 bg-green-500 border-[6px] border-[#050506] rounded-full shadow-2xl" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-6 pb-4">
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl font-serif glow-text leading-none tracking-tight">{profile.display_name || profile.username}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-6">
                <div className="flex items-center gap-2.5 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
                  <Sparkles size={12} className="animate-pulse" />
                  @{profile.username}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                <div className="flex items-center gap-2.5 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
                  <ShieldCheck size={12} className="text-blue-400" />
                  Sanctuary Guardian
                </div>
              </div>
            </div>
            <p className="text-gray-300 font-handwritten text-3xl italic opacity-90 max-w-2xl leading-relaxed">
              "{profile.bio || 'Living in our private universe...'}"
            </p>
          </div>
        </div>
      </section>

      {/* Main Profile Content */}
      <div className="px-2 sm:px-0 mt-16 space-y-16">
        {/* Statistics & Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatCard icon={Heart} value={profile.relationship_status || 'In Love'} label="Status" color="text-rose-400" />
          <StatCard icon={Calendar} value={new Date(profile.joined_at).getFullYear().toString()} label="Since" color="text-blue-400" />
          <StatCard icon={Grid} value={posts.length.toString()} label="Memories" color="text-purple-400" />
          <StatCard icon={Award} value="Gold Soul" label="Level" color="text-orange-400" />
        </div>

        {/* Content Tabs */}
        <div className="space-y-10">
          <div className="flex gap-6 p-2 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-inner">
            <TabButton active={activeTab === 'memories'} onClick={() => setActiveTab('memories')} icon={Grid} label="Shared Archive" />
            <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={ImageIcon} label="The Gallery" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            <AnimatePresence mode="popLayout">
              {posts.length > 0 ? (
                posts.map((post, i) => (
                  <Card
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ delay: i * 0.05, type: "spring", damping: 20 }}
                    className="aspect-square rounded-[3rem] sm:rounded-[4rem] overflow-hidden p-0 border-white/5 hover:border-rose-500/30 group shadow-2xl relative"
                  >
                    <img 
                      src={post.post_photos?.[0]?.image_url || `https://picsum.photos/seed/${post.id}/600/600`} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-125"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 sm:p-10">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-2">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] mb-1">Captured</p>
                        <p className="text-sm font-medium text-white/90">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-48 text-center premium-card border-dashed border-2 opacity-50 flex flex-col items-center border-white/5 bg-white/[0.01]">
                  <div className="p-12 bg-rose-500/5 rounded-[3rem] w-fit mx-auto border border-rose-500/10 shadow-inner mb-8">
                    <ImageIcon size={80} strokeWidth={1} className="text-rose-400/20" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif text-white/80 tracking-tight">Silent Archives</h3>
                    <p className="text-lg italic font-handwritten max-w-sm mx-auto opacity-70 leading-relaxed">"The vault is echoing with potential. Share our first memory to begin the collection."</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: any) {
  return (
    <Card className="p-8 sm:p-10 flex flex-col items-center gap-4 text-center border-white/5 bg-white/[0.02] group hover:bg-white/[0.04] transition-all duration-500">
      <div className={twMerge("p-4 rounded-3xl bg-white/[0.03] border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-xl", color)}>
        <Icon size={24} />
      </div>
      <div className="space-y-2">
        <p className="text-xl sm:text-2xl font-serif text-white truncate max-w-[160px] tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">{label}</p>
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "flex-1 flex items-center justify-center gap-4 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all relative z-10",
        active ? "text-black" : "text-gray-500 hover:text-white"
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="tab-pill-profile"
          className="absolute inset-0 bg-white rounded-[2.5rem] -z-10 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
