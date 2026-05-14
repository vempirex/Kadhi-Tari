import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock, Music, Camera, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Stories from '../components/Stories';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';

const moods = [
  { id: 'peaceful', icon: Moon, label: 'Peaceful', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'chaotic', icon: Zap, label: 'Chaotic', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'sleepy', icon: Coffee, label: 'Sleepy', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'low', icon: Battery, label: 'Low Power', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'movie', icon: Sun, label: 'Movie Mood', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
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
    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);
    }

    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: letterCount } = await supabase.from('letters').select('*', { count: 'exact', head: true });
    
    // Anniversary logic
    const anniversary = profile?.anniversary ? new Date(profile.anniversary) : new Date('2024-01-01');
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
    <div className="space-y-12 sm:space-y-20 pb-24">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Hero Greeting */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-3xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] backdrop-blur-md">
          <Star size={10} fill="currentColor" className="animate-pulse" />
          Our Sacred Universe
        </div>
        <h1 className="text-5xl sm:text-7xl font-serif glow-text leading-[1.1] tracking-tight">
          {getGreeting()} <span className="inline-block animate-float">🌻</span>
        </h1>
        <p className="text-gray-400 font-handwritten text-2xl sm:text-3xl italic opacity-80">
          The sanctuary is peaceful today...
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-400" />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-400" />
        <StatCard label="Days" value={stats.daysTogether} icon={Clock} color="text-blue-400" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
        {/* Today's Vibe */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 shadow-xl shadow-rose-500/5">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">Our Frequency</h2>
            </div>
          </div>
          
          <Card className="p-12 flex flex-col items-center gap-10 relative group min-h-[380px] justify-center overflow-hidden">
            <motion.div 
              key={currentMood.id}
              initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={twMerge(
                "p-10 rounded-[3.5rem] shadow-2xl transition-all duration-700 relative z-10 border-4", 
                currentMood.bg, currentMood.color, currentMood.border
              )}
            >
              <currentMood.icon size={80} strokeWidth={1.5} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
              <div className="absolute -inset-8 bg-inherit opacity-30 blur-[40px] rounded-full -z-10 animate-pulse" />
            </motion.div>
            
            <div className="text-center space-y-3 relative z-10">
              <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em]">Current Vibe</p>
              <p className="text-5xl font-serif font-bold text-white tracking-tight">{currentMood.label}</p>
            </div>
          </Card>
          
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMood(mood)}
                className={twMerge(
                  "flex-shrink-0 px-8 py-6 rounded-[2.5rem] text-sm transition-all flex flex-col items-center gap-5 border-2 min-w-[120px]",
                  currentMood.id === mood.id 
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-2xl shadow-rose-500/10" 
                    : "bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10"
                )}
              >
                <mood.icon size={28} strokeWidth={currentMood.id === mood.id ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Portals & Music */}
        <div className="space-y-16">
          <section className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                <Zap size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">Portals</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <QuickPortal icon={Heart} label="Memory Lane" value="Archives" color="text-rose-400" path="/feed" />
              <QuickPortal icon={MessageCircle} label="Whispers" value="Sanctuary" color="text-blue-400" path="/chat" />
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                  <Music size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">Our Rhythm</h2>
              </div>
              <Link to="/playlist" className="text-[10px] text-rose-400 font-black uppercase tracking-[0.3em] hover:underline flex items-center gap-2">
                Launch <ArrowRight size={12} />
              </Link>
            </div>
            
            <Link to="/playlist">
              <Card className="p-8 flex items-center gap-8 group">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-purple-600/30 rounded-3xl animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-1 bg-[#0a0a0c] rounded-[1.4rem] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
                    <Music size={36} className="text-rose-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <p className="font-black text-2xl text-white truncate group-hover:text-rose-400 transition-colors">Shared Anthem</p>
                  <p className="text-base text-gray-400 font-handwritten italic truncate opacity-80">"Melodies of our universe..."</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500" 
                      animate={{ width: ['30%', '85%', '30%'] }} 
                      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-panel p-8 rounded-[3rem] flex flex-col items-center gap-4 border-white/5 hover:bg-white/10 transition-all group shadow-xl">
      <div className={twMerge("p-3.5 rounded-2xl bg-white/5 transition-transform group-hover:scale-110", color)}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <p className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">{value}</p>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickPortal({ icon: Icon, label, value, color, path }: any) {
  return (
    <Link to={path} className="h-full">
      <Card className="p-8 h-full flex flex-col justify-between group">
        <div className={twMerge("p-4 w-fit rounded-2xl bg-white/5 transition-all group-hover:scale-110 group-hover:bg-white/10", color)}>
          <Icon size={26} strokeWidth={2.5} />
        </div>
        <div className="space-y-2 mt-10">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">{label}</p>
          <p className="text-xl font-serif font-bold text-white group-hover:text-rose-400 transition-colors">{value}</p>
        </div>
      </Card>
    </Link>
  );
}
