import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image, Mail, MessageCircle, MoreHorizontal, User, Plus, X, Camera, PenTool, Sparkles, BookHeart, Calendar } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
  const location = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Image, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#050506] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 max-w-lg mx-auto px-4 pt-8 pb-36 min-h-screen">
        <Outlet />
      </main>

      {/* FAB - Floating Action Button */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[110]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: isCreateOpen ? 225 : 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className={twMerge(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
            isCreateOpen 
              ? "bg-white text-black rotate-45" 
              : "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/40"
          )}
        >
          <Plus size={32} />
        </motion.button>

        {/* Create Options Menu */}
        <AnimatePresence>
          {isCreateOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center min-w-[200px]"
            >
              <CreateOption icon={Camera} label="New Story" onClick={() => setIsCreateOpen(false)} color="text-rose-400" />
              <CreateOption icon={Image} label="Share Post" onClick={() => setIsCreateOpen(false)} color="text-orange-400" />
              <CreateOption icon={BookHeart} label="Write Letter" onClick={() => setIsCreateOpen(false)} color="text-purple-400" />
              <CreateOption icon={Calendar} label="Add Milestone" onClick={() => setIsCreateOpen(false)} color="text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
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

      {/* Blur Overlay when Create is Open */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[105]"
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
      className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-[2rem] w-full group hover:bg-white/20 transition-all shadow-xl"
    >
      <div className={twMerge("p-2 rounded-xl bg-white/5 transition-all group-hover:bg-white/10", color)}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white">{label}</span>
    </motion.button>
  );
}


