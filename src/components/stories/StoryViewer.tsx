import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StoryViewerProps {
  stories: any[];
  activeIdx: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
}

export default function StoryViewer({ stories, activeIdx, onClose, onNext, onPrev, progress }: StoryViewerProps) {
  const currentStory = stories[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#050506] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* Background Blur Image */}
      <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none scale-150">
        <img src={currentStory.image_url} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative w-full max-w-xl h-full sm:h-[95vh] sm:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl bg-black">
        {/* Progress Bars */}
        <div className="absolute top-6 left-4 right-4 flex gap-1.5 z-30">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: i === activeIdx ? `${progress}%` : i < activeIdx ? '100%' : '0%' }}
                transition={{ type: 'tween', ease: 'linear' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-4 right-4 flex justify-between items-center z-30 text-white px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white/5">
              <img 
                src={currentStory.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory.profiles?.username}`} 
                alt="" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <span className="text-sm font-bold block leading-none">{currentStory.profiles?.display_name || currentStory.profiles?.username}</span>
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mt-1.5 block">
                {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-[#0a0a0c] flex items-center justify-center">
          <img 
            src={currentStory.image_url} 
            alt="Story content" 
            className="w-full h-full object-contain"
          />

          {/* Navigation Controls (Desktop) */}
          <div className="hidden sm:flex absolute inset-x-4 top-1/2 -translate-y-1/2 justify-between z-40 pointer-events-none">
            <button 
              onClick={onPrev}
              disabled={activeIdx === 0}
              className="p-4 rounded-full bg-black/40 border border-white/10 text-white pointer-events-auto hover:bg-black/60 transition-all active:scale-90 disabled:opacity-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={onNext}
              className="p-4 rounded-full bg-black/40 border border-white/10 text-white pointer-events-auto hover:bg-black/60 transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Tap Zones (Mobile) */}
          <div className="absolute inset-0 flex sm:hidden">
            <div className="flex-1 cursor-pointer" onClick={onPrev} />
            <div className="flex-1 cursor-pointer" onClick={onNext} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 pb-10 sm:pb-6 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-4 z-30">
          <div className="flex-1 glass-panel rounded-full p-1 pl-5 flex items-center gap-2 border-white/10 group focus-within:border-rose-500/50 transition-all">
            <input 
              placeholder="Send a whisper..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-full font-medium"
            />
            <button className="p-3.5 rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/20 active:scale-90 transition-transform">
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
          <button className="p-4.5 rounded-full glass-panel border-white/10 text-white hover:text-rose-400 hover:border-rose-500/30 transition-all active:scale-110 group">
            <Heart size={26} className="group-hover:fill-rose-500 transition-all" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
