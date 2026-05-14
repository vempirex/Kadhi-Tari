import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Camera, Loader2, Sparkles, Send, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import UploadModal from './UploadModal';

interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
    display_name: string;
  };
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (activeStoryIdx !== null) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 5 seconds total (100 * 50ms)
      return () => clearInterval(timer);
    }
  }, [activeStoryIdx]);

  const fetchStories = async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('stories')
      .select('*, profiles(username, avatar_url, display_name)')
      .gt('expires_at', now)
      .order('created_at', { ascending: false });
    
    if (!error && data) setStories(data as any);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (activeStoryIdx !== null && activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
      setProgress(0);
    } else {
      setActiveStoryIdx(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
      setProgress(0);
    }
  };

  return (
    <div className="relative z-[20]">
      <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar px-2 py-2">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="group relative"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-500/40 flex items-center justify-center bg-rose-500/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/60 transition-all duration-300">
              <Plus size={28} className="text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg border-2 border-[#050506]">
              <Camera size={12} />
            </div>
          </button>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Story</span>
        </div>

        {/* Story List */}
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="w-16 h-16 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
          ))
        ) : (
          stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => { setActiveStoryIdx(idx); setProgress(0); }}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-400 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-rose-500/5">
                <div className="w-full h-full rounded-full border-[2.5px] border-[#050506] overflow-hidden bg-white/5">
                  <img 
                    src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username || 'user'}`} 
                    alt={story.profiles?.username}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate w-16 text-center group-hover:text-rose-400 transition-colors">
                {story.profiles?.display_name?.split(' ')[0] || story.profiles?.username}
              </span>
            </button>
          ))
        )}
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={fetchStories} 
        type="story" 
      />

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none" />
            
            {/* Background Blur Image */}
            <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none scale-150">
              <img src={stories[activeStoryIdx].image_url} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="relative w-full max-w-lg h-full md:h-[90vh] md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
              {/* Progress Bars */}
              <div className="absolute top-6 left-4 right-4 flex gap-1.5 z-30">
                {stories.map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      initial={{ width: 0 }}
                      animate={{ width: i === activeStoryIdx ? `${progress}%` : i < activeStoryIdx ? '100%' : '0%' }}
                      transition={{ type: 'tween', ease: 'linear' }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-10 left-4 right-4 flex justify-between items-center z-30 text-white px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                    <img 
                      src={stories[activeStoryIdx].profiles?.avatar_url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold block leading-none">{stories[activeStoryIdx].profiles?.display_name || stories[activeStoryIdx].profiles?.username}</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1 block">
                      {new Date(stories[activeStoryIdx].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveStoryIdx(null)} 
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 relative bg-black/40">
                <img 
                  src={stories[activeStoryIdx].image_url} 
                  alt="" 
                  className="w-full h-full object-contain md:object-cover"
                />

                {/* Navigation Zones */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 cursor-pointer" onClick={handlePrev} />
                  <div className="flex-1 cursor-pointer" onClick={handleNext} />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 z-30">
                <div className="flex-1 glass-panel rounded-full p-1 pl-4 flex items-center gap-2 border-white/20">
                  <input 
                    placeholder="Whisper something..." 
                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full font-medium"
                  />
                  <button className="p-3 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                    <Send size={16} />
                  </button>
                </div>
                <button className="p-4 rounded-full glass-panel border-white/20 text-white hover:text-rose-400 transition-colors">
                  <Heart size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

