import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music, Sparkles, Zap, Heart } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/', label: 'Sanctuary' },
    { icon: Image, path: '/feed', label: 'Archive' },
    { icon: MessageCircle, path: '/chat', label: 'Whisper' },
    { icon: Calendar, path: '/timeline', label: 'Journey' },
    { icon: Music, path: '/playlist', label: 'Frequency' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 h-24 w-[calc(100%-2rem)] max-w-lg bg-black/[0.1] backdrop-blur-[40px] border border-white/5 z-[1000] flex justify-around items-center px-6 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] lg:hidden overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
      
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={twMerge(
              "relative h-full flex flex-col items-center justify-center transition-all duration-700 group",
              isActive ? "text-rose-500" : "text-gray-600 hover:text-white"
            )}
          >
            <div className={twMerge(
              "p-3 rounded-2xl transition-all duration-700 relative z-10",
              isActive ? "bg-rose-500/10 scale-110 shadow-[0_0_30px_rgba(244,63,94,0.15)]" : "group-hover:bg-white/5"
            )}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={twMerge("transition-transform duration-700", isActive && "rotate-3")} />
            </div>
            
            <span className={twMerge(
              "text-[8px] font-black uppercase tracking-[0.3em] mt-2 transition-all duration-700",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-40"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="nav-glow-mobile"
                className="absolute -bottom-2 w-12 h-6 bg-rose-500/20 blur-[15px] rounded-full"
              />
            )}

            {isActive && (
              <div className="absolute -top-1">
                <Heart size={4} className="text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            )}
          </Link>
        )
      })}
    </nav>
  );
}
