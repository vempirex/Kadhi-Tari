import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Bookmark, Sparkles, Zap, History, Command, Fingerprint, Shield, Sun, Moon, Wind } from 'lucide-react';
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
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  return (
    <Card 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden bg-white border border-warm-100 shadow-soft"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-warm-100 overflow-hidden bg-warm-50">
              <img 
                src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username}`} 
                className="w-full h-full object-cover" 
                alt={post.profiles?.username} 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-charcoal leading-none">
              {post.profiles?.display_name || post.profiles?.username}
            </p>
            <p className="text-[10px] text-warm-400 font-bold uppercase tracking-wider mt-1">
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button className="text-warm-400 hover:text-charcoal p-2 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Media */}
      <div 
        className="relative aspect-square sm:aspect-[4/5] bg-warm-50 overflow-hidden cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.post_photos[0]?.image_url} 
          className="w-full h-full object-cover" 
          alt="Memory" 
          loading="lazy"
        />
        
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={100} className="text-white fill-white drop-shadow-xl" />
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
              className={twMerge(
                "transition-all", 
                isLiked ? "text-rose-600 scale-110" : "text-warm-400 hover:text-rose-600"
              )}
            >
              <Heart size={24} className={twMerge(isLiked && "fill-rose-600")} />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)} 
              className={twMerge(
                "transition-all",
                showComments ? "text-blue-600" : "text-warm-400 hover:text-blue-600"
              )}
            >
              <MessageCircle size={24} />
            </button>
            <button className="text-warm-400 hover:text-emerald-600 transition-all">
              <Share2 size={24} />
            </button>
          </div>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={twMerge(
              "transition-all",
              isBookmarked ? "text-amber-600" : "text-warm-400 hover:text-amber-600"
            )}
          >
            <Bookmark size={24} className={twMerge(isBookmarked && "fill-amber-600")} />
          </button>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <span className="text-sm font-bold text-charcoal">@{post.profiles?.username}</span>
            <p className="text-sm text-warm-600 leading-relaxed font-medium">
              {post.caption}
            </p>
          </div>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-[10px] font-bold text-warm-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
          >
            {showComments ? 'Hide Whispers' : 'Explore Whispers'}
          </button>
        </div>

        {/* Comment Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-warm-100 space-y-4"
            >
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                  <Sparkles size={12} />
                </div>
                <div className="bg-warm-50 rounded-2xl p-3 flex-1">
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">Sanctuary Keeper</p>
                  <p className="text-xs text-warm-500 font-medium leading-relaxed">
                    This shared memory has been synchronized in our private frequency. It resonates forever.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 bg-warm-50 rounded-xl p-2 focus-within:bg-white focus-within:border-warm-200 border border-transparent transition-all">
                <input 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Whisper a thought..." 
                  className="flex-1 bg-transparent px-2 py-1 text-xs outline-none text-charcoal placeholder:text-warm-300 font-medium"
                />
                <button 
                  onClick={() => setComment('')}
                  disabled={!comment.trim()}
                  className="text-rose-600 disabled:opacity-30 p-1"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
