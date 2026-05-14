import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Story {
  id: string;
  user_id: string;
  type: 'image' | 'text';
  content: string;
  bg_color?: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

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
      }, 50); // 5 seconds total (50ms * 100)
      return () => clearInterval(timer);
    }
  }, [activeStoryIdx]);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*, profiles(username, avatar_url)')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (!error && data) setStories(data);
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
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
      {/* Add Story Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-500/30 flex items-center justify-center bg-rose-500/5 cursor-pointer hover:bg-rose-500/10 transition-colors">
          <Plus size={24} className="text-rose-400" />
        </div>
        <span className="text-[10px] text-gray-500 font-medium">Add</span>
      </div>

      {/* Story List */}
      {stories.map((story, idx) => (
        <button
          key={story.id}
          onClick={() => { setActiveStoryIdx(idx); setProgress(0); }}
          className="flex flex-col items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-peach-300 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border-2 border-[#050506] overflow-hidden bg-card-bg">
              <img 
                src={story.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.profiles?.username}`} 
                alt={story.profiles?.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium truncate w-16 text-center">
            {story.profiles?.username || 'User'}
          </span>
        </button>
      ))}

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {stories.map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: i === activeStoryIdx ? `${progress}%` : i < activeStoryIdx ? '100%' : '0%' }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-10 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <img src={stories[activeStoryIdx].profiles?.avatar_url} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold">{stories[activeStoryIdx].profiles?.username}</span>
              </div>
              <button onClick={() => setActiveStoryIdx(null)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="w-full h-full relative">
              {stories[activeStoryIdx].type === 'image' ? (
                <img 
                  src={stories[activeStoryIdx].content} 
                  alt="" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center p-12 text-center"
                  style={{ backgroundColor: stories[activeStoryIdx].bg_color || '#ff7b9c' }}
                >
                  <p className="text-3xl font-serif leading-relaxed italic text-white drop-shadow-lg">
                    {stories[activeStoryIdx].content}
                  </p>
                </div>
              )}

              {/* Navigation Zones */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 cursor-pointer" onClick={handlePrev} />
                <div className="flex-1 cursor-pointer" onClick={handleNext} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
