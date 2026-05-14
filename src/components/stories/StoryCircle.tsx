import { motion } from 'framer-motion';
import { Plus, Camera, Sparkles, Zap, Fingerprint, Star } from 'lucide-react';
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
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-warm-50 animate-pulse border border-warm-100" />
        <div className="w-10 h-3 bg-warm-50 rounded-full animate-pulse" />
      </div>
    );
  }

  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-3 flex-shrink-0 group">
        <button 
          onClick={onClick}
          className="relative group/btn"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-warm-200 flex items-center justify-center bg-white group-hover:bg-rose-50 group-hover:border-rose-200 transition-all shadow-sm"
          >
            <Plus size={32} className="text-warm-300 group-hover:text-rose-500 transition-all" />
          </motion.div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-sm border-2 border-white z-10">
            <Camera size={12} fill="currentColor" />
          </div>
        </button>
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
          <Sparkles size={12} className="text-rose-500" />
          <span className="text-[10px] text-warm-500 font-bold uppercase tracking-widest italic">Add</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 group">
      <button
        onClick={onClick}
        className="relative"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-rose-500 via-rose-300 to-amber-200 shadow-sm transition-all"
        >
          <div className="w-full h-full rounded-[0.85rem] border-2 border-white overflow-hidden bg-warm-50 relative">
            <img 
              src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username}`} 
              alt={story.profiles?.username}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10" />
      </button>
      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
        <span className="text-[10px] text-charcoal font-bold uppercase tracking-widest truncate w-16 sm:w-20 text-center">
          {story.profiles?.display_name?.split(' ')[0] || story.profiles?.username}
        </span>
      </div>
    </div>
  );
}
