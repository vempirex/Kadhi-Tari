import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, LogOut, MessageCircle, Settings, User, Calendar, Camera, Sparkles, Zap, Shield, History } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 h-20 sm:h-24 px-6 sm:px-12 flex items-center justify-between z-[1000] bg-black/[0.1] backdrop-blur-[40px] border-b border-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <Link to="/" className="flex items-center gap-5 group relative z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-[1.6rem] bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
            <Heart size={24} className="text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-black">
            <Sparkles size={8} className="text-rose-500" />
          </div>
        </div>
        <div className="hidden sm:block space-y-0.5">
          <h1 className="text-2xl font-serif glow-text leading-tight tracking-tight">Kadhi Tari</h1>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-rose-400 font-black uppercase tracking-[0.4em] opacity-80">Our Sanctuary</span>
            <div className="w-1 h-1 rounded-full bg-rose-500/20" />
            <Shield size={8} className="text-rose-500/40" />
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-4 sm:gap-8 relative z-10">
        {/* Notifications */}
        <div className="relative" ref={notificationsMenuRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={twMerge(
              "p-4 rounded-[1.4rem] transition-all relative group border border-transparent active:scale-90 shadow-2xl",
              isNotificationsOpen ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/10"
            )}
          >
            <Bell size={22} className={twMerge("transition-transform duration-500", isNotificationsOpen && "scale-110")} />
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-black shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-6 w-96 bg-black/[0.8] backdrop-blur-[50px] rounded-[3rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[1100] border border-white/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex justify-between items-center mb-8 relative z-10 px-2">
                  <div className="flex items-center gap-3">
                    <Zap size={14} className="text-rose-400" />
                    <h3 className="font-serif text-2xl text-white tracking-tight">Whispers</h3>
                  </div>
                  <button className="text-[10px] text-rose-400 font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Mark all read</button>
                </div>

                <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar relative z-10 px-1">
                  <NotificationItem 
                    title="New Whisper" 
                    desc="Someone sent a message in the sanctuary." 
                    time="2m ago" 
                    icon={MessageCircle} 
                    color="text-blue-400"
                  />
                  <NotificationItem 
                    title="Shared Dream" 
                    desc="Added a new memory to our timeline." 
                    time="1h ago" 
                    icon={Calendar} 
                    color="text-rose-400"
                  />
                  <NotificationItem 
                    title="Fresh Reflection" 
                    desc="A new story has been shared." 
                    time="Now" 
                    icon={Camera} 
                    color="text-orange-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={twMerge(
              "flex items-center gap-4 p-2 pr-6 rounded-[1.8rem] border transition-all duration-700 shadow-2xl group/profile",
              isProfileOpen ? "bg-rose-500/10 border-rose-500/30" : "bg-white/[0.03] border-white/5 hover:border-rose-500/20 hover:bg-white/[0.05]"
            )}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1.4rem] overflow-hidden border-2 border-black shadow-inner group-hover/profile:scale-110 transition-transform duration-700">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`} 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>
            <div className="hidden md:block text-left space-y-1">
              <p className="text-sm font-black text-white uppercase tracking-widest">{profile?.display_name || 'Soulmate'}</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Sanctuary Keeper</span>
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-6 w-80 bg-black/[0.8] backdrop-blur-[50px] rounded-[3rem] p-6 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[1100] border border-white/10"
              >
                <div className="p-6 border-b border-white/5 mb-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/[0.02] transition-colors" />
                  <p className="text-lg font-serif text-white tracking-tight relative z-10">{profile?.display_name || 'Sanctuary User'}</p>
                  <div className="flex items-center gap-2 mt-2 relative z-10">
                    <History size={10} className="text-gray-600" />
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">Joined our frequency {new Date(profile?.joined_at).getFullYear() || '2024'}</p>
                  </div>
                </div>
                
                <div className="space-y-2 px-1">
                  <ProfileMenuItem icon={User} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                  <ProfileMenuItem icon={Settings} label="Sanctuary Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                  <div className="h-px bg-white/5 my-4 mx-4" />
                  <ProfileMenuItem icon={LogOut} label="Leave Sanctuary" onClick={handleLogout} color="text-rose-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ title, desc, time, icon: Icon, color }: any) {
  return (
    <div className="flex items-start gap-5 p-5 rounded-[2rem] hover:bg-white/[0.03] transition-all group cursor-pointer border border-transparent hover:border-white/5">
      <div className={twMerge("p-4 rounded-2xl bg-white/[0.02] transition-all group-hover:scale-110 group-hover:rotate-6 border border-white/5", color)}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1 space-y-1.5 pt-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-black text-white uppercase tracking-tight">{title}</p>
          <span className="text-[8px] text-gray-700 font-black uppercase tracking-[0.3em]">{time}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed italic">{desc}</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label, onClick, color = "text-gray-500" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/5"
    >
      <div className={twMerge("p-3 rounded-xl bg-white/[0.02] border border-white/5 group-hover:scale-110 transition-transform", color)}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}
