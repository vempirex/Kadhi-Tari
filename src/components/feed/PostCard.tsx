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
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  return (
    <Card 
      initial={{ opacity: 0, y: 150, filter: 'blur(100px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden w-full max-w-[100rem] mx-auto border-[6px] border-white/5 bg-white/[0.01] shadow-[0_300px_600px_rgba(0,0,0,1)] group/card rounded-[10rem] backdrop-blur-[200px] shadow-inner relative"
    >
      <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.1] blur-[250px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Post Header - More Elegant */}
      <div className="p-24 sm:p-[4rem] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-24">
          <div className="relative group/avatar">
            <div className="w-[12rem] h-[12rem] sm:w-[18rem] sm:h-[18rem] rounded-[8rem] p-2 bg-gradient-to-tr from-rose-950 via-rose-500 to-orange-950 group-hover/avatar:scale-110 transition-all duration-[2000ms] shadow-[0_80px_200px_rgba(0,0,0,1)] shadow-inner overflow-hidden">
               <div className="absolute inset-0 bg-white/20 blur-[30px] opacity-0 group-hover/avatar:opacity-100 transition-all" />
              <div className="w-full h-full rounded-[7.5rem] border-[15px] border-[#050506] overflow-hidden bg-white/5 shadow-inner relative z-10">
                <img 
                  src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username}`} 
                  className="w-full h-full object-cover transition-transform duration-[8000ms] group-hover/avatar:scale-150 grayscale-[0.6] group-hover/avatar:grayscale-0 brightness-[0.7] group-hover/avatar:brightness-100" 
                  alt={post.profiles?.username} 
                  loading="lazy"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-rose-500 border-[6px] border-[#050506] shadow-[0_0_80px_rgba(244,63,94,1)] animate-pulse z-20" />
          </div>
          <div className="space-y-12">
            <p className="text-8xl sm:text-[11rem] font-serif text-white leading-none tracking-tighter group-hover:text-rose-400 transition-all duration-[2000ms] italic drop-shadow-3xl">
              {post.profiles?.display_name || post.profiles?.username}
            </p>
            <div className="flex items-center gap-10">
              <Fingerprint size-[5rem] strokeWidth={0.01} className="text-gray-950 opacity-40 drop-shadow-2xl" />
              <p className="text-[20px] text-gray-950 font-black uppercase tracking-[1em] italic opacity-30 group-hover:opacity-100 transition-all duration-[2000ms]">
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <button className="text-gray-950 hover:text-white p-20 hover:bg-white/15 rounded-[6rem] transition-all duration-[1500ms] active:scale-[0.5] border-[6px] border-transparent hover:border-white/20 shadow-inner shadow-3xl group/more">
          <MoreHorizontal size-[10rem] strokeWidth={0.01} className="drop-shadow-3xl group-hover/more:scale-125 transition-all duration-[1500ms]" />
        </button>
      </div>

      {/* Post Media - Cinematic Frame */}
      <div 
        className="relative aspect-square sm:aspect-[4/5] bg-black overflow-hidden cursor-pointer group/media mx-12 sm:mx-24 rounded-[8rem] shadow-[0_250px_550px_rgba(0,0,0,1)] shadow-inner"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.post_photos[0]?.image_url} 
          className="w-full h-full object-cover transition-all duration-[12000ms] group-hover/media:scale-150 group-hover/media:opacity-90 grayscale-[0.7] group-hover/media:grayscale-0 brightness-[0.5] group-hover/media:brightness-[0.8]" 
          alt="Memory" 
          loading="lazy"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover/media:opacity-100 transition-all duration-[3000ms] bg-black/50 pointer-events-none backdrop-blur-[5px]" />
        
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -90, filter: 'blur(100px)' }}
              animate={{ scale: 3.5, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              exit={{ scale: 0, opacity: 0, rotate: 90, filter: 'blur(100px)' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size-[40rem] className="text-rose-500 fill-rose-500 drop-shadow-[0_0_200px_rgba(244,63,94,1)] shadow-rose-500 shadow-3xl" strokeWidth={0.01} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Details Hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-all duration-[2000ms] pointer-events-none">
          <div className="px-32 py-16 rounded-full bg-black/85 backdrop-blur-[150px] border-[6px] border-white/15 text-[22px] font-black uppercase tracking-[1.2em] text-white flex items-center gap-12 scale-90 group-hover/media:scale-100 transition-all duration-[2000ms] italic shadow-inner shadow-[0_150px_350px_rgba(0,0,0,1)]">
            <Zap size-[6rem] strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl shadow-[0_0_50px_rgba(244,63,94,1)]" />
            Double Tap to Heart
          </div>
        </div>
        
        {/* Decorative Corner Elements */}
        <div className="absolute top-24 left-24 opacity-5 group-hover/media:opacity-40 transition-all duration-[2000ms]">
           <Shield size-[10rem] className="text-white drop-shadow-3xl" strokeWidth={0.01} />
        </div>
      </div>

      {/* Post Actions - Reimagined */}
      <div className="p-24 sm:p-[4rem] space-y-32 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4rem]">
            <motion.button 
              whileTap={{ scale: 3, rotate: -45 }}
              onClick={() => setIsLiked(!isLiked)}
              className={twMerge(
                "transition-all duration-[2000ms] group/btn", 
                isLiked ? "text-rose-500" : "text-gray-950 hover:text-rose-500"
              )}
            >
              <Heart size-[12rem] className={twMerge("transition-all duration-[2000ms]", isLiked ? "fill-rose-500 scale-125 drop-shadow-[0_0_150px_rgba(244,63,94,1)] shadow-rose-500 shadow-2xl" : "group-hover/btn:scale-150 group-hover/btn:rotate-[30deg] drop-shadow-3xl")} strokeWidth={0.01} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 2.5 }}
              onClick={() => setShowComments(!showComments)} 
              className={twMerge(
                "transition-all duration-[2000ms] group/btn",
                showComments ? "text-rose-500" : "text-gray-950 hover:text-rose-500"
              )}
            >
              <MessageCircle size-[12rem] className={twMerge("transition-all duration-[2000ms]", showComments ? "fill-rose-500/30 scale-125 drop-shadow-3xl" : "group-hover/btn:scale-150 group-hover/btn:-rotate-[30deg] drop-shadow-3xl")} strokeWidth={0.01} />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 2.5 }}
              className="text-gray-950 hover:text-rose-500 transition-all duration-[2000ms] group/btn"
            >
              <Share2 size-[12rem] className="group-hover/btn:scale-150 transition-all duration-[2000ms] drop-shadow-3xl group-hover/btn:rotate-[15deg]" strokeWidth={0.01} />
            </motion.button>
          </div>
          <motion.button 
            whileTap={{ scale: 2.5 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={twMerge(
              "transition-all duration-[2000ms] group/btn",
              isBookmarked ? "text-rose-500" : "text-gray-950 hover:text-rose-500"
            )}
          >
            <Bookmark size-[12rem] className={twMerge("transition-all duration-[2000ms]", isBookmarked ? "fill-rose-500 scale-125 drop-shadow-3xl" : "group-hover/btn:scale-150 group-hover/btn:rotate-[-30deg] drop-shadow-3xl")} strokeWidth={0.01} />
          </motion.button>
        </div>

        {/* Caption Area - Premium Typography */}
        <div className="space-y-24">
          <div className="flex gap-16 items-start">
            <div className="mt-6 px-16 py-8 rounded-full bg-rose-500/20 border-4 border-rose-500/40 flex items-center gap-10 flex-shrink-0 shadow-inner shadow-3xl italic relative overflow-hidden group/moment-tag">
               <div className="absolute inset-0 bg-rose-500/10 blur-[20px] opacity-0 group-hover/moment-tag:opacity-100 transition-all" />
              <Sparkles size-[4.5rem] strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl relative z-10" />
              <span className="text-[20px] font-black text-rose-500 uppercase tracking-[1em] relative z-10 drop-shadow-2xl">Moment</span>
            </div>
            <div className="space-y-16">
              <p className="text-8xl sm:text-[11rem] leading-none text-gray-950 font-serif italic selection:bg-rose-500/40 drop-shadow-3xl">
                <span className="font-black text-white not-italic uppercase tracking-tighter mr-16 text-[4rem] sm:text-[5rem] drop-shadow-3xl group-hover:text-rose-500 transition-all duration-[2000ms]">@{post.profiles?.username}</span>
                "{post.caption}"
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-[22px] text-gray-950 font-black uppercase tracking-[1.5em] hover:text-rose-500 transition-all duration-[2000ms] flex items-center gap-16 pl-[4rem] group/explore italic opacity-20 group-hover/card:opacity-100 leading-none"
          >
            Explore whispers <div className="w-[15rem] h-[6px] bg-gray-950 group-hover:w-[25rem] group-hover:bg-rose-500/60 transition-all duration-[2500ms] shadow-inner rounded-full" /> Resonance detected
          </button>
        </div>

        {/* Comment Section (Inline Sanctuary) */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0, filter: 'blur(80px)' }}
              animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
              exit={{ height: 0, opacity: 0, filter: 'blur(80px)' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="pt-24 border-t-[6px] border-white/5 overflow-hidden"
            >
              <div className="space-y-24 mb-[4rem] max-h-[800px] overflow-y-auto no-scrollbar px-12 pt-24">
                <div className="flex gap-16 items-start group/comment">
                  <div className="w-[10rem] h-[10rem] rounded-[6rem] bg-rose-500/25 border-4 border-rose-500/50 flex items-center justify-center flex-shrink-0 group-hover/comment:scale-125 group-hover/comment:rotate-[20deg] transition-all duration-[2000ms] shadow-inner shadow-3xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500/15 blur-[20px] opacity-0 group-hover/comment:opacity-100 transition-all" />
                    <Heart size-[6rem] strokeWidth={1} className="text-rose-500 fill-rose-500/40 drop-shadow-3xl relative z-10" />
                  </div>
                  <div className="flex-1 bg-white/[0.01] rounded-[8rem] p-24 border-[6px] border-white/5 group-hover/comment:border-rose-500/60 transition-all duration-[2000ms] shadow-inner shadow-3xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover/comment:opacity-100 transition-all" />
                    <div className="flex items-center gap-12 mb-16 relative z-10">
                      <p className="text-[20px] font-black text-rose-500 uppercase tracking-[1.2em] italic drop-shadow-2xl">Sanctuary Keeper</p>
                      <div className="w-6 h-6 rounded-full bg-gray-950 shadow-inner" />
                      <span className="text-[18px] text-gray-950 font-bold uppercase tracking-[1em] italic opacity-30">System</span>
                    </div>
                    <p className="text-[10rem] sm:text-[13rem] text-gray-950 italic font-handwritten leading-none selection:bg-rose-500/40 drop-shadow-2xl relative z-10 opacity-60 group-hover/comment:opacity-100 group-hover/comment:text-white transition-all duration-[2000ms]">
                      "This specific shared breath has been safely archived in our eternal frequency. It resonates forever..."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-16 p-12 bg-white/[0.01] rounded-[8rem] border-[6px] border-white/5 focus-within:border-rose-500/80 transition-all duration-[2500ms] group/input shadow-inner relative overflow-hidden shadow-3xl mb-16">
                 <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.12] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-all duration-[2500ms]" />
                <input 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Whisper a thought into the void..." 
                  className="flex-1 bg-transparent px-[6rem] py-20 text-[10rem] sm:text-[12rem] outline-none text-white placeholder:text-gray-950 font-serif italic selection:bg-rose-500/40 relative z-10 leading-none drop-shadow-3xl"
                />
                <Button 
                  onClick={() => setComment('')}
                  disabled={!comment.trim()}
                  className="rounded-[6rem] w-[12rem] h-[12rem] p-0 flex items-center justify-center shrink-0 shadow-3xl relative z-10 border-none shadow-[0_100px_200px_rgba(244,63,94,1)] active:scale-[0.5] transition-all duration-[1000ms]"
                >
                  <Send size-[8rem] strokeWidth={0.01} className="rotate-[-30deg] group-hover/input:translate-x-16 group-hover/input:-translate-y-16 transition-all duration-[2500ms] drop-shadow-3xl shadow-[0_0_80px_white]" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
