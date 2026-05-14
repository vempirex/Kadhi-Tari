import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image, Mail, MessageCircle, MoreHorizontal, User, Plus, X, Camera, PenTool, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Navbar() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Image, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <main className="min-h-screen pb-32">
        <Outlet />
      </main>

      {/* FAB - Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className={twMerge(
            "w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/40 transition-all duration-300",
            isCreateOpen && "rotate-45"
          )}
        >
          <Plus size={32} className="text-white" />
        </motion.button>

        {/* Create Options Menu */}
        <AnimatePresence>
          {isCreateOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center"
            >
              <CreateOption icon={Camera} label="Story" onClick={() => setIsCreateOpen(false)} />
              <CreateOption icon={Image} label="Post" onClick={() => setIsCreateOpen(false)} />
              <CreateOption icon={PenTool} label="Note" onClick={() => setIsCreateOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={twMerge(
                "relative p-4 flex flex-col items-center transition-all duration-300",
                isActive ? "text-rose-400 scale-110" : "text-gray-500 hover:text-white"
              )}
            >
              <item.icon size={24} />
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CreateOption({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl min-w-[140px] group hover:bg-white/20 transition-all"
    >
      <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
        <Icon size={18} />
      </div>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </motion.button>
  );
}


