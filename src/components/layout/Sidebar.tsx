import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music, Sparkles, BookHeart, Ghost, Settings } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
  const location = useLocation();

  const primaryItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Image, path: '/feed', label: 'Feed' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Calendar, path: '/timeline', label: 'Our Journey' },
  ];

  const secondaryItems = [
    { icon: Music, path: '/playlist', label: 'Rhythm' },
    { icon: BookHeart, path: '/letters', label: 'Letters' },
    { icon: Ghost, path: '/jokes', label: 'Laughter' },
    { icon: Sparkles, path: '/planner', label: 'Plans' },
  ];

  return (
    <aside className="fixed left-0 top-20 bottom-0 desktop-sidebar-width hidden lg:flex flex-col p-6 gap-8 border-r border-white/5 bg-[#050506]/50 backdrop-blur-sm z-40 overflow-y-auto no-scrollbar">
      <div className="space-y-2">
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Universe</p>
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Sanctuary</p>
        <div className="space-y-1">
          {secondaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Link 
          to="/profile/edit"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <Settings size={20} className="group-hover:rotate-45 transition-transform" />
          <span className="text-sm font-bold">Preferences</span>
        </Link>
      </div>
    </aside>
  );
}

function SidebarItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <Link 
      to={item.path}
      className={twMerge(
        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
        isActive 
          ? "bg-rose-500/10 text-rose-400 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]" 
          : "text-gray-500 hover:text-white hover:bg-white/5"
      )}
    >
      <div className={twMerge(
        "relative z-10 transition-transform duration-300",
        isActive ? "scale-110" : "group-hover:scale-110"
      )}>
        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className="text-sm font-bold tracking-wide relative z-10">{item.label}</span>
      
      {isActive && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r-full shadow-[0_0_15px_rgba(244,63,94,1)]"
        />
      )}
    </Link>
  );
}
