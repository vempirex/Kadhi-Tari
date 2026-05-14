import { motion } from 'framer-motion';
import { CheckCheck, Heart, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
  message: {
    text: string;
    created_at: string;
    is_read?: boolean;
  };
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={twMerge("flex w-full mb-6 px-4", isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge("max-w-[85%] sm:max-w-[65%] flex flex-col group relative", isMe ? 'items-end' : 'items-start')}>
        {/* Author Label - subtle */}
        <div className={twMerge(
          "mb-1.5 px-3 flex items-center gap-2 opacity-0 group-hover:opacity-40 transition-opacity duration-500",
          isMe ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">
            {isMe ? 'Sent by you' : 'Partner'}
          </span>
          <Sparkles size={8} className="text-rose-500" />
        </div>

        <div className={twMerge(
          "px-8 py-5 rounded-[2.2rem] text-base sm:text-lg leading-relaxed tracking-tight transition-all duration-700 relative overflow-hidden shadow-2xl",
          isMe 
            ? 'bg-rose-500 text-white rounded-tr-[0.5rem] shadow-[0_20px_50px_rgba(244,63,94,0.25)] hover:shadow-[0_25px_60px_rgba(244,63,94,0.35)]' 
            : 'bg-white/[0.03] text-white/95 rounded-tl-[0.5rem] border border-white/5 backdrop-blur-[30px] hover:bg-white/[0.06] hover:border-white/10'
        )}>
          {/* Internal Glow for 'Me' messages */}
          {isMe && (
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
          )}
          
          <span className="relative z-10 font-medium">
            {message.text}
          </span>
          
          {/* Interactive Heart Reaction - Reimagined */}
          <div className={twMerge(
            "absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-110",
            isMe ? "-left-3" : "-right-3"
          )}>
            <motion.div 
              whileHover={{ scale: 1.2, rotate: 15 }}
              className="p-2.5 rounded-full bg-black/80 backdrop-blur-3xl border border-white/10 text-rose-500 shadow-2xl cursor-pointer"
            >
              <Heart size={12} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            </motion.div>
          </div>
        </div>
        
        {/* Footer info: time & status */}
        <div className={twMerge(
          "flex items-center gap-3 mt-3 px-4 transition-all duration-700",
          "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        )}>
          <span className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em]">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-800" />
              <CheckCheck size={14} strokeWidth={2.5} className={twMerge("transition-colors duration-700", message.is_read ? "text-rose-500" : "text-gray-800")} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
