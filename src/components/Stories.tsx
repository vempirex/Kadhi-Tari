import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Camera, Loader2, Sparkles, Send } from 'lucide-react';
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
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      }, 50);
      return () => clearInterval(timer);
    }
  }, [activeStoryIdx]);

  const fetchStories = async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('stories')
      .select('*, profiles(username, avatar_url)')
      .gt('expires_at', now)
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

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(fileName);

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: insertError } = await supabase.from('stories').insert({
        user_id: user.id,
        type: 'image',
        content: publicUrl,
        expires_at: expiresAt.toISOString()
      });

      if (insertError) throw insertError;

      fetchStories();
      setIsAddingStory(false);
    } catch (err) {
      console.error("Story error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar px-2 py-2">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <label className="relative cursor-pointer group">
            <input type="file" accept="image/*" className="hidden" onChange={handleAddStory} disabled={uploading} />
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-500/40 flex items-center justify-center bg-rose-500/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/60 transition-all duration-300">
              {uploading ? <Loader2 className="animate-spin text-rose-500" size={24} /> : <Plus size={28} className="text-rose-400 group-hover:scale-110 transition-transform" />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg border-2 border-[#050506] group-hover:scale-110 transition-transform">
              <Camera size={12} />
            </div>
          </label>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Story</span>
        </div>

        {/* Story List */}
        {stories.map((story, idx) => (
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
              {story.profiles?.username?.split(' ')[0] || 'Sanctuary'}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStoryIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 pointer-events-none" />
            
            {/* Background Blur Image */}
            <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none scale-150">
              <img src={stories[activeStoryIdx].content} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
              {stories.map((_, i) => (
                <div key={i} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
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
            <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <img 
                    src={stories[activeStoryIdx].profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stories[activeStoryIdx].profiles?.username}`} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <span className="text-sm font-bold block leading-none">{stories[activeStoryIdx].profiles?.username}</span>
                  <span className="text-[10px] text-white/50 font-medium uppercase tracking-widest">
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
            <div className="w-full max-w-lg aspect-[9/16] relative shadow-2xl rounded-3xl overflow-hidden">
              {stories[activeStoryIdx].type === 'image' ? (
                <img 
                  src={stories[activeStoryIdx].content} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center p-12 text-center relative"
                  style={{ backgroundColor: stories[activeStoryIdx].bg_color || '#ff7b9c' }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  <p className="text-4xl font-serif leading-relaxed italic text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative z-10">
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

            {/* Bottom Actions */}
            <div className="absolute bottom-10 left-0 right-0 px-6 flex items-center gap-4 z-20">
              <div className="flex-1 glass-panel rounded-full p-1 pl-4 flex items-center gap-2 border-white/20">
                <input 
                  placeholder="Reply to story..." 
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-full"
                />
                <button className="p-2.5 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                  <Send size={16} />
                </button>
              </div>
              <button className="p-3 rounded-full glass-panel border-white/20 text-white hover:text-rose-400 transition-colors">
                <Heart size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
