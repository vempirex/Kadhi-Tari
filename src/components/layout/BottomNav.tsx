import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Image, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Calendar, path: '/timeline', label: 'Journey' },
    { icon: Music, path: '/playlist', label: 'Rhythm' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 h-20 w-[calc(100%-2rem)] max-w-lg glass-panel border border-white/10 z-[100] flex justify-around items-center px-4 rounded-[2.5rem] shadow-2xl lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={twMerge(
              "relative p-3 flex flex-col items-center transition-all duration-500 group",
              isActive ? "text-rose-400 scale-110" : "text-gray-500 hover:text-white"
            )}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
            <span className={twMerge(
              "text-[8px] font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isActive && "opacity-100"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="nav-indicator-mobile"
                className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,1)]"
              />
            )}
          </Link>
        )
      })}
    </nav>
  );
}
