import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock, Music, Camera, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Stories from '../components/Stories';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

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
    
    setStats({
      memories: postCount || 0,
      letters: letterCount || 0,
      daysTogether: 124 // Logic for calculating days since anniversary can be added here
    });
  };

  const greeting = () => {
    const hour = new Date().getHours();
    const name = profile?.display_name?.split(' ')[0] || 'Soulmate';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Hero Greeting */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-2xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] mb-2 backdrop-blur-md">
          <Star size={10} fill="currentColor" className="animate-pulse" />
          Our Little Universe
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">
          {greeting()} <span className="inline-block animate-float">🌻</span>
        </h1>
        <p className="text-gray-400 font-handwritten text-xl sm:text-2xl italic opacity-80">
          Your sanctuary is ready for more memories...
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-400" />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-400" />
        <StatCard label="Days" value={stats.daysTogether} icon={Clock} color="text-blue-400" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Today's Vibe */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Sparkles size={18} />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Today's Vibe</h2>
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Tap to sync</span>
          </div>
          
          <div className="premium-card p-10 flex flex-col items-center gap-8 relative overflow-hidden group min-h-[320px] justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            
            <motion.div 
              key={currentMood.id}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={twMerge(
                "p-8 rounded-[3rem] shadow-2xl transition-all duration-700 relative z-10", 
                currentMood.bg, currentMood.color, currentMood.border, "border-2"
              )}
            >
              <currentMood.icon size={64} strokeWidth={1.5} className="drop-shadow-2xl" />
              <div className="absolute -inset-4 bg-inherit opacity-20 blur-2xl rounded-full -z-10" />
            </motion.div>
            
            <div className="text-center space-y-2 relative z-10">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Current Frequency</p>
              <p className="text-4xl font-serif font-bold text-white tracking-tight">{currentMood.label}</p>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMood(mood)}
                className={twMerge(
                  "flex-shrink-0 px-6 py-5 rounded-[2rem] text-sm transition-all flex flex-col items-center gap-4 border-2 min-w-[100px]",
                  currentMood.id === mood.id 
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-xl shadow-rose-500/10" 
                    : "bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10"
                )}
              >
                <mood.icon size={24} strokeWidth={currentMood.id === mood.id ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Portals & Music */}
        <div className="space-y-12">
          {/* Quick Access */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Zap size={18} />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Sanctuary Portals</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <QuickPortal icon={Heart} label="Memory Lane" value="Browse Feed" color="text-rose-400" path="/feed" />
              <QuickPortal icon={MessageCircle} label="Whisper Room" value="Our Chat" color="text-blue-400" path="/chat" />
            </div>
          </section>

          {/* Current Rhythm */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Music size={18} />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Our Rhythm</h2>
              </div>
              <Link to="/playlist" className="text-[10px] text-rose-400 font-bold uppercase tracking-widest hover:underline flex items-center gap-1.5">
                Open Player <ArrowRight size={10} />
              </Link>
            </div>
            <Link to="/playlist" className="block">
              <div className="premium-card p-6 flex items-center gap-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-[3px] bg-[#0a0a0c] rounded-[13px] flex items-center justify-center overflow-hidden border border-white/10">
                    <Music size={32} className="text-rose-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                    {/* Visualizer Mock */}
                    <div className="absolute bottom-2 left-0 right-0 h-4 flex items-end justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      {[1,2,3,4].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: ['4px', '12px', '6px'] }}
                          transition={{ duration: 0.5 + i*0.1, repeat: Infinity }}
                          className="w-1 bg-rose-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <p className="font-bold text-xl text-white truncate group-hover:text-rose-400 transition-colors">Shared Anthem</p>
                  <p className="text-sm text-gray-400 font-handwritten italic truncate">"Dancing in the moonlight... 🌙"</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500" 
                      animate={{ width: ['30%', '75%', '30%'] }} 
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] flex flex-col items-center gap-3 border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
      <div className={twMerge("p-2.5 rounded-xl bg-white/5 transition-transform group-hover:scale-110", color)}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <p className="text-2xl sm:text-3xl font-serif font-black tracking-tight">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</p>
    </div>
  );
}

function QuickPortal({ icon: Icon, label, value, color, path }: any) {
  return (
    <Link to={path} className="block h-full">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className="premium-card p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={16} className="text-white/20" />
        </div>
        <div className={twMerge("p-4 w-fit rounded-2xl bg-white/5 transition-all group-hover:scale-110 group-hover:bg-white/10", color)}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="space-y-1.5 mt-8">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black leading-none">{label}</p>
          <p className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-rose-400 transition-colors">{value}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass-card p-4 rounded-[2rem] flex flex-col items-center gap-2 border-white/5 hover:bg-white/10 transition-all">
      <Icon size={16} className={color} />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">{label}</p>
    </div>
  );
}

function QuickPortal({ icon: Icon, label, value, color, path }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="premium-card p-6 aspect-square flex flex-col justify-between group cursor-pointer"
    >
      <div className={twMerge("p-3 w-fit rounded-2xl bg-white/5 transition-all group-hover:scale-110", color)}>
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</p>
        <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{value}</p>
      </div>
    </motion.div>
  );
}
