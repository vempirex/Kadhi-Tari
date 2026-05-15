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
  { id: 'peaceful', icon: Moon, label: 'Ethereal', desc: 'In silent harmony', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'chaotic', icon: Zap, label: 'Electric', desc: 'High energy pulse', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: 'sleepy', icon: Coffee, label: 'Dreamy', desc: 'Resting in clouds', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { id: 'low', icon: Battery, label: 'Dimmed', desc: 'Quiet reflection', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { id: 'movie', icon: Sun, label: 'Glow', desc: 'Golden hour moments', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
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
    
    const joinedDate = profileData?.joined_at ? new Date(profileData.joined_at) : new Date();
    const diff = Math.floor((new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));

    setStats({
      memories: postCount || 0,
      letters: letterCount || 0,
      daysTogether: diff >= 0 ? diff : 0
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
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Hero Greeting */}
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-[10px] font-bold text-rose-600 uppercase tracking-widest">
          <Star size={14} fill="currentColor" />
          <span>Sanctuary Active</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-outfit font-bold text-charcoal tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-warm-500 font-medium text-lg sm:text-xl max-w-2xl mx-auto">
          The sanctuary is breathing peacefully today. Every moment shared is a thread in our story.
        </p>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Memories" value={stats.memories} icon={Camera} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Letters" value={stats.letters} icon={Heart} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Days" value={stats.daysTogether} icon={Globe} color="text-blue-600" bg="bg-blue-50" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Vibe */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-warm-400">Current Frequency</h2>
          </div>
          
          <Card className="p-10 flex flex-col items-center gap-8 justify-center min-h-[360px]">
            <motion.div 
              key={currentMood.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={twMerge(
                "w-32 h-32 rounded-3xl flex items-center justify-center border-2 shadow-soft", 
                currentMood.bg, currentMood.color, currentMood.border
              )}
            >
              <currentMood.icon size={64} className="drop-shadow-sm" />
            </motion.div>
            
            <div className="text-center space-y-1">
              <p className="text-3xl font-outfit font-bold text-charcoal tracking-tight">{currentMood.label}</p>
              <p className="text-sm font-medium text-warm-400">{currentMood.desc}</p>
            </div>

            <div className="flex gap-3 overflow-x-auto p-1 no-scrollbar max-w-full">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setCurrentMood(mood)}
                  className={twMerge(
                    "flex-shrink-0 w-12 h-12 rounded-xl transition-all flex items-center justify-center border",
                    currentMood.id === mood.id 
                      ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm" 
                      : "bg-warm-50 border-transparent text-warm-400 hover:bg-warm-100"
                  )}
                >
                  <mood.icon size={20} />
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Portals */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-warm-400 px-2">Portals</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/feed" className="group">
              <Card className="p-6 flex items-center gap-5 hover:border-rose-200 hover:bg-rose-50/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <LayoutGrid size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-charcoal">Archive</p>
                  <p className="text-xs font-medium text-warm-400">Past memories</p>
                </div>
                <ArrowRight size={20} className="text-warm-300 group-hover:text-rose-600 transition-colors" />
              </Card>
            </Link>

            <Link to="/chat" className="group">
              <Card className="p-6 flex items-center gap-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageCircle size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-charcoal">Whispers</p>
                  <p className="text-xs font-medium text-warm-400">Direct connection</p>
                </div>
                <ArrowRight size={20} className="text-warm-300 group-hover:text-blue-600 transition-colors" />
              </Card>
            </Link>

            <Link to="/playlist" className="group">
              <Card className="p-6 flex items-center gap-5 hover:border-amber-200 hover:bg-amber-50/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Radio size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-charcoal">Rhythm</p>
                  <p className="text-xs font-medium text-warm-400">Current frequency</p>
                </div>
                <ArrowRight size={20} className="text-warm-300 group-hover:text-amber-600 transition-colors" />
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="p-6 flex items-center gap-5 group">
      <div className={twMerge("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105", bg, color)}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-2xl font-bold text-charcoal leading-none">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400 mt-1">{label}</p>
      </div>
    </Card>
  );
}
