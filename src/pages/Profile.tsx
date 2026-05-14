import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Heart, Calendar, Edit3, Grid, Image as ImageIcon, Sparkles, LogOut, ShieldCheck, Award, Zap, Phone, Camera, Star, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-12">
      <div className="relative">
        <div className="w-28 h-28 rounded-[3.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Heart size={40} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-700 font-black uppercase tracking-[1em] animate-pulse italic">Restoring your presence...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-48 space-y-32 sm:space-y-48 relative overflow-hidden">
      {/* Cinematic Header Section */}
      <section className="relative h-[55rem] sm:h-[80rem] -mx-6 sm:mx-0 overflow-hidden sm:rounded-[8rem] group shadow-[0_150px_450px_rgba(0,0,0,0.8)] border-4 border-white/5">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-125 grayscale-[0.2] group-hover:grayscale-0 brightness-[0.4] group-hover:brightness-[0.6]"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        {/* Floating Actions */}
        <div className="absolute top-24 left-24 right-24 flex justify-between items-center z-40">
          <Button 
            onClick={() => navigate('/profile/edit')} 
            className="rounded-[4rem] p-16 h-auto aspect-square bg-white/[0.01] hover:bg-white/15 border-4 border-white/10 backdrop-blur-[150px] group/settings shadow-3xl shadow-inner"
          >
            <Settings size={64} strokeWidth={1} className="group-hover/settings:rotate-180 transition-all duration-[2000ms]" />
          </Button>
          <div className="flex gap-12">
            <Button 
              onClick={() => navigate('/profile/edit')}
              className="rounded-[4rem] p-16 h-auto aspect-square bg-white/[0.01] hover:bg-white/15 border-4 border-white/10 backdrop-blur-[150px] shadow-3xl shadow-inner"
            >
              <Edit3 size={64} strokeWidth={1} />
            </Button>
            <Button 
              onClick={handleLogout} 
              className="rounded-[4rem] p-16 h-auto aspect-square bg-rose-500/10 hover:bg-rose-500/25 border-4 border-rose-500/20 text-rose-500 backdrop-blur-[150px] shadow-3xl shadow-inner"
            >
              <LogOut size={64} strokeWidth={1} />
            </Button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-32 left-24 right-24 flex flex-col sm:flex-row items-center sm:items-end gap-24 z-30">
          <div className="relative group/avatar">
            <div className="w-[25rem] h-[25rem] sm:w-[35rem] sm:h-[35rem] rounded-[10rem] p-3 bg-gradient-to-tr from-rose-600 via-orange-500 to-rose-600 shadow-[0_100px_250px_rgba(0,0,0,1)] group-hover/avatar:scale-110 transition-all duration-[2000ms] shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 blur-[50px] opacity-0 group-hover/avatar:opacity-100 transition-all duration-[2000ms]" />
              <div className="w-full h-full rounded-[9.5rem] border-[16px] border-[#050506] overflow-hidden bg-[#0a0a0c] relative z-10">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover/avatar:scale-125"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-16 right-16 w-16 h-16 bg-green-500 border-[10px] border-[#050506] rounded-full shadow-[0_0_80px_rgba(34,197,94,1)] animate-pulse z-20" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-16 pb-12">
            <div className="space-y-10">
              <h1 className="text-8xl sm:text-[14rem] font-serif glow-text leading-none tracking-tighter italic text-white drop-shadow-3xl">{profile.display_name || profile.username}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-12">
                <div className="flex items-center gap-6 text-rose-500 font-black uppercase tracking-[1em] text-[18px] italic">
                  <Sparkles size={48} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
                  @{profile.username}
                </div>
                <div className="w-5 h-5 rounded-full bg-gray-950 shadow-inner" />
                <div className="flex items-center gap-6 text-gray-950 font-black uppercase tracking-[1em] text-[18px] italic">
                  <ShieldCheck size={48} strokeWidth={1} className="text-blue-500 drop-shadow-2xl" />
                  Sanctuary Guardian
                </div>
              </div>
            </div>
            <p className="text-gray-800 font-handwritten text-[7rem] sm:text-[9rem] italic opacity-90 max-w-6xl leading-none selection:bg-rose-500/40 drop-shadow-2xl">
              "{profile.bio || 'Living in our private universe...'}"
            </p>
          </div>
        </div>
      </section>

      {/* Main Profile Content */}
      <div className="px-6 sm:px-0 mt-32 space-y-32">
        {/* Statistics & Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 sm:gap-24 relative z-20">
          <StatCard icon={Heart} value={profile.relationship_status || 'In Love'} label="Status" color="text-rose-500" />
          <StatCard icon={Calendar} value={new Date(profile.joined_at).getFullYear().toString()} label="Since" color="text-blue-500" />
          <StatCard icon={Grid} value={posts.length.toString()} label="Memories" color="text-purple-500" />
          <StatCard icon={Award} value="Gold Soul" label="Level" color="text-orange-500" />
        </div>

        {/* Content Tabs */}
        <div className="space-y-32 relative z-10 pt-16">
          <div className="flex gap-16 p-4 bg-white/[0.01] rounded-[6rem] border-4 border-white/5 backdrop-blur-[100px] shadow-inner max-w-4xl mx-auto sm:mx-0 shadow-3xl">
            <TabButton active={activeTab === 'memories'} onClick={() => setActiveTab('memories')} icon={Grid} label="Shared Archive" />
            <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={ImageIcon} label="The Gallery" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 sm:gap-32">
            <AnimatePresence mode="popLayout">
              {posts.length > 0 ? (
                posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(60px)' }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: "-100px" }}
                    exit={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(60px)' }}
                    transition={{ delay: i * 0.08, duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card
                      className="aspect-square rounded-[7rem] sm:rounded-[9rem] overflow-hidden p-0 border-4 border-white/5 hover:border-rose-500/60 group shadow-[0_150px_450px_rgba(0,0,0,1)] relative shadow-inner group cursor-pointer"
                    >
                      <img 
                        src={post.post_photos?.[0]?.image_url || `https://picsum.photos/seed/${post.id}/1200/1200`} 
                        className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-150 grayscale-[0.4] group-hover:grayscale-0 brightness-[0.7] group-hover:brightness-[1]"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[1500ms] flex flex-col justify-end p-20 sm:p-32">
                        <div className="translate-y-20 group-hover:translate-y-0 transition-all duration-[1500ms] space-y-12">
                          <div className="flex items-center gap-10 text-rose-500 font-black uppercase tracking-[1em] text-[16px] mb-6 italic">
                            <Camera size={64} strokeWidth={1} className="drop-shadow-3xl" />
                            Captured
                          </div>
                          <p className="text-6xl font-serif italic text-white tracking-tighter leading-none drop-shadow-3xl">
                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <div className="flex gap-12 pt-10">
                             <Heart size={64} strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-3xl shadow-rose-500 shadow-2xl" />
                             <Star size={64} strokeWidth={1} className="text-orange-500 fill-orange-500 animate-pulse delay-[500ms] drop-shadow-3xl shadow-orange-500 shadow-2xl" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-[20rem] text-center border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] rounded-[9rem] shadow-inner backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)]">
                  <div className="p-32 bg-rose-500/[0.03] rounded-[7rem] w-fit mx-auto border-4 border-rose-500/10 shadow-inner mb-16">
                    <ImageIcon size={400} strokeWidth={0.05} className="text-rose-500/10 drop-shadow-3xl" />
                  </div>
                  <div className="space-y-16 px-24">
                    <h3 className="text-8xl sm:text-[11rem] font-serif text-white/90 tracking-tighter italic leading-none">Silent Archives</h3>
                    <p className="text-[7rem] italic font-handwritten max-w-5xl mx-auto opacity-60 leading-none text-gray-800 selection:bg-rose-500/40">"The vault is echoing with potential. Share our first memory to begin the collection."</p>
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
    <Card className="p-16 sm:p-32 flex flex-col items-center gap-12 text-center border-4 border-white/5 bg-white/[0.01] group hover:bg-white/[0.06] transition-all duration-[1500ms] backdrop-blur-[120px] rounded-[6rem] shadow-[0_150px_450px_rgba(0,0,0,1)] shadow-inner group">
      <div className={twMerge("p-16 rounded-[4.5rem] bg-white/[0.01] transition-all duration-[2000ms] group-hover:scale-125 group-hover:rotate-[20deg] shadow-[0_60px_150px_rgba(0,0,0,1)] border-4 border-white/5 relative z-10 shadow-inner", color)}>
        <Icon size={128} strokeWidth={0.1} className="drop-shadow-3xl fill-current" />
      </div>
      <div className="space-y-10">
        <p className="text-6xl sm:text-[8rem] font-serif text-white truncate max-w-[400px] tracking-tighter italic leading-none drop-shadow-2xl">{value}</p>
        <p className="text-[18px] text-gray-950 font-black uppercase tracking-[1em] italic opacity-40 group-hover:opacity-100 transition-all duration-[1500ms]">{label}</p>
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "flex-1 flex items-center justify-center gap-12 py-12 rounded-[5rem] text-[18px] font-black uppercase tracking-[0.8em] transition-all duration-[1000ms] relative z-10 italic shadow-inner group",
        active ? "text-gray-950" : "text-gray-800 hover:text-white"
      )}
    >
      <Icon size={64} strokeWidth={active ? 1 : 0.5} className="transition-all duration-[1500ms] group-hover:scale-125 group-hover:rotate-[15deg] drop-shadow-3xl" />
      <span>{label}</span>
      {active && (
        <motion.div 
          layoutId="tab-pill-profile"
          className="absolute inset-0 bg-white rounded-[5rem] -z-10 shadow-[0_40px_100px_rgba(255,255,255,0.4)]"
          transition={{ type: "spring", bounce: 0.2, duration: 1.5 }}
        />
      )}
    </button>
  );
}
