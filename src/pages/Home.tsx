import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock, Music, Camera, MessageCircle, Star, ArrowRight, History, Shield, Globe, Compass, Landmark, Wind, Fingerprint } from 'lucide-react';
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
    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);
    }

    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    const { count: letterCount } = await supabase.from('letters').select('*', { count: 'exact', head: true });
    
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
    <div className="space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      {/* Stories Section */}
      <section className="-mx-6 sm:mx-0 relative z-30">
        <Stories />
      </section>

      {/* Hero Greeting */}
      <motion.header 
        initial={{ opacity: 0, y: 100, filter: 'blur(50px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-16 max-w-7xl mx-auto px-6 relative z-20"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.8 }}
          className="inline-flex items-center gap-10 px-16 py-8 rounded-full bg-white/[0.01] border-2 border-white/5 text-[16px] font-black text-rose-500 uppercase tracking-[1em] backdrop-blur-[60px] shadow-[0_60px_150px_rgba(0,0,0,1)] relative overflow-hidden group shadow-inner italic"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Star size={32} strokeWidth={1} fill="currentColor" className="animate-pulse relative z-10" />
          <span className="relative z-10">Our Sacred Universe</span>
        </motion.div>
        <h1 className="text-8xl sm:text-[14rem] font-serif glow-text leading-[0.85] tracking-tighter italic">
          {getGreeting()} <span className="inline-block animate-float text-rose-500">🌻</span>
        </h1>
        <p className="text-gray-500 font-handwritten text-5xl sm:text-[8rem] italic opacity-80 max-w-5xl mx-auto leading-tight selection:bg-rose-500/40">
          "The sanctuary is breathing peacefully today... every shared frequency resonating in harmony."
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 sm:gap-32 max-w-7xl mx-auto px-6 relative z-20">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-500" index={0} />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-500" index={1} />
        <StatCard label="Days" value={stats.daysTogether} icon={Globe} color="text-blue-500" index={2} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 sm:gap-48 max-w-[1920px] mx-auto px-6 relative z-20">
        {/* Today's Vibe */}
        <section className="space-y-24">
          <div className="flex items-center justify-between px-12">
            <div className="flex items-center gap-12">
              <div className="p-12 rounded-[4.5rem] bg-rose-500/15 text-rose-500 shadow-[0_60px_150px_rgba(244,63,94,0.6)] border-2 border-rose-500/30 backdrop-blur-[60px] animate-pulse shadow-inner">
                <Sparkles size={72} strokeWidth={1} />
              </div>
              <h2 className="text-6xl font-black uppercase tracking-[0.9em] text-white/90 italic">Our Frequency</h2>
            </div>
          </div>
          
          <Card className="p-16 sm:p-32 flex flex-col items-center gap-24 relative group min-h-[850px] justify-center overflow-hidden border-2 border-white/5 bg-white/[0.01] shadow-[0_150px_450px_rgba(0,0,0,1)] backdrop-blur-[120px] shadow-inner rounded-[7rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
            <motion.div 
              key={currentMood.id}
              initial={{ scale: 0.6, opacity: 0, rotate: -30, filter: 'blur(50px)' }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ duration: 2, type: "spring", damping: 12 }}
              className={twMerge(
                "p-32 rounded-[7rem] shadow-[0_150px_350px_rgba(0,0,0,1)] transition-all duration-[2000ms] relative z-10 border-8", 
                currentMood.bg, currentMood.color, currentMood.border
              )}
            >
              <currentMood.icon size={350} strokeWidth={0.1} className="drop-shadow-[0_0_150px_currentColor] animate-float fill-current" />
              <div className="absolute -inset-48 bg-inherit opacity-20 blur-[200px] rounded-full -z-10 animate-pulse" />
            </motion.div>
            
            <div className="text-center space-y-12 relative z-10">
              <p className="text-[20px] text-gray-800 font-black uppercase tracking-[1.2em] mb-8 italic">{currentMood.desc}</p>
              <p className="text-9xl sm:text-[13rem] font-serif font-black text-white tracking-tighter leading-none italic selection:bg-rose-500/40">{currentMood.label}</p>
            </div>
          </Card>
          
          <div className="flex gap-12 overflow-x-auto pb-24 no-scrollbar -mx-6 px-6">
            {moods.map((mood) => (
              <motion.button
                key={mood.id}
                whileHover={{ y: -32, scale: 1.1, filter: 'brightness(1.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMood(mood)}
                className={twMerge(
                  "flex-shrink-0 px-20 py-16 rounded-[6rem] transition-all duration-[1500ms] flex flex-col items-center gap-12 border-2 min-w-[320px] shadow-[0_100px_250px_rgba(0,0,0,1)] relative overflow-hidden group backdrop-blur-[100px]",
                  currentMood.id === mood.id 
                    ? "border-rose-500/60 bg-rose-500/25 text-rose-500 shadow-[0_80px_150px_rgba(244,63,94,0.6)] scale-105" 
                    : "bg-white/[0.01] border-white/5 text-gray-950 hover:bg-white/[0.08] hover:border-white/30 hover:text-gray-800 shadow-inner"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                <mood.icon size={100} strokeWidth={currentMood.id === mood.id ? 1.5 : 0.2} className="relative z-10 drop-shadow-xl" />
                <span className="text-[18px] font-black uppercase tracking-[0.8em] relative z-10 italic">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Portals & Music */}
        <div className="space-y-48">
          <section className="space-y-24">
            <div className="flex items-center gap-12 px-12">
              <div className="p-12 rounded-[4.5rem] bg-blue-500/15 text-blue-500 shadow-[0_60px_150px_rgba(59,130,246,0.6)] border-2 border-blue-500/30 backdrop-blur-[60px] shadow-inner">
                <Zap size={72} strokeWidth={1} />
              </div>
              <h2 className="text-6xl font-black uppercase tracking-[0.9em] text-white/90 italic">Portals</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 sm:gap-32">
              <QuickPortal icon={Camera} label="Memory Lane" value="Archive" color="text-rose-500" path="/feed" />
              <QuickPortal icon={MessageCircle} label="Soul Whispers" value="Sanctuary" color="text-blue-500" path="/chat" />
            </div>
          </section>

          <section className="space-y-24">
            <div className="flex items-center justify-between px-12">
              <div className="flex items-center gap-12">
                <div className="p-12 rounded-[4.5rem] bg-purple-500/15 text-purple-500 shadow-[0_60px_150px_rgba(168,85,247,0.6)] border-2 border-purple-500/30 backdrop-blur-[60px] shadow-inner">
                  <Music size={72} strokeWidth={1} />
                </div>
                <h2 className="text-6xl font-black uppercase tracking-[0.9em] text-white/90 italic">Our Rhythm</h2>
              </div>
              <Link to="/playlist" className="group">
                <Button variant="glass" size="xl" className="rounded-full px-24 h-32 text-[18px] uppercase tracking-[1em] font-black shadow-[0_60px_150px_rgba(0,0,0,1)] border-2 border-white/10 hover:border-white/40 italic shadow-inner">
                  Launch <ArrowRight size={56} strokeWidth={1} className="ml-10 group-hover:translate-x-10 transition-all duration-[1500ms]" />
                </Button>
              </Link>
            </div>
            
            <Link to="/playlist" className="block group">
              <Card className="p-16 sm:p-40 flex flex-col sm:flex-row items-center gap-32 relative overflow-hidden border-2 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] hover:bg-white/[0.04] hover:border-purple-500/60 transition-all duration-[2000ms] backdrop-blur-[120px] shadow-inner rounded-[7rem]">
                <div className="absolute top-[-80%] right-[-30%] w-[120%] h-[300%] bg-purple-500/[0.08] blur-[220px] rounded-full pointer-events-none group-hover:bg-purple-500/[0.12] transition-all duration-[4000ms]" />
                <div className="relative w-[30rem] h-[30rem] flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-700/60 via-purple-800/60 to-blue-700/60 rounded-[6rem] animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity duration-[3000ms]" />
                  <div className="absolute inset-4 bg-[#050506] rounded-[5.5rem] flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-[0_80px_200px_rgba(0,0,0,1)]">
                    <Music size={180} strokeWidth={0.1} className="text-rose-500 group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-[3000ms] drop-shadow-[0_0_80px_rgba(244,63,94,0.8)] fill-current" />
                  </div>
                </div>
                <div className="flex-1 space-y-12 min-w-0 relative z-10 text-center sm:text-left">
                  <p className="font-serif text-8xl sm:text-[10rem] text-white truncate group-hover:text-rose-400 transition-all duration-[1500ms] tracking-tighter italic leading-none">Shared Anthem</p>
                  <p className="text-5xl sm:text-6xl text-gray-800 font-handwritten italic truncate opacity-80 group-hover:opacity-100 transition-all duration-[2000ms]">"Melodies woven into our shared tapestry..."</p>
                  <div className="w-full h-8 bg-white/[0.02] rounded-full mt-16 overflow-hidden border-2 border-white/5 shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-rose-700 via-purple-700 to-blue-700 shadow-[0_0_50px_rgba(168,85,247,0.8)]" 
                      animate={{ width: ['20%', '98%', '20%'] }} 
                      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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

function StatCard({ label, value, icon: Icon, color, index }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 120, filter: 'blur(50px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card 
        className="p-16 sm:p-32 rounded-[7rem] flex flex-col items-center gap-16 border-2 border-white/5 hover:bg-white/[0.08] transition-all duration-[2500ms] group shadow-[0_150px_450px_rgba(0,0,0,1)] relative overflow-hidden backdrop-blur-[100px] shadow-inner"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2500ms]" />
        <div className={twMerge("p-16 rounded-[4.5rem] bg-white/[0.01] border-2 border-white/5 transition-all duration-[2000ms] group-hover:scale-125 group-hover:rotate-[20deg] group-hover:bg-white/20 shadow-inner relative z-10 shadow-3xl", color)}>
          <Icon size={100} strokeWidth={0.1} className="animate-pulse fill-current drop-shadow-2xl" />
        </div>
        <div className="text-center relative z-10">
          <p className="text-9xl sm:text-[12rem] font-serif font-black tracking-tighter text-white group-hover:text-rose-500 transition-all duration-[1500ms] italic leading-none">{value}</p>
          <p className="text-[20px] font-black uppercase tracking-[1em] text-gray-950 mt-10 group-hover:text-gray-800 transition-all duration-[1500ms] italic">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function QuickPortal({ icon: Icon, label, value, color, path }: any) {
  return (
    <Link to={path} className="h-full block group">
      <Card className="p-16 sm:p-32 h-full flex flex-col justify-between group relative overflow-hidden border-2 border-white/5 bg-white/[0.01] shadow-[0_150px_400px_rgba(0,0,0,1)] hover:bg-white/[0.08] hover:border-rose-500/60 transition-all duration-[2500ms] backdrop-blur-[120px] shadow-inner min-h-[550px] rounded-[7rem]">
        <div className="absolute top-0 right-0 p-24 opacity-[0.02] group-hover:opacity-[0.12] transition-all duration-[4000ms] group-hover:scale-150 group-hover:rotate-[30deg] text-white">
          <Icon size={400} strokeWidth={0.1} />
        </div>
        <div className={twMerge("p-16 w-fit rounded-[4.5rem] bg-white/[0.01] border-2 border-white/5 transition-all duration-[2000ms] group-hover:scale-125 group-hover:rotate-[25deg] group-hover:bg-white/20 shadow-inner relative z-10 shadow-3xl", color)}>
          <Icon size={100} strokeWidth={0.1} className="fill-current drop-shadow-2xl" />
        </div>
        <div className="space-y-16 mt-32 relative z-10">
          <p className="text-[20px] text-gray-950 uppercase tracking-[1.2em] font-black group-hover:text-rose-500/40 transition-all duration-[1500ms] italic">{label}</p>
          <div className="flex items-center justify-between">
            <p className="text-8xl sm:text-9xl font-serif font-bold text-white group-hover:text-rose-400 transition-all duration-[1500ms] tracking-tighter leading-none italic">{value}</p>
            <div className="p-12 rounded-[4rem] bg-white/[0.03] border-2 border-white/5 group-hover:bg-rose-500/25 group-hover:border-rose-500/50 transition-all duration-[1500ms] shadow-3xl shadow-inner">
              <ArrowRight size={80} strokeWidth={0.1} className="text-gray-950 group-hover:text-white group-hover:translate-x-10 transition-all duration-[1500ms]" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
