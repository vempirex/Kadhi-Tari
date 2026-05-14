import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface PostCardProps {
  post: {
    id: string;
    caption: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url: string;
      display_name: string;
    };
    post_photos: { image_url: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card overflow-hidden w-full max-w-2xl mx-auto"
    >
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full story-ring p-[2px]">
            <div className="w-full h-full rounded-full border-4 border-[#050506] overflow-hidden bg-card-bg">
              <img 
                src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username}`} 
                className="w-full h-full object-cover" 
                alt={post.profiles?.username} 
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{post.profiles?.display_name || post.profiles?.username}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white p-2 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Media */}
      <div 
        className="relative aspect-square sm:aspect-[4/5] bg-[#0a0a0c] overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.post_photos[0]?.image_url} 
          className="w-full h-full object-cover" 
          alt="Memory" 
          loading="lazy"
        />
        
        {/* Animated Heart Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 20 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={80} className="text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient Overlay for bottom actions if needed */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Post Actions */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={twMerge(
                "transition-all active:scale-150 duration-300", 
                isLiked ? "text-rose-500" : "text-white/80 hover:text-rose-400"
              )}
            >
              <Heart size={24} className={isLiked ? "fill-rose-500" : ""} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="text-white/80 hover:text-rose-400 transition-all active:scale-125"
            >
              <MessageCircle size={24} strokeWidth={2.5} />
            </button>
            <button className="text-white/80 hover:text-rose-400 transition-all active:scale-125">
              <Share2 size={24} strokeWidth={2.5} />
            </button>
          </div>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={twMerge(
              "transition-all active:scale-125",
              isBookmarked ? "text-rose-400" : "text-white/80 hover:text-rose-400"
            )}
          >
            <Bookmark size={24} className={isBookmarked ? "fill-rose-400" : ""} strokeWidth={2.5} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-1.5">
          <p className="text-sm leading-relaxed text-gray-200">
            <span className="font-black text-white mr-2">{post.profiles?.username}</span>
            {post.caption}
          </p>
          <button 
            onClick={() => setShowComments(true)}
            className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-rose-400 transition-colors"
          >
            View all comments
          </button>
        </div>

        {/* Comment Section (Inline) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-white/5 overflow-hidden"
            >
              <div className="space-y-4 mb-4 max-h-40 overflow-y-auto no-scrollbar">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Heart size={10} className="text-rose-400" />
                  </div>
                  <div className="flex-1 bg-white/[0.03] rounded-2xl p-3 border border-white/5">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Sanctuary Bot</p>
                    <p className="text-xs text-gray-400 italic">This memory is being safely stored in our universe...</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 group">
                <input 
                  placeholder="Whisper a thought..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all text-white"
                />
                <button className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90">
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
