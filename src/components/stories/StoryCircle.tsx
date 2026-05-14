import { motion } from 'framer-motion';
import { Plus, Camera } from 'lucide-react';
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/[0.05] animate-pulse" />
        <div className="w-10 h-2 bg-white/[0.05] rounded-full animate-pulse" />
      </div>
    );
  }

  if (isAddButton) {
    return (
      <div className="flex flex-col items-center gap-3 flex-shrink-0 group">
        <button 
          onClick={onClick}
          className="relative"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-rose-500/40 flex items-center justify-center bg-rose-500/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/60 transition-all duration-500">
            <Plus size={28} className="text-rose-400 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg border-2 border-[#050506]">
            <Camera size={12} />
          </div>
        </button>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-rose-400 transition-colors">You</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 group">
      <button
        onClick={onClick}
        className="relative"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-400 group-hover:scale-105 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-rose-500/10">
          <div className="w-full h-full rounded-full border-[3px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
            <img 
              src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username}`} 
              alt={story.profiles?.username}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>
      </button>
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate w-16 sm:w-20 text-center group-hover:text-rose-400 transition-colors">
        {story.profiles?.display_name?.split(' ')[0] || story.profiles?.username}
      </span>
    </div>
  );
}
