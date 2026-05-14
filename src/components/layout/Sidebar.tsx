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
    { icon: Home, path: '/', label: 'Home' },
    { icon: LayoutGrid, path: '/feed', label: 'Moments' },
    { icon: MessageCircle, path: '/chat', label: 'Chat' },
    { icon: Calendar, path: '/timeline', label: 'Timeline' },
  ];

  const secondaryItems = [
    { icon: Music, path: '/playlist', label: 'Pulse' },
    { icon: BookHeart, path: '/letters', label: 'Letters' },
    { icon: Ghost, path: '/jokes', label: 'Laughter' },
    { icon: Sparkles, path: '/planner', label: 'Planner' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 hidden lg:flex flex-col p-6 gap-8 border-r border-black/[0.03] bg-white z-[900]">
      <div className="flex items-center gap-3 px-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-100">
          <Heart size={16} className="text-white fill-white" />
        </div>
        <h1 className="text-lg font-outfit font-bold text-charcoal tracking-tight">Kadhi Tari</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400 px-4 mb-2">Universe</p>
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400 px-4 mb-2">Resonance</p>
          {secondaryItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Link 
          to="/profile/edit"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-warm-500 hover:text-charcoal hover:bg-warm-50 transition-all group font-semibold text-sm"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Settings</span>
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
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative font-semibold text-sm",
        isActive 
          ? "bg-rose-50 text-rose-600" 
          : "text-warm-500 hover:text-charcoal hover:bg-warm-50"
      )}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
      
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute right-2 w-1 h-4 bg-rose-500 rounded-full"
        />
      )}
    </Link>
  );
}
