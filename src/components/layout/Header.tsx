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
    <header className="fixed top-0 left-0 right-0 h-16 px-4 sm:px-8 flex items-center justify-between z-[1000] bg-white/80 backdrop-blur-xl border-b border-black/[0.03]">
      <Link to="/" className="flex items-center gap-3 group relative z-10">
        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
          <Heart size={20} className="text-white fill-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-outfit font-bold text-charcoal tracking-tight">Kadhi Tari</h1>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4 relative z-10">
        {/* Search */}
        <div className="hidden md:flex items-center bg-warm-100 border border-transparent rounded-xl px-4 py-2 group focus-within:bg-white focus-within:border-warm-200 transition-all">
          <Search size={18} className="text-warm-400 group-focus-within:text-charcoal" />
          <input 
            type="text" 
            placeholder="Search moments..." 
            className="bg-transparent border-none outline-none text-sm px-2 text-charcoal placeholder:text-warm-400 w-48 font-medium"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsMenuRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={twMerge(
              "p-2.5 rounded-xl transition-all relative group",
              isNotificationsOpen ? "bg-warm-100 text-charcoal" : "text-warm-400 hover:text-charcoal hover:bg-warm-50"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute top-full right-0 mt-2 w-72 bg-white border border-black/[0.05] rounded-2xl p-4 shadow-xl z-[1100]"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-charcoal">Recent Activity</h3>
                  <button className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:underline">Clear</button>
                </div>
                <div className="space-y-1">
                  <div className="p-3 rounded-xl hover:bg-warm-50 transition-colors cursor-pointer group">
                    <p className="text-xs font-semibold text-charcoal">New Whisper</p>
                    <p className="text-[11px] text-warm-500">A new shared frequency was detected.</p>
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
              "flex items-center gap-2 p-1 pl-3 rounded-full border transition-all",
              isProfileOpen ? "bg-warm-50 border-warm-200" : "bg-warm-50/50 border-warm-100 hover:border-warm-200"
            )}
          >
            <span className="hidden sm:block text-[11px] font-bold text-warm-600 uppercase tracking-wider">
              {profile?.display_name || 'Soulmate'}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-warm-200 bg-white">
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
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white border border-black/[0.05] rounded-2xl p-2 shadow-xl z-[1100]"
              >
                <div className="p-3 border-b border-warm-100 mb-1">
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Connected</p>
                  <p className="text-sm font-bold text-charcoal truncate">@{profile?.username}</p>
                </div>
                <div className="space-y-0.5">
                  <ProfileLink icon={User} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                  <ProfileLink icon={Settings} label="Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                  <div className="h-px bg-warm-100 my-1 mx-2" />
                  <ProfileLink icon={LogOut} label="Disconnect" onClick={handleLogout} className="text-rose-600 hover:bg-rose-50" />
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
        "w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-warm-50 transition-all text-xs font-semibold text-warm-600 hover:text-charcoal",
        className
      )}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}
