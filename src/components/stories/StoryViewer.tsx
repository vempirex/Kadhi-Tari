import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, ChevronLeft, ChevronRight, Zap, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

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
  const [comment, setComment] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-[#050506] flex items-center justify-center overflow-hidden"
    >
      {/* Background Blur Image - More Cinematic */}
      <div className="absolute inset-0 opacity-[0.15] scale-125 blur-[120px] pointer-events-none transition-all duration-[2s]">
        <img src={currentStory.image_url} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative w-full max-w-2xl h-full sm:h-[92vh] sm:max-h-[960px] sm:rounded-[4rem] overflow-hidden flex flex-col shadow-[0_100px_200px_rgba(0,0,0,0.9)] border-white/5 sm:border bg-[#050506]">
        {/* Progress Bars - Premium Style */}
        <div className="absolute top-10 left-10 right-10 flex gap-2.5 z-[1001]">
          {stories.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-3xl shadow-inner border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-400 shadow-[0_0_20px_rgba(244,63,94,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: i === activeIdx ? `${progress}%` : i < activeIdx ? '100%' : '0%' }}
                transition={{ type: 'tween', ease: 'linear' }}
              />
            </div>
          ))}
        </div>

        {/* Header - More Elegant */}
        <div className="absolute top-16 left-10 right-10 flex justify-between items-center z-[1001] text-white">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-16 h-16 rounded-[2rem] p-[3px] bg-gradient-to-tr from-rose-500 to-orange-400 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                <div className="w-full h-full rounded-[1.8rem] border-[4px] border-[#050506] overflow-hidden bg-white/5">
                  <img 
                    src={currentStory.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory.profiles?.username}`} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-[3px] border-[#050506] shadow-xl" />
            </div>
            <div className="space-y-1.5">
              <span className="text-lg font-serif tracking-tight block leading-none text-white/95 group-hover:text-rose-400 transition-colors">
                {currentStory.profiles?.display_name || currentStory.profiles?.username}
              </span>
              <div className="flex items-center gap-2">
                <Sparkles size={10} className="text-rose-400 animate-pulse" />
                <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] block">
                  {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-5 bg-white/5 backdrop-blur-3xl rounded-[1.8rem] hover:bg-white/10 transition-all border border-white/5 active:scale-90 group shadow-2xl"
          >
            <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#050506] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ scale: 1.2, opacity: 0, rotate: 2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: -2 }}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
              className="w-full h-full relative z-20"
            >
              <img 
                src={currentStory.image_url} 
                alt="Story content" 
                className="w-full h-full object-contain"
              />
              {/* Subtle Overlay Vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls (Desktop) - Enhanced */}
          <div className="hidden sm:flex absolute inset-x-8 top-1/2 -translate-y-1/2 justify-between z-[1010] pointer-events-none">
            <button 
              onClick={onPrev}
              disabled={activeIdx === 0}
              className="p-6 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/5 text-white pointer-events-auto hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-500 active:scale-90 disabled:opacity-0 shadow-2xl group"
            >
              <ChevronLeft size={36} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onNext}
              className="p-6 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/5 text-white pointer-events-auto hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-500 active:scale-90 shadow-2xl group"
            >
              <ChevronRight size={36} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Tap Zones (Mobile) */}
          <div className="absolute inset-0 flex sm:hidden z-[1005]">
            <div className="flex-1 cursor-pointer" onClick={onPrev} />
            <div className="flex-1 cursor-pointer" onClick={onNext} />
          </div>
        </div>

        {/* Bottom Actions - Sanctuary Reimagined */}
        <div className="p-10 pb-14 sm:pb-10 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-6 z-[1001] relative">
          <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-2 pl-8 flex items-center gap-4 border border-white/5 group focus-within:border-rose-500/30 transition-all duration-700 shadow-2xl">
            <MessageCircle size={20} className="text-white/20 group-focus-within:text-rose-500 transition-colors" />
            <input 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Whisper a response..." 
              className="bg-transparent border-none outline-none text-base text-white placeholder:text-white/20 w-full font-medium"
            />
            <Button 
              size="lg" 
              className="h-14 w-14 rounded-full p-0 flex items-center justify-center shrink-0 shadow-2xl"
              disabled={!comment.trim()}
            >
              <Send size={22} className="rotate-[-20deg] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
          <button className="p-6 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/5 text-white hover:text-rose-500 hover:border-rose-500/20 transition-all duration-700 active:scale-125 group shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 transition-colors" />
            <Heart size={32} className="group-hover:fill-rose-500 transition-all duration-500 relative z-10" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
