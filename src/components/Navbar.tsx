import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Image, Mail, Music, MessageCircle, MoreHorizontal, Calendar, Smile, Clock, Cloud, X, Lock } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const mainNav = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Image, path: '/feed', label: 'Feed' },
  { icon: MessageCircle, path: '/chat', label: 'Chat' },
  { icon: Mail, path: '/letters', label: 'Letters' },
];

const secondaryNav = [
  { icon: Music, path: '/playlist', label: 'Playlist' },
  { icon: Cloud, path: '/thoughts', label: 'Thoughts' },
  { icon: Clock, path: '/timeline', label: 'Timeline' },
  { icon: Smile, path: '/jokes', label: 'Jokes' },
  { icon: Calendar, path: '/planner', label: 'Planner' },
  { icon: Lock, path: '/secret', label: 'Secret' },
];

export default function Navbar() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      <main className="max-w-2xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="glass-card rounded-[2rem] p-2 flex justify-between items-center relative">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="relative p-4 flex flex-col items-center gap-1 group"
              >
                <item.icon 
                  size={22} 
                  className={twMerge(
                    "transition-all duration-300",
                    isActive ? "text-primary scale-110" : "text-gray-500 group-hover:text-white"
                  )} 
                />
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/10 blur-xl rounded-full -z-10"
                  />
                )}
              </Link>
            )
          })}

          <button 
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="relative p-4 flex flex-col items-center gap-1 group text-gray-500 hover:text-white"
          >
            <MoreHorizontal size={22} className={isMoreOpen ? "text-primary rotate-90" : "transition-transform duration-300"} />
          </button>

          {/* More Menu Overlay */}
          <AnimatePresence>
            {isMoreOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-20 right-0 w-full glass-card rounded-[2.5rem] p-6 grid grid-cols-3 gap-4 shadow-2xl border-primary/10"
              >
                {secondaryNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <item.icon size={20} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-hover:text-white">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}

