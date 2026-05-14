import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, LogOut, MessageCircle, Settings, User, Calendar, Camera } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../../lib/supabase';

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
    <header className="fixed top-0 left-0 right-0 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between z-[100] bg-[#050506]/80 backdrop-blur-xl border-b border-white/5">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
          <Heart size={20} className="text-white fill-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-serif glow-text leading-tight">Kadhi Tari</h1>
          <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest opacity-80">Our Sanctuary</p>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsMenuRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={twMerge(
              "p-2.5 rounded-xl transition-all relative group",
              isNotificationsOpen ? "bg-rose-500/10 text-rose-400" : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050506]" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-80 glass-panel rounded-[2rem] p-4 shadow-2xl z-[110] border border-white/10"
              >
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="font-serif text-lg text-white">Notifications</h3>
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                  <NotificationItem 
                    title="New Message" 
                    desc="Sent you a whisper in our sanctuary." 
                    time="2m ago" 
                    icon={MessageCircle} 
                    color="text-blue-400"
                  />
                  <NotificationItem 
                    title="Milestone" 
                    desc="Added a new memory to our journey." 
                    time="1h ago" 
                    icon={Calendar} 
                    color="text-rose-400"
                  />
                  <NotificationItem 
                    title="Story Update" 
                    desc="Shared a new moment just now." 
                    time="Just now" 
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
            className="flex items-center gap-3 p-1.5 rounded-2xl border border-white/5 bg-white/5 hover:border-rose-500/30 transition-all shadow-lg"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/10">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`} 
                className="w-full h-full object-cover" 
                alt="Profile" 
              />
            </div>
            <div className="hidden md:block text-left px-1">
              <p className="text-xs font-bold text-white leading-none">{profile?.display_name || 'Soulmate'}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Online</p>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-64 glass-panel rounded-[2rem] p-3 shadow-2xl z-[110] border border-white/10"
              >
                <div className="p-4 border-b border-white/5 mb-2">
                  <p className="text-sm font-bold text-white truncate">{profile?.display_name || 'Sanctuary User'}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Member since {new Date(profile?.joined_at).getFullYear() || '2024'}</p>
                </div>
                <div className="space-y-1">
                  <ProfileMenuItem icon={User} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }} />
                  <ProfileMenuItem icon={Settings} label="Sanctuary Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                  <div className="h-px bg-white/5 my-2 mx-2" />
                  <ProfileMenuItem icon={LogOut} label="Leave Sanctuary" onClick={handleLogout} color="text-rose-400" />
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
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
      <div className={twMerge("p-2.5 rounded-xl bg-white/5 transition-all group-hover:scale-110", color)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-white">{title}</p>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label, onClick, color = "text-gray-400" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
    >
      <Icon size={18} className={twMerge("group-hover:scale-110 transition-transform", color)} />
      <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}
