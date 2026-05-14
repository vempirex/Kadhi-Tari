import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, 
  Clock, Music, Camera, MessageCircle, Star, ArrowRight, 
  History, Shield, Globe, Compass, Landmark, Wind, 
  Fingerprint, LayoutGrid, Radio
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Stories from '../components/Stories';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const moods = [
  { id: 'peaceful', icon: Moon, label: 'Ethereal', desc: 'Floating in silence', color: 'text-blue-500', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
  { id: 'chaotic', icon: Zap, label: 'Electric', desc: 'Sparking with energy', color: 'text-yellow-500', bg: 'bg-yellow-500/15', border: 'border-yellow-500/20' },
  { id: 'sleepy', icon: Coffee, label: 'Dreaming', desc: 'Sinking into clouds', color: 'text-purple-500', bg: 'bg-purple-500/15', border: 'border-purple-500/20' },
  { id: 'low', icon: Battery, label: 'Dimmed', desc: 'Recharging souls', color: 'text-rose-500', bg: 'bg-rose-500/15', border: 'border-rose-500/20' },
  { id: 'movie', icon: Sun, label: 'Cinematic', desc: 'Golden hour vibes', color: 'text-orange-500', bg: 'bg-orange-500/15', border: 'border-orange-500/20' },
];

export default function Home() {
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [stats, setStats] = useState({ memories: 0, letters: 0, daysTogether: 0 });
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    let profileData = null;
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profileData = data;
      setProfile(data);
    }

    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: letterCount } = await supabase.from('letters').select('*', { count: 'exact', head: true });
    
    const anniversary = profileData?.anniversary ? new Date(profileData.anniversary) : new Date('2024-01-01');
    const diff = Math.floor((new Date().getTime() - anniversary.getTime()) / (1000 * 60 * 60 * 24));

    setStats({
      memories: postCount || 0,
      letters: letterCount || 0,
      daysTogether: diff > 0 ? diff : 0
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.display_name?.split(' ')[0] || 'Soulmate';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <div className="space-y-16 pb-32">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Hero Greeting */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-4xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] italic">
          <Star size={16} fill="currentColor" />
          <span>Our Sacred Sanctuary</span>
        </div>
        <h1 className="text-7xl sm:text-9xl font-serif italic text-white drop-shadow-2xl">
          {getGreeting()} <span className="inline-block animate-bounce text-rose-500">🌻</span>
        </h1>
        <p className="text-gray-400 font-handwritten text-4xl sm:text-5xl italic opacity-80">
          "The sanctuary is breathing peacefully today... everything is in harmony."
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-500" />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-500" />
        <StatCard label="Days" value={stats.daysTogether} icon={Globe} color="text-blue-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4">
        {/* Today's Vibe */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <Sparkles size={24} className="text-rose-500" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Current Frequency</h2>
          </div>
          
          <Card variant="glass" className="p-12 flex flex-col items-center gap-12 relative group min-h-[400px] justify-center overflow-hidden">
            <motion.div 
              key={currentMood.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={twMerge(
                "p-12 rounded-[4rem] transition-all relative z-10 border-4", 
                currentMood.bg, currentMood.color, currentMood.border
              )}
            >
              <currentMood.icon size={120} className="drop-shadow-2xl animate-pulse" />
            </motion.div>
            
            <div className="text-center space-y-2 relative z-10">
              <p className="text-[12px] text-white/40 font-black uppercase tracking-widest italic">{currentMood.desc}</p>
              <p className="text-7xl font-serif italic text-white drop-shadow-2xl">{currentMood.label}</p>
            </div>
          </Card>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setCurrentMood(mood)}
                className={twMerge(
                  "flex-shrink-0 px-6 py-4 rounded-[2rem] transition-all flex flex-col items-center gap-3 border min-w-[140px]",
                  currentMood.id === mood.id 
                    ? "border-rose-500/60 bg-rose-500/20 text-rose-500" 
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
                )}
              >
                <mood.icon size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest italic">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Portals */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-4">
            <Zap size={24} className="text-blue-500" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Universal Portals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <QuickPortal icon={LayoutGrid} label="Archive" value="Memories" color="text-rose-500" path="/feed" />
            <QuickPortal icon={MessageCircle} label="Whispers" value="Sanctuary" color="text-blue-500" path="/chat" />
          </div>

          <Link to="/playlist" className="block group pt-4">
            <Card variant="glass" className="p-8 flex items-center gap-8 hover:bg-white/5 transition-all">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center">
                <Music size={48} className="text-white drop-shadow-xl" strokeWidth={1} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-4xl font-serif italic text-white leading-none">Shared Rhythm</p>
                <p className="text-[11px] text-white/40 font-black uppercase tracking-widest italic">Our current frequency pulse</p>
              </div>
              <ArrowRight size={32} className="text-white/20 group-hover:text-white transition-colors" />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card variant="glass" className="p-8 flex flex-col items-center gap-4 group hover:bg-white/5 transition-all">
      <div className={twMerge("p-4 rounded-3xl bg-white/[0.02] border border-white/5 transition-transform group-hover:scale-110", color)}>
        <Icon size={40} />
      </div>
      <div className="text-center">
        <p className="text-6xl font-serif italic text-white drop-shadow-2xl leading-none">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic mt-2">{label}</p>
      </div>
    </Card>
  );
}

function QuickPortal({ icon: Icon, label, value, color, path }: any) {
  return (
    <Link to={path} className="block h-full">
      <Card variant="glass" className="p-8 h-full flex flex-col justify-between hover:bg-white/5 transition-all min-h-[220px]">
        <div className={twMerge("p-4 w-fit rounded-3xl bg-white/[0.02] border border-white/5 transition-transform group-hover:scale-110", color)}>
          <Icon size={40} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{label}</p>
          <div className="flex items-center justify-between">
            <p className="text-5xl font-serif italic text-white drop-shadow-2xl leading-none">{value}</p>
            <ArrowRight size={24} className="text-white/20" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
