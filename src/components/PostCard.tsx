import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
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
    };
    post_photos: { image_url: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card overflow-hidden mb-6"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full story-ring p-[2px]">
            <div className="w-full h-full rounded-full border-2 border-[#050506] overflow-hidden">
              <img src={post.profiles.avatar_url} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">{post.profiles.username}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Media */}
      <div 
        className="relative aspect-square md:aspect-[4/5] bg-card-bg overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.post_photos[0]?.image_url} 
          className="w-full h-full object-cover" 
          alt="" 
          loading="lazy"
        />
        
        {/* Animated Heart Overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={100} className="text-rose-500 fill-rose-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={twMerge("transition-all active:scale-125", isLiked ? "text-rose-500" : "text-white hover:text-rose-400")}
            >
              <Heart size={26} className={isLiked ? "fill-rose-500" : ""} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="text-white hover:text-rose-400 transition-colors">
              <MessageCircle size={26} />
            </button>
            <button className="text-white hover:text-rose-400 transition-colors">
              <Share2 size={26} />
            </button>
          </div>
          <button className="text-white hover:text-rose-400 transition-colors">
            <Bookmark size={26} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-bold mr-2">{post.profiles.username}</span>
            {post.caption}
          </p>
        </div>
      </div>

      {/* Comment Section (Simplified for UI) */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 border-t border-white/5 overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/10" />
                <div className="flex-1 bg-white/5 rounded-2xl p-3">
                  <p className="text-xs font-bold text-rose-400 mb-1">Coming Soon</p>
                  <p className="text-xs text-gray-400 italic">Realtime comments are being wired up...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  placeholder="Add a comment..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-rose-500/50 transition-colors"
                />
                <button className="p-2 text-rose-500 hover:text-rose-400">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Bookmark({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}
