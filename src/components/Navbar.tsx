import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image, Mail, MessageCircle, MoreHorizontal, User, Plus, X, Camera, PenTool, Sparkles, BookHeart, Calendar, LogOut, Settings, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import UploadModal from './UploadModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'story'>('post');
  
  const createMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Image, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  const openUpload = (type: 'post' | 'story') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
    setIsCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050506] relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header / Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-[100] bg-[#050506]/80 backdrop-blur-xl border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <HeartIcon size={20} className="text-white fill-white" />
          </div>
          <span className="text-lg font-serif glow-text hidden sm:block">Kadhi Tari</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationsMenuRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={twMerge(
                "p-2.5 rounded-xl transition-all relative",
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
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Mark all read</span>
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

          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden hover:border-rose-500/50 transition-all shadow-lg"
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user`} className="w-full h-full object-cover" alt="Profile" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-56 glass-panel rounded-[2rem] p-3 shadow-2xl z-[110] border border-white/10"
                >
                  <div className="p-3 border-b border-white/5 mb-2">
                    <p className="text-sm font-bold text-white">Our Sanctuary</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Manage Profile</p>
                  </div>
                  <div className="space-y-1">
                    <ProfileMenuItem icon={Settings} label="Settings" onClick={() => { setIsProfileOpen(false); navigate('/profile/edit'); }} />
                    <ProfileMenuItem icon={LogOut} label="Logout" onClick={handleLogout} color="text-rose-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-36 px-4 max-w-lg mx-auto min-h-screen">
        <Outlet />
      </main>

      {/* FAB - Floating Action Button */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[150]" ref={createMenuRef}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className={twMerge(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
            isCreateOpen 
              ? "bg-white text-black rotate-45" 
              : "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/40"
          )}
        >
          <Plus size={32} className={twMerge("transition-transform duration-500", isCreateOpen && "rotate-45")} />
        </motion.button>

        {/* Create Options Menu */}
        <AnimatePresence>
          {isCreateOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center min-w-[220px]"
            >
              <CreateOption icon={Camera} label="New Story" onClick={() => openUpload('story')} color="text-rose-400" />
              <CreateOption icon={Image} label="Share Post" onClick={() => openUpload('post')} color="text-orange-400" />
              <CreateOption icon={BookHeart} label="Write Letter" onClick={() => { setIsCreateOpen(false); navigate('/letters'); }} color="text-purple-400" />
              <CreateOption icon={Calendar} label="Add Milestone" onClick={() => { setIsCreateOpen(false); navigate('/timeline'); }} color="text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 h-20 w-[calc(100%-2rem)] max-w-md glass-panel border border-white/10 z-[100] flex justify-around items-center px-6 rounded-[2.5rem] shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={twMerge(
                "relative p-4 flex flex-col items-center transition-all duration-500",
                isActive ? "text-rose-400 scale-125" : "text-gray-500 hover:text-white"
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,1)]"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Global Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSuccess={() => {
          if (location.pathname === '/feed') {
            window.location.reload(); 
          }
        }}
        type={uploadType}
      />

      {/* Blur Overlay when Create is Open */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateOption({ icon: Icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) {
  return (
    <motion.button
      whileHover={{ x: 5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[2.2rem] w-full group hover:bg-white/10 transition-all shadow-xl"
    >
      <div className={twMerge("p-2 rounded-xl bg-white/5 transition-all group-hover:bg-white/10", color)}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-bold tracking-wide text-white/80 group-hover:text-white transition-colors">{label}</span>
    </motion.button>
  );
}

function NotificationItem({ title, desc, time, icon: Icon, color }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5">
      <div className={twMerge("p-2.5 rounded-xl bg-white/5", color)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-white">{title}</p>
          <span className="text-[8px] text-gray-500 font-bold uppercase">{time}</span>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

function ProfileMenuItem({ icon: Icon, label, onClick, color = "text-gray-400" }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group"
    >
      <Icon size={18} className={twMerge("group-hover:scale-110 transition-transform", color)} />
      <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
}

function HeartIcon({ size, className }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}


