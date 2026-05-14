import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Image, MessageCircle, User, Calendar, 
  Music, Heart, Sparkles, LayoutGrid, Radio
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: LayoutGrid, path: '/feed', label: 'Archive' },
    { icon: MessageCircle, path: '/chat', label: 'Whisper' },
    { icon: Calendar, path: '/timeline', label: 'Journey' },
    { icon: Radio, path: '/playlist', label: 'Pulse' },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 h-20 bg-black/40 backdrop-blur-3xl border border-white/5 z-[1000] flex justify-around items-center px-4 rounded-[2.5rem] shadow-2xl lg:hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
      
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={twMerge(
              "relative flex flex-col items-center justify-center transition-all duration-500",
              isActive ? "text-rose-500" : "text-white/30 hover:text-white/60"
            )}
          >
            <div className={twMerge(
              "p-2.5 rounded-2xl transition-all duration-500",
              isActive && "bg-rose-500/10 scale-110"
            )}>
              <item.icon size={24} strokeWidth={isActive ? 2 : 1.5} className={twMerge(isActive && "animate-pulse")} />
            </div>
            
            {isActive && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute -bottom-1 w-8 h-1 bg-rose-500 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  );
}
