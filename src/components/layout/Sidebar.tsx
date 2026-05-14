import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Image, MessageCircle, User, Calendar, 
  Music, Sparkles, BookHeart, Ghost, Settings, 
  Zap, History, Shield, Heart, Radio, LayoutGrid
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Sidebar() {
  const location = useLocation();

  const primaryItems = [
    { icon: Home, path: '/', label: 'The Sanctuary' },
    { icon: LayoutGrid, path: '/feed', label: 'Archive' },
    { icon: MessageCircle, path: '/chat', label: 'Whispers' },
    { icon: Calendar, path: '/timeline', label: 'Our Journey' },
  ];

  const secondaryItems = [
    { icon: Radio, path: '/playlist', label: 'Pulse' },
    { icon: BookHeart, path: '/letters', label: 'Written Souls' },
    { icon: Ghost, path: '/jokes', label: 'Echo Laughter' },
    { icon: Sparkles, path: '/planner', label: 'Future Maps' },
  ];

  return (
    <aside className="fixed left-0 top-[8rem] bottom-0 w-80 hidden lg:flex flex-col p-6 gap-8 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-[900]">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20 px-4 italic">Universe</p>
        <div className="space-y-1">
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20 px-4 italic">Resonance</p>
        <div className="space-y-1">
          {secondaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Link 
          to="/profile/edit"
          className="flex items-center gap-4 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all group italic"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Config</span>
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
        "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden italic",
        isActive 
          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
      )}
    >
      <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-[12px] font-black uppercase tracking-widest leading-none">{item.label}</span>
      
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-6 bg-rose-500 rounded-r-full"
        />
      )}
    </Link>
  );
}
