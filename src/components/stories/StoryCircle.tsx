import { motion } from 'framer-motion';
import { Plus, Camera, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StoryCircleProps {
  story?: any;
  isAddButton?: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

export default function StoryCircle({ story, isAddButton, onClick, isLoading }: StoryCircleProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 flex-shrink-0">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2.5rem] bg-white/[0.02] animate-pulse border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent" />
        </div>
        <div className="w-14 h-2 bg-white/[0.02] rounded-full animate-pulse" />
      </div>
    );
  }

  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-4 flex-shrink-0 group">
        <button 
          onClick={onClick}
          className="relative group/btn"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2.5rem] border-2 border-dashed border-rose-500/20 flex items-center justify-center bg-rose-500/[0.01] group-hover:bg-rose-500/[0.04] group-hover:border-rose-500/40 transition-all duration-700 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={40} className="text-rose-400/40 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-700" strokeWidth={1.5} />
          </motion.div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-[0_10px_20px_rgba(244,63,94,0.4)] border-[3px] border-[#050506] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <Camera size={16} fill="currentColor" className="opacity-90" />
          </div>
        </button>
        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <Sparkles size={10} className="text-rose-400 animate-pulse" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] group-hover:text-rose-400 transition-colors">You</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 flex-shrink-0 group">
      <button
        onClick={onClick}
        className="relative"
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-[2.8rem] p-[3px] bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-400 shadow-2xl shadow-rose-500/10 group-hover:shadow-rose-500/30 transition-all duration-700"
        >
          <div className="w-full h-full rounded-[2.5rem] border-[6px] border-[#050506] overflow-hidden bg-[#0a0a0c] relative">
            <img 
              src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username}`} 
              alt={story.profiles?.username}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-[3px] border-[#050506] shadow-xl shadow-rose-500/20" />
      </button>
      <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] truncate w-20 sm:w-28 text-center group-hover:text-rose-400 transition-colors duration-500 px-1">
        {story.profiles?.display_name?.split(' ')[0] || story.profiles?.username}
      </span>
    </div>
  );
}
