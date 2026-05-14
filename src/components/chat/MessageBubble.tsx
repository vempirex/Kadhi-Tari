import { motion } from 'framer-motion';
import { CheckCheck, Heart, Sparkles, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={twMerge("flex w-full mb-1", isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge("max-w-[85%] sm:max-w-[70%] flex flex-col group relative", isMe ? 'items-end' : 'items-start')}>
        <div className={twMerge(
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all relative font-medium",
          isMe 
            ? 'bg-rose-600 text-white rounded-tr-sm shadow-sm' 
            : 'bg-warm-100 text-charcoal rounded-tl-sm'
        )}>
          <span>
            {message.text}
          </span>
          
          <div className={twMerge(
            "absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-all scale-75 z-20",
            isMe ? "-left-4" : "-right-4"
          )}>
            <div className="p-1.5 rounded-full bg-white border border-warm-100 text-rose-500 shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all">
              <Heart size={14} fill="currentColor" />
            </div>
          </div>
        </div>
        
        <div className={twMerge(
          "flex items-center gap-2 mt-1 px-1 transition-all opacity-0 group-hover:opacity-100",
          isMe ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-[10px] text-warm-400 font-bold uppercase tracking-wider">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          {isMe && (
            <CheckCheck size={14} className={twMerge(message.is_read ? "text-rose-500" : "text-warm-300")} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
