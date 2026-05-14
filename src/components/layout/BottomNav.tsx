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
    { icon: LayoutGrid, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Calendar, path: '/timeline', label: 'Time' },
    { icon: Radio, path: '/playlist', label: 'Pulse' },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-xl border border-black/[0.03] z-[1000] flex justify-around items-center px-4 rounded-2xl shadow-premium lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={twMerge(
              "relative flex flex-col items-center justify-center transition-all duration-300",
              isActive ? "text-rose-600" : "text-warm-400 hover:text-charcoal"
            )}
          >
            <div className={twMerge(
              "p-2 rounded-xl transition-all",
              isActive && "bg-rose-50"
            )}>
              <item.icon size={22} />
            </div>
            
            {isActive && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute -bottom-1 w-4 h-0.5 bg-rose-500 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  );
}
