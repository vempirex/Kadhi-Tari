import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Image, MessageCircle, User, Calendar, Music, Sparkles, BookHeart, Ghost, Settings, Zap, History, Shield, Heart, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
    <aside className="fixed left-0 top-[15rem] bottom-0 w-[28rem] hidden lg:flex flex-col p-12 gap-24 border-r-4 border-white/5 bg-black/[0.1] backdrop-blur-[150px] z-[1400] overflow-y-auto no-scrollbar shadow-[50px_0_150px_rgba(0,0,0,1)] shadow-inner">
      <div className="absolute inset-y-0 right-0 w-[4px] bg-gradient-to-b from-transparent via-white/[0.1] to-transparent pointer-events-none" />
      
      <div className="space-y-16">
        <div className="flex items-center gap-8 px-12 opacity-30 italic">
          <History size={48} strokeWidth={1} className="text-gray-950" />
          <p className="text-[14px] font-black text-gray-950 uppercase tracking-[1em]">Universe</p>
        </div>
        <div className="space-y-8">
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="space-y-16">
        <div className="flex items-center gap-8 px-12 opacity-30 italic">
          <Zap size={48} strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl" />
          <p className="text-[14px] font-black text-gray-950 uppercase tracking-[1em]">Resonance</p>
        </div>
        <div className="space-y-8">
          {secondaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-[4rem]">
        <div className="p-[4px] rounded-[5rem] bg-gradient-to-br from-white/15 via-transparent to-transparent shadow-3xl shadow-inner">
          <Link 
            to="/profile/edit"
            className="flex items-center gap-12 px-12 py-10 rounded-[5rem] text-gray-950 hover:text-white bg-black/50 hover:bg-white/[0.05] transition-all duration-[1500ms] group border-4 border-transparent hover:border-white/10 shadow-inner italic"
          >
            <div className="p-6 rounded-[3rem] bg-white/[0.01] border-2 border-white/5 group-hover:rotate-[180deg] group-hover:scale-125 transition-all duration-[2000ms] shadow-3xl">
              <Settings size={64} strokeWidth={1} className="drop-shadow-3xl" />
            </div>
            <span className="text-[16px] font-black uppercase tracking-[0.5em] italic">Sanctuary Config</span>
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
        "flex items-center gap-12 px-12 py-10 rounded-[5rem] transition-all duration-[1500ms] group relative overflow-hidden italic shadow-inner",
        isActive 
          ? "bg-rose-500/25 text-rose-500 shadow-[inset_0_0_100px_rgba(244,63,94,0.3)] border-4 border-rose-500/50" 
          : "text-gray-950 hover:text-white hover:bg-white/[0.04] border-4 border-transparent hover:border-white/15"
      )}
    >
      <div className={twMerge(
        "relative z-10 transition-all duration-[1500ms] p-6 rounded-[3.5rem]",
        isActive ? "bg-rose-500/25 scale-125 rotate-[20deg] shadow-[0_50px_100px_rgba(244,63,94,0.6)]" : "group-hover:scale-125 group-hover:bg-white/15 group-hover:rotate-12"
      )}>
        <item.icon size={72} strokeWidth={isActive ? 1.5 : 0.5} className="drop-shadow-3xl" />
      </div>
      <span className={twMerge(
        "text-[18px] font-black uppercase tracking-[0.5em] relative z-10 transition-all duration-[1500ms]",
        isActive ? "translate-x-4 tracking-[0.8em]" : "group-hover:translate-x-4 group-hover:tracking-[0.7em]"
      )}>{item.label}</span>
      
      {isActive && (
        <>
          <motion.div 
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-16 bg-rose-500 rounded-r-full shadow-[0_0_50px_rgba(244,63,94,1)]"
          />
          <div className="absolute right-12 opacity-30 scale-150 group-hover:opacity-100 transition-all duration-1000">
            <Sparkles size={48} strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl" />
          </div>
        </>
      )}
    </Link>
  );
}
