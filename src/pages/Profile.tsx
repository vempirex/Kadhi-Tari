import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Heart, Calendar, Edit3, Grid, Image as ImageIcon, 
  Sparkles, LogOut, ShieldCheck, Award, Zap, Phone, Camera, 
  Star, Fingerprint, MapPin, Quote, Smile, Globe 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Profile {
  username: string;
  display_name: string;
  full_name: string;
  avatar_url: string;
  cover_url: string;
  bio: string;
  relationship_status: string;
  favorite_quote: string;
  joined_at: string;
  anniversary: string;
  birthday: string;
  location: string;
  interests: string;
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
      <p className="text-[14px] text-gray-400 font-black uppercase tracking-[1em] animate-pulse italic">Restoring your presence...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-48 space-y-16 relative overflow-hidden px-4">
      {/* Premium Profile Header */}
      <section className="relative h-[60rem] rounded-[4rem] overflow-hidden group shadow-2xl border border-white/5">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[10000ms] group-hover:scale-110"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Actions */}
        <div className="absolute top-12 left-12 right-12 flex justify-between items-center z-40">
          <div className="flex gap-4">
            <Button variant="glass" onClick={() => navigate('/profile/edit')} className="p-8 h-auto aspect-square rounded-[2rem]">
              <Settings size={32} />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="glass" onClick={() => navigate('/profile/edit')} className="p-8 h-auto aspect-square rounded-[2rem]">
              <Edit3 size={32} />
            </Button>
            <Button variant="glass" onClick={handleLogout} className="p-8 h-auto aspect-square rounded-[2rem] text-rose-500">
              <LogOut size={32} />
            </Button>
          </div>
        </div>

        {/* Profile Content Overlay */}
        <div className="absolute bottom-12 left-12 right-12 flex flex-col sm:flex-row items-center sm:items-end gap-12 z-30">
          <div className="relative group/avatar">
            <div className="w-[20rem] h-[20rem] sm:w-[28rem] sm:h-[28rem] rounded-[5rem] p-1 bg-gradient-to-tr from-rose-500 to-orange-500 shadow-2xl relative overflow-hidden">
              <div className="w-full h-full rounded-[4.8rem] bg-black overflow-hidden flex items-center justify-center">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover/avatar:scale-110"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-500 border-4 border-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-6 pb-4">
            <div className="space-y-2">
              <h1 className="text-7xl sm:text-9xl font-serif italic text-white drop-shadow-2xl">{profile.display_name || profile.full_name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <span className="text-rose-500 font-black uppercase tracking-[0.5em] text-[12px] italic flex items-center gap-2">
                  <Fingerprint size={24} />
                  @{profile.username}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[12px] italic flex items-center gap-2">
                  <ShieldCheck size={24} />
                  Verified Soul
                </span>
              </div>
            </div>
            <p className="text-gray-400 font-handwritten text-4xl sm:text-5xl italic max-w-3xl">
              "{profile.bio || 'In the frequency of love...'}"
            </p>
          </div>
        </div>
      </section>

      {/* Profile Details & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-12">
          {/* Details Card */}
          <Card variant="glass" className="p-12 space-y-12">
            <h3 className="text-4xl font-serif italic text-white/90 px-4">Profile Essence</h3>
            <div className="space-y-8 px-4 pb-4">
              <DetailRow icon={Heart} label="Status" value={profile.relationship_status} color="text-rose-500" />
              <DetailRow icon={Calendar} label="Anniversary" value={profile.anniversary ? new Date(profile.anniversary).toLocaleDateString() : 'N/A'} color="text-rose-500" />
              <DetailRow icon={Smile} label="Solar Return" value={profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'N/A'} color="text-orange-500" />
              <DetailRow icon={MapPin} label="Coordinates" value={profile.location || 'The Void'} color="text-emerald-500" />
              <DetailRow icon={Globe} label="Frequencies" value={profile.interests || 'Music & Stars'} color="text-blue-500" />
              <DetailRow icon={Quote} label="Echo" value={profile.favorite_quote || 'No words needed.'} color="text-purple-500" />
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-8">
            <Card variant="glass" className="p-8 text-center space-y-2">
              <p className="text-5xl font-serif text-white">{posts.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Memories</p>
            </Card>
            <Card variant="glass" className="p-8 text-center space-y-2">
              <p className="text-5xl font-serif text-white">{new Date(profile.joined_at).getFullYear()}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Established</p>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          {/* Memories Grid */}
          <div className="space-y-8">
            <div className="flex gap-4 p-2 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-3xl w-fit">
              <button 
                onClick={() => setActiveTab('memories')}
                className={twMerge(
                  "px-8 py-3 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest italic transition-all",
                  activeTab === 'memories' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                Shared Archive
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={twMerge(
                  "px-8 py-3 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest italic transition-all",
                  activeTab === 'gallery' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                Gallery
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {posts.length > 0 ? (
                  posts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-square rounded-[3rem] overflow-hidden group relative border border-white/5"
                    >
                      <img 
                        src={post.post_photos?.[0]?.image_url || `https://picsum.photos/seed/${post.id}/800/800`} 
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[3000ms] group-hover:scale-110"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                        <p className="text-3xl font-serif italic text-white truncate">{post.content || 'A memory...'}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-48 text-center space-y-6 bg-white/[0.01] rounded-[4rem] border-2 border-dashed border-white/5">
                    <ImageIcon size={120} className="mx-auto text-white/5" strokeWidth={0.5} />
                    <p className="text-3xl font-serif italic text-white/20">The archive is silent.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <div className={twMerge("p-3 rounded-2xl bg-white/[0.02] border border-white/5 transition-transform group-hover:scale-110", color)}>
        <Icon size={24} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{label}</p>
        <p className="text-2xl font-serif italic text-white truncate max-w-[200px]">{value || 'Unknown'}</p>
      </div>
    </div>
  );
}
