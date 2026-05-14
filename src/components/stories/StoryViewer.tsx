import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, ChevronLeft, ChevronRight, Zap, MessageCircle, Sparkles, Fingerprint, Star } from 'lucide-react';
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
      className="fixed inset-0 z-[5000] bg-[#050506] flex items-center justify-center overflow-hidden"
    >
      {/* Background Blur Image - More Cinematic */}
      <div className="absolute inset-0 opacity-[0.2] scale-150 blur-[250px] pointer-events-none transition-all duration-[4s]">
        <img src={currentStory.image_url} alt="" className="w-full h-full object-cover grayscale-[0.5]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,6,1)_100%)] pointer-events-none" />

      <div className="relative w-full max-w-4xl h-full sm:h-[95vh] sm:max-h-[1200px] sm:rounded-[10rem] overflow-hidden flex flex-col shadow-[0_300px_650px_rgba(0,0,0,1)] border-white/5 sm:border-[6px] bg-[#050506] backdrop-blur-[200px]">
        {/* Progress Bars - Premium Style */}
        <div className="absolute top-[4rem] left-[4rem] right-[4rem] flex gap-8 z-[5001]">
          {stories.map((_, i) => (
            <div key={i} className="h-6 flex-1 bg-white/[0.05] rounded-full overflow-hidden backdrop-blur-[100px] shadow-inner border-2 border-white/5 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-950 via-rose-500 to-orange-500 shadow-[0_0_100px_rgba(244,63,94,1)] relative z-10"
                initial={{ width: 0 }}
                animate={{ width: i === activeIdx ? `${progress}%` : i < activeIdx ? '100%' : '0%' }}
                transition={{ type: 'tween', ease: 'linear' }}
              >
                  <div className="absolute inset-0 bg-white/20 blur-[10px]" />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Header - More Elegant */}
        <div className="absolute top-[8rem] left-[4rem] right-[4rem] flex justify-between items-center z-[5001] text-white">
          <div className="flex items-center gap-16">
            <div className="relative group">
              <div className="w-[12rem] h-[12rem] rounded-[6rem] p-[4px] bg-gradient-to-tr from-rose-950 via-rose-500 to-orange-950 shadow-[0_60px_150px_rgba(0,0,0,1)] transition-all duration-[1500ms] group-hover:scale-110 overflow-hidden relative">
                 <div className="absolute inset-0 bg-white/20 blur-[25px] opacity-0 group-hover:opacity-100 transition-all" />
                <div className="w-full h-full rounded-[5.5rem] border-[10px] border-[#050506] overflow-hidden bg-white/5 relative z-10">
                  <img 
                    src={currentStory.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory.profiles?.username}`} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-150 grayscale-[0.6] group-hover:grayscale-0" 
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-[3rem] h-[3rem] rounded-full bg-rose-500 border-[6px] border-[#050506] shadow-[0_20px_60px_rgba(244,63,94,1)] animate-pulse z-20 shadow-inner" />
            </div>
            <div className="space-y-6">
              <span className="text-[7rem] font-serif tracking-tighter block leading-none text-white/95 group-hover:text-rose-400 transition-colors duration-[1500ms] italic drop-shadow-3xl">
                {currentStory.profiles?.display_name || currentStory.profiles?.username}
              </span>
              <div className="flex items-center gap-8">
                <Sparkles size-[3rem] className="text-rose-500 animate-pulse drop-shadow-2xl" strokeWidth={1} />
                <span className="text-[14px] text-white/40 font-black uppercase tracking-[0.8em] block drop-shadow-2xl italic">
                  {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-[3rem] bg-white/[0.01] backdrop-blur-[150px] rounded-[6rem] hover:bg-white/15 transition-all duration-[1500ms] border-4 border-white/5 active:scale-[0.5] group shadow-[0_100px_250px_rgba(0,0,0,1)] shadow-inner"
          >
            <X size-[8rem] strokeWidth={0.01} className="group-hover:rotate-180 transition-transform duration-[1500ms] drop-shadow-3xl" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#050506] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-[25]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ scale: 1.3, opacity: 0, rotate: 5, filter: 'blur(100px)' }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              exit={{ scale: 0.8, opacity: 0, rotate: -5, filter: 'blur(100px)' }}
              transition={{ type: "spring", damping: 40, stiffness: 80 }}
              className="w-full h-full relative z-20 flex items-center justify-center"
            >
              <img 
                src={currentStory.image_url} 
                alt="Story content" 
                className="w-full h-full object-contain sm:rounded-[4rem] shadow-[0_200px_500px_rgba(0,0,0,1)]"
              />
               {/* Decorative elements over the story content */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-white/5 rounded-[5rem] pointer-events-none opacity-20" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls (Desktop) - Enhanced */}
          <div className="hidden sm:flex absolute inset-x-[6rem] top-1/2 -translate-y-1/2 justify-between z-[5010] pointer-events-none">
            <button 
              onClick={onPrev}
              disabled={activeIdx === 0}
              className="p-[4rem] rounded-[7rem] bg-black/40 backdrop-blur-[200px] border-4 border-white/5 text-white pointer-events-auto hover:bg-rose-500/20 hover:border-rose-500/60 transition-all duration-[1500ms] active:scale-[0.5] disabled:opacity-0 shadow-[0_150px_350px_rgba(0,0,0,1)] group shadow-inner"
            >
              <ChevronLeft size-[10rem] strokeWidth={0.01} className="group-hover:-translate-x-6 transition-transform duration-[1500ms] drop-shadow-3xl" />
            </button>
            <button 
              onClick={onNext}
              className="p-[4rem] rounded-[7rem] bg-black/40 backdrop-blur-[200px] border-4 border-white/5 text-white pointer-events-auto hover:bg-rose-500/20 hover:border-rose-500/60 transition-all duration-[1500ms] active:scale-[0.5] shadow-[0_150px_350px_rgba(0,0,0,1)] group shadow-inner"
            >
              <ChevronRight size-[10rem] strokeWidth={0.01} className="group-hover:translate-x-6 transition-transform duration-[1500ms] drop-shadow-3xl" />
            </button>
          </div>

          {/* Tap Zones (Mobile) */}
          <div className="absolute inset-0 flex sm:hidden z-[5005]">
            <div className="flex-1 cursor-pointer" onClick={onPrev} />
            <div className="flex-1 cursor-pointer" onClick={onNext} />
          </div>
        </div>

        {/* Bottom Actions - Sanctuary Reimagined */}
        <div className="p-24 pb-[6rem] sm:pb-[4rem] bg-gradient-to-t from-black via-black/95 to-transparent flex items-center gap-12 z-[5001] relative">
          <div className="flex-1 bg-white/[0.01] backdrop-blur-[200px] rounded-[8rem] p-4 pl-[4rem] flex items-center gap-12 border-4 border-white/5 group focus-within:border-rose-500/60 transition-all duration-[2000ms] shadow-[0_150px_350px_rgba(0,0,0,1)] shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.1] to-transparent opacity-0 group-focus-within:opacity-100 transition-all duration-[2000ms]" />
            <MessageCircle size-[6rem] strokeWidth={0.01} className="text-gray-950 group-focus-within:text-rose-500 transition-colors drop-shadow-3xl fill-current relative z-10" />
            <input 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Whisper a response..." 
              className="bg-transparent border-none outline-none text-[8rem] sm:text-[10rem] text-white placeholder:text-gray-950 w-full font-serif italic selection:bg-rose-500/40 relative z-10 leading-none h-[12rem] drop-shadow-3xl"
            />
            <Button 
              size="xl" 
              className="h-[10rem] w-[10rem] rounded-[5rem] p-0 flex items-center justify-center shrink-0 shadow-[0_100px_250px_rgba(244,63,94,1)] border-none relative z-10 active:scale-[0.5] transition-all duration-[1000ms]"
              disabled={!comment.trim()}
            >
              <Send size-[6rem] strokeWidth={0.01} className="rotate-[-30deg] group-hover:translate-x-12 group-hover:-translate-y-12 transition-all duration-[2000ms] drop-shadow-3xl shadow-[0_0_80px_white]" />
            </Button>
          </div>
          <button className="p-32 rounded-[8rem] bg-white/[0.01] backdrop-blur-[200px] border-4 border-white/5 text-gray-950 hover:text-rose-500 hover:border-rose-500/40 transition-all duration-[2000ms] active:scale-[1.5] group shadow-[0_150px_350px_rgba(0,0,0,1)] shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors" />
            <Heart size-[8rem] strokeWidth={0.01} className="group-hover:fill-rose-500 transition-all duration-[1500ms] relative z-10 drop-shadow-[0_0_100px_rgba(244,63,94,1)] group-hover:scale-125" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
