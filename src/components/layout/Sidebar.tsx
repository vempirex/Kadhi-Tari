import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music, Sparkles, BookHeart, Ghost, Settings, Zap, History, Shield, Heart } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
  const location = useLocation();

  const primaryItems = [
    { icon: Home, path: '/', label: 'The Sanctuary' },
    { icon: Image, path: '/feed', label: 'Memory Archive' },
    { icon: MessageCircle, path: '/chat', label: 'Soul Whispers' },
    { icon: Calendar, path: '/timeline', label: 'Our Journey' },
  ];

  const secondaryItems = [
    { icon: Music, path: '/playlist', label: 'Shared Rhythm' },
    { icon: BookHeart, path: '/letters', label: 'Written Souls' },
    { icon: Ghost, path: '/jokes', label: 'Echo Laughter' },
    { icon: Sparkles, path: '/planner', label: 'Future Maps' },
  ];

  return (
    <aside className="fixed left-0 top-24 bottom-0 desktop-sidebar-width hidden lg:flex flex-col p-8 gap-12 border-r border-white/5 bg-black/[0.1] backdrop-blur-[40px] z-40 overflow-y-auto no-scrollbar shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-5 opacity-40">
          <History size={10} className="text-gray-500" />
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Universe</p>
        </div>
        <div className="space-y-2">
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-5 opacity-40">
          <Zap size={10} className="text-rose-500" />
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Resonance</p>
        </div>
        <div className="space-y-2">
          {secondaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-10">
        <div className="p-px rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent">
          <Link 
            to="/profile/edit"
            className="flex items-center gap-5 px-6 py-5 rounded-[2rem] text-gray-500 hover:text-white bg-black/20 hover:bg-white/[0.05] transition-all duration-700 group border border-transparent hover:border-white/5 shadow-2xl"
          >
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover:rotate-90 transition-all duration-700">
              <Settings size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Sanctuary Config</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <Link 
      to={item.path}
      className={twMerge(
        "flex items-center gap-5 px-6 py-4.5 rounded-[2.2rem] transition-all duration-700 group relative overflow-hidden",
        isActive 
          ? "bg-rose-500/10 text-rose-500 shadow-[inset_0_0_30px_rgba(244,63,94,0.1)] border border-rose-500/20" 
          : "text-gray-600 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/5"
      )}
    >
      <div className={twMerge(
        "relative z-10 transition-all duration-700 p-2 rounded-xl",
        isActive ? "bg-rose-500/10 scale-110 rotate-3" : "group-hover:scale-110 group-hover:bg-white/5"
      )}>
        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className={twMerge(
        "text-xs font-black uppercase tracking-[0.2em] relative z-10 transition-all duration-700",
        isActive ? "translate-x-1" : "group-hover:translate-x-1"
      )}>{item.label}</span>
      
      {isActive && (
        <>
          <motion.div 
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-full shadow-[0_0_20px_rgba(244,63,94,1)]"
          />
          <div className="absolute right-6 opacity-40">
            <Heart size={8} className="text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </>
      )}
    </Link>
  );
}
