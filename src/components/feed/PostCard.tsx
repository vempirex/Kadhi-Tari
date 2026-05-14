import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Bookmark, Sparkles, Zap, History, Command } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

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
  const [comment, setComment] = useState('');

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  return (
    <Card 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden w-full max-w-2xl mx-auto border-white/5 bg-white/[0.01] shadow-[0_50px_100px_rgba(0,0,0,0.5)] group/card"
    >
      {/* Post Header - More Elegant */}
      <div className="p-6 sm:p-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-14 h-14 rounded-[1.8rem] p-[2px] bg-gradient-to-tr from-rose-500/50 to-orange-400/50 group-hover:from-rose-500 group-hover:to-orange-400 transition-all duration-700">
              <div className="w-full h-full rounded-[1.6rem] border-[4px] border-[#050506] overflow-hidden bg-white/5">
                <img 
                  src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={post.profiles?.username} 
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-[2px] border-[#050506] shadow-xl" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-serif text-white/90 leading-tight tracking-tight group-hover:text-rose-400 transition-colors">
              {post.profiles?.display_name || post.profiles?.username}
            </p>
            <div className="flex items-center gap-2">
              <History size={10} className="text-gray-600" />
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <button className="text-gray-600 hover:text-white p-4 hover:bg-white/5 rounded-2xl transition-all duration-500 active:scale-90 border border-transparent hover:border-white/5">
          <MoreHorizontal size={22} />
        </button>
      </div>

      {/* Post Media - Cinematic Frame */}
      <div 
        className="relative aspect-square sm:aspect-[4/5] bg-black overflow-hidden cursor-pointer group/media"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.post_photos[0]?.image_url} 
          className="w-full h-full object-cover transition-all duration-[2s] group-hover/media:scale-105 group-hover/media:blur-[1px] group-hover/media:opacity-80" 
          alt="Memory" 
          loading="lazy"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover/media:opacity-100 transition-opacity duration-1000 bg-black/20 pointer-events-none" />
        
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -35 }}
              animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 35 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={120} className="text-rose-500 fill-rose-500 drop-shadow-[0_0_60px_rgba(244,63,94,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Details Hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-all duration-700 pointer-events-none">
          <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3 scale-90 group-hover/media:scale-100 transition-transform">
            <Zap size={12} className="text-rose-500 animate-pulse" />
            Double Tap to Heart
          </div>
        </div>
      </div>

      {/* Post Actions - Reimagined */}
      <div className="p-8 sm:p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.button 
              whileTap={{ scale: 1.6, rotate: -25 }}
              onClick={() => setIsLiked(!isLiked)}
              className={twMerge(
                "transition-all duration-700 group/btn", 
                isLiked ? "text-rose-500" : "text-gray-600 hover:text-rose-400"
              )}
            >
              <Heart size={30} className={twMerge("transition-all duration-700", isLiked ? "fill-rose-500 scale-110 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]" : "group-hover/btn:scale-110")} strokeWidth={2.5} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 1.3 }}
              onClick={() => setShowComments(!showComments)} 
              className={twMerge(
                "transition-all duration-700 group/btn",
                showComments ? "text-rose-400" : "text-gray-600 hover:text-rose-400"
              )}
            >
              <MessageCircle size={30} className={twMerge("transition-all duration-700", showComments ? "fill-rose-500/20" : "group-hover/btn:scale-110")} strokeWidth={2.5} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 1.3 }}
              className="text-gray-600 hover:text-rose-400 transition-all duration-700 group/btn"
            >
              <Share2 size={30} className="group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
            </motion.button>
          </div>
          <motion.button 
            whileTap={{ scale: 1.3 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={twMerge(
              "transition-all duration-700 group/btn",
              isBookmarked ? "text-rose-400" : "text-gray-600 hover:text-rose-400"
            )}
          >
            <Bookmark size={30} className={twMerge("transition-all duration-700", isBookmarked ? "fill-rose-400" : "group-hover/btn:scale-110")} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Caption Area - Premium Typography */}
        <div className="space-y-6">
          <div className="flex gap-5 items-start">
            <div className="mt-1.5 px-3 py-1 rounded-full bg-rose-500/5 border border-rose-500/10 flex items-center gap-2 flex-shrink-0">
              <Sparkles size={10} className="text-rose-400 animate-pulse" />
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.3em]">Moment</span>
            </div>
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl leading-relaxed text-gray-300 font-serif italic">
                <span className="font-black text-white not-italic uppercase tracking-tighter mr-3 text-sm">{post.profiles?.username}</span>
                "{post.caption}"
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-[11px] text-gray-600 font-black uppercase tracking-[0.4em] hover:text-rose-400 transition-all duration-500 flex items-center gap-3 pl-16 group/explore"
          >
            Explore whispers <div className="w-10 h-[1px] bg-gray-800 group-hover:w-16 group-hover:bg-rose-500/40 transition-all duration-700" /> 12 responses
          </button>
        </div>

        {/* Comment Section (Inline Sanctuary) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pt-10 border-t border-white/5 overflow-hidden"
            >
              <div className="space-y-6 mb-10 max-h-64 overflow-y-auto no-scrollbar px-2">
                <div className="flex gap-5 items-start group/comment">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover/comment:scale-110 transition-transform">
                    <Heart size={16} className="text-rose-400 fill-rose-400/20" />
                  </div>
                  <div className="flex-1 bg-white/[0.02] rounded-[1.8rem] p-6 border border-white/5 group-hover/comment:border-rose-500/20 transition-all duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Sanctuary Keeper</p>
                      <div className="w-1 h-1 rounded-full bg-gray-800" />
                      <span className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">System</span>
                    </div>
                    <p className="text-base text-gray-400 italic font-handwritten leading-relaxed">
                      "This specific shared breath has been safely archived in our eternal frequency. It resonates forever..."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 p-2 bg-white/[0.02] rounded-[2.5rem] border border-white/5 focus-within:border-rose-500/30 transition-all duration-700 group/input">
                <input 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Whisper a thought..." 
                  className="flex-1 bg-transparent px-8 py-5 text-base outline-none text-white placeholder:text-gray-700 font-medium"
                />
                <Button 
                  size="lg"
                  disabled={!comment.trim()}
                  className="rounded-full w-14 h-14 p-0 flex items-center justify-center shrink-0 shadow-2xl"
                >
                  <Send size={22} className="rotate-[-20deg] group-hover/input:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
