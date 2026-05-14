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
      <div className="flex flex-col items-center gap-12 flex-shrink-0">
        <div className="w-[15rem] h-[15rem] sm:w-[22rem] sm:h-[22rem] rounded-[6rem] bg-white/[0.01] animate-pulse border-4 border-white/5 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent" />
        </div>
        <div className="w-16 h-4 bg-white/[0.02] rounded-full animate-pulse" />
      </div>
    );
  }

  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-12 flex-shrink-0 group">
        <button 
          onClick={onClick}
          className="relative group/btn"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.85 }}
            className="w-[15rem] h-[15rem] sm:w-[22rem] sm:h-[22rem] rounded-[6rem] border-[6px] border-dashed border-rose-500/15 flex items-center justify-center bg-rose-500/[0.02] group-hover:bg-rose-500/[0.08] group-hover:border-rose-500/60 transition-all duration-[1500ms] shadow-[0_80px_200px_rgba(0,0,0,1)] relative overflow-hidden shadow-inner"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]" />
            <Plus size-[12rem] className="text-rose-500/20 group-hover:text-rose-500 group-hover:scale-125 group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" strokeWidth={0.01} />
          </motion.div>
          <div className="absolute -bottom-4 -right-4 w-[6rem] h-[6rem] rounded-[2.5rem] bg-gradient-to-br from-rose-950 via-rose-500 to-rose-950 flex items-center justify-center text-white shadow-[0_30px_80px_rgba(244,63,94,0.7)] border-[6px] border-[#050506] group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-[1500ms] z-20 overflow-hidden">
             <div className="absolute inset-0 bg-white/20 blur-[15px]" />
            <Camera size-[3.5rem] fill="currentColor" className="opacity-95 relative z-10 drop-shadow-2xl" strokeWidth={0.01} />
          </div>
        </button>
        <div className="flex items-center gap-8 opacity-20 group-hover:opacity-100 transition-all duration-[1500ms] scale-90 group-hover:scale-110">
          <Sparkles size-[3rem] className="text-rose-500 animate-pulse drop-shadow-2xl" strokeWidth={1} />
          <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.8em] group-hover:text-rose-500 transition-colors italic drop-shadow-3xl">Genesis</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12 flex-shrink-0 group">
      <button
        onClick={onClick}
        className="relative"
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: -15 }}
          whileTap={{ scale: 0.85 }}
          className="w-[15rem] h-[15rem] sm:w-[22rem] sm:h-[22rem] rounded-[7rem] p-[6px] bg-gradient-to-tr from-rose-950 via-rose-500 to-orange-950 shadow-[0_80px_200px_rgba(0,0,0,1)] group-hover:shadow-[0_80px_250px_rgba(244,63,94,0.6)] transition-all duration-[1500ms] shadow-inner overflow-hidden"
        >
           <div className="absolute inset-0 bg-white/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-all" />
          <div className="w-full h-full rounded-[6.5rem] border-[15px] border-[#050506] overflow-hidden bg-[#0a0a0c] relative z-10 shadow-inner">
            <img 
              src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username}`} 
              alt={story.profiles?.username}
              className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-[8s] grayscale-[0.6] group-hover:grayscale-0 brightness-[0.6] group-hover:brightness-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]" />
          </div>
        </motion.div>
        <div className="absolute -bottom-4 -right-4 w-[4rem] h-[4rem] rounded-full bg-rose-500 border-[6px] border-[#050506] shadow-[0_20px_60px_rgba(244,63,94,1)] animate-pulse z-20 shadow-inner" />
      </button>
      <div className="flex items-center gap-6 opacity-30 group-hover:opacity-100 transition-all duration-[1500ms] scale-90 group-hover:scale-110">
        <Star size-[2.5rem] className="text-gray-950 group-hover:text-rose-500 fill-current drop-shadow-3xl" strokeWidth={0.01} />
        <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.5em] truncate w-[15rem] sm:w-[22rem] text-center group-hover:text-rose-500 transition-colors duration-[1500ms] px-2 italic drop-shadow-3xl">
          {story.profiles?.display_name?.split(' ')[0] || story.profiles?.username}
        </span>
      </div>
    </div>
  );
}
