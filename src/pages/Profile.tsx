import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Heart, Calendar, Edit3, Grid, Image as ImageIcon, 
  Sparkles, LogOut, ShieldCheck, Award, Zap, Phone, Camera, 
  Star, Fingerprint, MapPin, Quote, Smile, Globe, Loader2 
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
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Restoring Presence...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Profile Header */}
      <section className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-soft border border-warm-100 bg-white">
        <img 
          src={profile.cover_url || 'https://images.unsplash.com/photo-1516589174184-c68526614af5?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/profile/edit')} size="sm">
            <Edit3 size={16} className="mr-2" /> Edit Profile
          </Button>
          <Button variant="danger" onClick={handleLogout} size="sm">
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-white shadow-xl relative overflow-hidden">
              <div className="w-full h-full rounded-full bg-warm-50 overflow-hidden flex items-center justify-center border border-warm-100">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                ) : (
                  <User size={64} className="text-warm-200" />
                )}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2 pb-2">
            <div>
              <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-white tracking-tight drop-shadow-md">
                {profile.display_name || profile.full_name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                <span className="text-rose-100 font-bold text-xs flex items-center gap-1.5">
                  <Fingerprint size={14} />
                  @{profile.username}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-emerald-100 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Verified Soul
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-warm-400">Profile Essence</h3>
            <div className="space-y-5">
              <DetailRow icon={Heart} label="Status" value={profile.relationship_status} color="text-rose-600" bg="bg-rose-50" />
              <DetailRow icon={Smile} label="Solar Return" value={profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'N/A'} color="text-orange-600" bg="bg-orange-50" />
              <DetailRow icon={MapPin} label="Coordinates" value={profile.location || 'The Sanctuary'} color="text-emerald-600" bg="bg-emerald-50" />
              <DetailRow icon={Quote} label="Favorite Quote" value={profile.favorite_quote || 'No words needed.'} color="text-purple-600" bg="bg-purple-50" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-4">Essence Story</h3>
            <p className="text-sm font-medium text-warm-600 leading-relaxed italic">
              "{profile.bio || 'In the frequency of love and shared moments...'}"
            </p>
          </Card>
        </div>

        {/* Right Column: Memories */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 p-1 bg-warm-50 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('memories')}
              className={twMerge(
                "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === 'memories' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
              )}
            >
              Archive
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={twMerge(
                "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === 'stats' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
              )}
            >
              Stats
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'memories' ? (
              <motion.div 
                key="memories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {posts.length > 0 ? (
                  posts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="aspect-square rounded-2xl overflow-hidden group relative border border-warm-100 bg-warm-50 shadow-sm"
                    >
                      <img 
                        src={post.post_photos?.[0]?.image_url} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest truncate">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-3xl border border-dashed border-warm-200">
                    <ImageIcon size={48} className="mx-auto text-warm-200" strokeWidth={1} />
                    <p className="text-sm font-bold text-warm-400">The archive is silent.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <StatBox label="Memories shared" value={posts.length} color="text-rose-600" />
                <StatBox label="Frequency established" value={new Date(profile.joined_at).getFullYear()} color="text-blue-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={twMerge("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105", bg, color)}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">{label}</p>
        <p className="text-sm font-bold text-charcoal truncate max-w-[150px]">{value || 'Not set'}</p>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <Card className="p-8 text-center space-y-1">
      <p className={twMerge("text-4xl font-outfit font-bold", color)}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">{label}</p>
    </Card>
  );
}
