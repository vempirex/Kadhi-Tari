import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music, Sparkles, Zap, Heart, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
    <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 h-[12rem] w-[calc(100%-6rem)] max-w-2xl bg-black/[0.1] backdrop-blur-[150px] border-4 border-white/5 z-[1500] flex justify-around items-center px-12 rounded-[6rem] shadow-[0_150px_450px_rgba(0,0,0,1)] lg:hidden overflow-hidden shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.08] to-transparent pointer-events-none" />
      
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={twMerge(
              "relative h-full flex flex-col items-center justify-center transition-all duration-[1500ms] group",
              isActive ? "text-rose-500" : "text-gray-950 hover:text-white"
            )}
          >
            <div className={twMerge(
              "p-6 rounded-[3rem] transition-all duration-[1500ms] relative z-10",
              isActive ? "bg-rose-500/25 scale-125 shadow-[0_50px_100px_rgba(244,63,94,0.6)] border-2 border-rose-500/40" : "group-hover:bg-white/15"
            )}>
              <item.icon size-[4.5rem] strokeWidth={isActive ? 1.5 : 0.5} className={twMerge("transition-all duration-[1500ms] drop-shadow-3xl", isActive && "rotate-[20deg] animate-pulse fill-current")} />
            </div>
            
            <span className={twMerge(
              "text-[12px] font-black uppercase tracking-[0.8em] mt-4 transition-all duration-[1500ms] italic",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 group-hover:opacity-60"
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div 
                layoutId="nav-glow-mobile"
                className="absolute -bottom-6 w-32 h-16 bg-rose-500/30 blur-[40px] rounded-full"
                transition={{ type: "spring", damping: 15, stiffness: 100, duration: 1.5 }}
              />
            )}

            {isActive && (
              <div className="absolute -top-6">
                 <Sparkles size-[2rem] strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-2xl" />
              </div>
            )}
          </Link>
        )
      })}
    </nav>
  );
}
