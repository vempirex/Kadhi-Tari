import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Heart, LogOut, MessageCircle, Settings, User, 
  Sparkles, Zap, ShieldCheck, History, Fingerprint, 
  Search, Menu 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

export default function Header() {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const notificationsMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
    
    function handleClickOutside(event: MouseEvent) {
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[8rem] px-4 sm:px-12 flex items-center justify-between z-[1000] bg-black/40 backdrop-blur-3xl border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <Link to="/" className="flex items-center gap-4 group relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Heart size={24} className="text-white fill-white animate-pulse" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-4xl font-serif italic text-white leading-none">Kadhi Tari</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500/60 italic">Sanctuary</p>
        </div>
      </Link>

      <div className="flex items-center gap-4 relative z-10">
        {/* Search - Decorative for now */}
        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-2 group focus-within:border-rose-500/30 transition-all">
          <Search size={18} className="text-white/20 group-focus-within:text-rose-500/60" />
          <input 
            type="text" 
            placeholder="Search frequencies..." 
            className="bg-transparent border-none outline-none text-[12px] px-2 text-white placeholder:text-white/10 w-48 italic font-serif"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsMenuRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={twMerge(
              "p-3 rounded-2xl transition-all relative group",
              isNotificationsOpen ? "bg-rose-500/10 text-rose-400" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <Bell size={24} className={twMerge("transition-transform", isNotificationsOpen && "scale-110")} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-black" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-80 bg-[#0a0a0c] border border-white/10 rounded-3xl p-4 shadow-2xl z-[1100] backdrop-blur-3xl"
              >
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-serif text-2xl text-white italic">Whispers</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Clear</button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <p className="text-[12px] font-bold text-white group-hover:text-rose-400 transition-colors">New Whisper</p>
                    <p className="text-[11px] text-white/40 italic">Someone shared a frequency...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={twMerge(
              "flex items-center gap-3 p-1.5 pl-3 rounded-full border transition-all",
              isProfileOpen ? "bg-rose-500/10 border-rose-500/30" : "bg-white/[0.03] border-white/5 hover:border-white/10"
            )}
          >
            <span className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-white/60 italic">
              {profile?.display_name || 'Soulmate'}
            </span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black bg-white/5">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`} 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-64 bg-[#0a0a0c] border border-white/10 rounded-3xl p-3 shadow-2xl z-[1100] backdrop-blur-3xl"
              >
                <div className="p-3 border-b border-white/5 mb-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-rose-500 italic">Frequency Active</p>
                  <p className="text-2xl font-serif italic text-white truncate">@{profile?.username}</p>
                </div>
                <div className="space-y-1">
                  <ProfileLink icon={User} label="Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                  <ProfileLink icon={Settings} label="Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                  <div className="h-px bg-white/5 my-2" />
                  <ProfileLink icon={LogOut} label="Disconnect" onClick={handleLogout} className="text-rose-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function ProfileLink({ icon: Icon, label, onClick, className }: any) {
  return (
    <button 
      onClick={onClick}
      className={twMerge(
        "w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white italic",
        className
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
