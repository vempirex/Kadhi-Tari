import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock, Music, Camera, MessageCircle, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import Stories from '../components/Stories';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

const moods = [
  { icon: Moon, label: 'Peaceful', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Zap, label: 'Chaotic', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Coffee, label: 'Sleepy', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Battery, label: 'Low Power', color: 'text-red-400', bg: 'bg-red-500/10' },
  { icon: Sun, label: 'Movie Mood', color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

export default function Home() {
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [stats, setStats] = useState({ memories: 0, letters: 0, daysTogether: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      const { count: letterCount } = await supabase.from('letters').select('*', { count: 'exact', head: true });
      
      // Mock days together or fetch from a profile 'anniversary' date
      setStats({
        memories: postCount || 0,
        letters: letterCount || 0,
        daysTogether: 124 // Example
      });
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, love";
    if (hour < 18) return "Good afternoon, love";
    return "Good evening, love";
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-1000">
      <Stories />

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] mb-2">
          <Star size={10} fill="currentColor" />
          Our Little Universe
        </div>
        <h1 className="text-5xl font-serif glow-text leading-tight">{greeting()} 🌻</h1>
        <p className="text-gray-400 font-handwritten text-2xl italic opacity-80">
          Welcome back to our sanctuary...
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 px-2">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-400" />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-400" />
        <StatCard label="Days" value={stats.daysTogether} icon={Clock} color="text-blue-400" />
      </div>

      {/* Today's Vibe */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-rose-400" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Today's Vibe</h2>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Tap to update</span>
        </div>
        
        <div className="premium-card p-8 flex flex-col items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <motion.div 
            key={currentMood.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={twMerge("p-6 rounded-[2.5rem] shadow-2xl transition-all", currentMood.bg, currentMood.color)}
          >
            <currentMood.icon size={48} strokeWidth={1.5} />
          </motion.div>
          
          <div className="text-center space-y-1 relative z-10">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">You are currently feeling</p>
            <p className="text-3xl font-serif font-bold text-white tracking-tight">{currentMood.label}</p>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentMood(mood)}
              className={twMerge(
                "flex-shrink-0 px-6 py-4 rounded-[1.8rem] text-sm transition-all flex flex-col items-center gap-3 border",
                currentMood.label === mood.label 
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5" 
                  : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
              )}
            >
              <mood.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Zap size={18} className="text-rose-400" />
          <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Quick Portal</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <QuickPortal icon={Heart} label="Last Memory" value="Midnight vibes..." color="text-rose-400" path="/feed" />
          <QuickPortal icon={MessageCircle} label="Recent Chat" value="Check messages" color="text-blue-400" path="/chat" />
        </div>
      </section>

      {/* Shared Playlist Mockup */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Music size={18} className="text-rose-400" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Shared Rhythm</h2>
          </div>
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
        <div className="premium-card p-5 flex items-center gap-5 group cursor-pointer">
          <div className="relative w-20 h-20 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl animate-pulse group-hover:scale-105 transition-transform" />
            <div className="absolute inset-[2px] bg-[#050506] rounded-[14px] flex items-center justify-center">
              <Music size={32} className="text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-bold text-xl text-white group-hover:text-rose-400 transition-colors">Current Anthem</p>
            <p className="text-sm text-gray-400 font-handwritten italic">"Thinking about you 🌙"</p>
            <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
              <motion.div 
                className="h-full bg-rose-500" 
                animate={{ width: ['20%', '80%', '20%'] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
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
