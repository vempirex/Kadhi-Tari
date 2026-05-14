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
      className="fixed inset-0 z-[7000] bg-charcoal flex items-center justify-center overflow-hidden"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 opacity-20 scale-150 blur-3xl pointer-events-none">
        <img src={currentStory.image_url} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative w-full max-w-lg h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden flex flex-col bg-black shadow-2xl border border-white/10">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-50">
          {stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: i === activeIdx ? `${progress}%` : i < activeIdx ? '100%' : '0%' }}
                transition={{ type: 'tween', ease: 'linear' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-rose-500 p-0.5 bg-white">
              <img 
                src={currentStory.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory.profiles?.username}`} 
                alt="" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white drop-shadow-md">
                {currentStory.profiles?.display_name || currentStory.profiles?.username}
              </span>
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest block drop-shadow-md">
                {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/80 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <img 
                src={currentStory.image_url} 
                alt="Story content" 
                className="w-full h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls (Desktop) */}
          <div className="hidden sm:flex absolute inset-x-2 top-1/2 -translate-y-1/2 justify-between z-50 pointer-events-none">
            <button 
              onClick={onPrev}
              disabled={activeIdx === 0}
              className="p-2 rounded-full bg-black/20 text-white pointer-events-auto hover:bg-black/40 transition-all disabled:opacity-0"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={onNext}
              className="p-2 rounded-full bg-black/20 text-white pointer-events-auto hover:bg-black/40 transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Tap Zones (Mobile) */}
          <div className="absolute inset-0 flex sm:hidden z-40">
            <div className="flex-1 cursor-pointer" onClick={onPrev} />
            <div className="flex-1 cursor-pointer" onClick={onNext} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 pb-8 sm:pb-4 flex items-center gap-3 z-50 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 border border-white/20 focus-within:border-white/40 transition-all">
            <input 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Send a message..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/60 w-full"
            />
            <button 
              className="text-white disabled:opacity-40"
              disabled={!comment.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          <button className="text-white hover:text-rose-500 transition-all">
            <Heart size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
