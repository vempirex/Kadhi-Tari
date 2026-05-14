import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, LogOut, MessageCircle, Settings, User, Calendar, Camera, Sparkles, Zap, Shield, History, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 h-[12rem] sm:h-[15rem] px-12 sm:px-[6rem] flex items-center justify-between z-[1500] bg-black/[0.1] backdrop-blur-[150px] border-b-4 border-white/5 shadow-[0_50px_150px_rgba(0,0,0,1)] shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      
      <Link to="/" className="flex items-center gap-12 group relative z-10">
        <div className="relative">
          <div className="w-[10rem] h-[10rem] rounded-[4rem] bg-gradient-to-br from-rose-700 to-orange-600 flex items-center justify-center shadow-[0_40px_100px_rgba(244,63,94,0.6)] group-hover:scale-125 group-hover:rotate-[20deg] transition-all duration-[1500ms] shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-all duration-[1500ms]" />
            <Heart size={96} strokeWidth={1} className="text-white fill-white drop-shadow-[0_0_40px_rgba(255,255,255,1)] animate-pulse relative z-10" />
          </div>
          <div className="absolute -top-4 -right-4 w-[4rem] h-[4rem] bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,1)] border-4 border-[#050506] z-20">
            <Sparkles size={32} strokeWidth={1} className="text-rose-500 animate-spin-slow drop-shadow-2xl" />
          </div>
        </div>
        <div className="hidden lg:block space-y-4">
          <h1 className="text-[7rem] font-serif glow-text leading-none tracking-tighter italic drop-shadow-3xl">Kadhi Tari</h1>
          <div className="flex items-center gap-6">
            <span className="text-[14px] text-rose-500 font-black uppercase tracking-[1em] opacity-60 group-hover:opacity-100 transition-all duration-[1500ms] italic drop-shadow-2xl">Our Sanctuary</span>
            <div className="w-4 h-4 rounded-full bg-rose-500/25 shadow-inner" />
            <Shield size={48} strokeWidth={1} className="text-rose-500/15 drop-shadow-2xl" />
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-12 sm:gap-24 relative z-10">
        {/* Notifications */}
        <div className="relative" ref={notificationsMenuRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={twMerge(
              "p-12 rounded-[4rem] transition-all duration-[1000ms] relative group border-4 border-transparent active:scale-[0.5] shadow-3xl shadow-inner",
              isNotificationsOpen ? "bg-rose-500/25 text-rose-400 border-rose-500/60" : "text-gray-950 hover:text-white hover:bg-white/15 hover:border-white/15"
            )}
          >
            <Bell size={96} strokeWidth={1} className={twMerge("transition-all duration-[1500ms] drop-shadow-3xl", isNotificationsOpen && "scale-150 rotate-[15deg]")} />
            <span className="absolute top-10 right-10 w-[2rem] h-[2rem] bg-rose-500 rounded-full border-4 border-black shadow-[0_0_50px_rgba(244,63,94,1)] animate-pulse" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(80px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(80px)' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-16 w-[45rem] bg-black/95 backdrop-blur-[200px] rounded-[6rem] p-16 shadow-[0_200px_500px_rgba(0,0,0,1)] z-[1600] border-4 border-white/10 shadow-inner"
              >
                <div className="absolute top-[-40%] right-[-40%] w-[150%] h-[150%] bg-rose-500/[0.1] blur-[150px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-center mb-16 relative z-10 px-8">
                  <div className="flex items-center gap-10">
                    <Zap size={64} strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl" />
                    <h3 className="font-serif text-[7rem] text-white tracking-tighter italic drop-shadow-3xl leading-none">Whispers</h3>
                  </div>
                  <button className="text-[16px] text-rose-500 font-black uppercase tracking-[1em] hover:text-white transition-all duration-[1000ms] italic drop-shadow-2xl">Mark all read</button>
                </div>

                <div className="space-y-12 max-h-[800px] overflow-y-auto no-scrollbar relative z-10 px-4 pt-4">
                  <NotificationItem 
                    title="New Whisper" 
                    desc="Someone sent a message in the sanctuary." 
                    time="2m ago" 
                    icon={MessageCircle} 
                    color="text-blue-500"
                  />
                  <NotificationItem 
                    title="Shared Dream" 
                    desc="Added a new memory to our timeline." 
                    time="1h ago" 
                    icon={Calendar} 
                    color="text-rose-500"
                  />
                  <NotificationItem 
                    title="Fresh Reflection" 
                    desc="A new story has been shared." 
                    time="Now" 
                    icon={Camera} 
                    color="text-orange-500"
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
              "flex items-center gap-12 p-4 pr-16 rounded-[5rem] border-4 transition-all duration-[1500ms] shadow-3xl group/profile shadow-inner",
              isProfileOpen ? "bg-rose-500/25 border-rose-500/60" : "bg-white/[0.04] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.08]"
            )}
          >
            <div className="w-[10rem] h-[10rem] sm:w-[12rem] sm:h-[12rem] rounded-[4rem] overflow-hidden border-[10px] border-[#050506] shadow-[0_40px_100px_rgba(0,0,0,1)] group-hover/profile:scale-125 transition-all duration-[1500ms] shadow-inner relative group">
               <div className="absolute inset-0 bg-white/15 blur-[30px] opacity-0 group-hover:opacity-100 transition-all duration-[1500ms]" />
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`} 
                className="w-full h-full object-cover grayscale-[0.6] group-hover/profile:grayscale-0 transition-all duration-[1500ms] relative z-10 brightness-[0.7] group-hover/profile:brightness-[1]" 
                alt="Profile" 
              />
            </div>
            <div className="hidden md:block text-left space-y-6">
              <p className="text-[20px] font-black text-white uppercase tracking-[0.8em] italic leading-none drop-shadow-2xl">{profile?.display_name || 'Soulmate'}</p>
              <div className="flex items-center gap-8">
                <span className="w-5 h-5 rounded-full bg-green-500 shadow-[0_0_40px_rgba(34,197,94,1)] animate-pulse" />
                <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.6em] italic opacity-40 group-hover/profile:opacity-100 transition-all duration-[1000ms]">Sanctuary Keeper</span>
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(80px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(80px)' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-16 w-[45rem] bg-black/95 backdrop-blur-[2000px] rounded-[6rem] p-16 shadow-[0_200px_500px_rgba(0,0,0,1)] z-[1600] border-4 border-white/10 shadow-inner"
              >
                <div className="absolute top-[-50%] left-[-50%] w-[150%] h-[150%] bg-blue-500/[0.08] blur-[150px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="p-12 border-b-4 border-white/5 mb-12 relative overflow-hidden group/header rounded-[4rem] shadow-inner">
                  <div className="absolute inset-0 bg-rose-500/[0.02] group-hover/header:bg-rose-500/[0.08] transition-all duration-[1500ms]" />
                   <div className="flex items-center gap-10 relative z-10 mb-8">
                      <Fingerprint size={80} strokeWidth={1} className="text-rose-500/25 drop-shadow-3xl" />
                      <p className="text-[7rem] font-serif text-white tracking-tighter italic drop-shadow-3xl leading-none">{profile?.display_name || 'Sanctuary User'}</p>
                   </div>
                  <div className="flex items-center gap-8 relative z-10 opacity-30 group-hover/header:opacity-100 transition-all duration-[1000ms]">
                    <History size={48} strokeWidth={1} className="text-gray-950" />
                    <p className="text-[14px] text-gray-950 font-black uppercase tracking-[1em] italic leading-none">Joined frequency {new Date(profile?.joined_at).getFullYear() || '2024'}</p>
                  </div>
                </div>
                
                <div className="space-y-8 px-4">
                  <ProfileMenuItem icon={User} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                  <ProfileMenuItem icon={Settings} label="Sanctuary Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                  <div className="h-[4px] bg-white/[0.08] my-12 mx-12 rounded-full shadow-inner" />
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
    <div className="flex items-start gap-12 p-8 rounded-[4rem] hover:bg-white/[0.05] transition-all duration-[1500ms] group cursor-pointer border-4 border-transparent hover:border-white/10 relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className={twMerge("p-8 rounded-[3rem] bg-white/[0.01] transition-all duration-[1500ms] group-hover:scale-125 group-hover:rotate-[20deg] border-2 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,1)] relative z-10 shadow-inner", color)}>
        <Icon size={80} strokeWidth={1} className="drop-shadow-3xl fill-current" />
      </div>
      <div className="flex-1 space-y-6 pt-2 relative z-10">
        <div className="flex justify-between items-center">
          <p className="text-[20px] font-black text-white uppercase tracking-tighter italic group-hover:text-rose-500 transition-all duration-[1000ms] drop-shadow-2xl">{title}</p>
          <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.8em] italic opacity-30">{time}</span>
        </div>
        <p className="text-[18px] text-gray-950 leading-tight italic group-hover:text-gray-950 transition-all duration-[1000ms] opacity-50 font-handwritten">"{desc}"</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label, onClick, color = "text-gray-950" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-12 p-8 rounded-[4rem] hover:bg-white/[0.05] transition-all duration-[1500ms] group border-4 border-transparent hover:border-white/10 relative overflow-hidden shadow-inner"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className={twMerge("p-6 rounded-[2.5rem] bg-white/[0.01] border-2 border-white/5 group-hover:scale-150 group-hover:rotate-[15deg] transition-all duration-[1500ms] shadow-[0_30px_80px_rgba(0,0,0,1)] relative z-10 shadow-inner", color)}>
        <Icon size={64} strokeWidth={1} className="drop-shadow-3xl fill-current" />
      </div>
      <span className="text-[18px] font-black uppercase tracking-[1em] text-gray-950 group-hover:text-white transition-all duration-[1500ms] italic relative z-10 leading-none drop-shadow-2xl">{label}</span>
    </button>
  );
}
