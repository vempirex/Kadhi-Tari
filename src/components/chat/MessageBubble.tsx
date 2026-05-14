import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
  message: any;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={twMerge("flex w-full", isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge("max-w-[85%] sm:max-w-[70%] flex flex-col", isMe ? 'items-end' : 'items-start')}>
        <div className={twMerge(
          "px-5 py-3.5 rounded-[1.8rem] shadow-xl text-sm sm:text-[15px] leading-relaxed",
          isMe 
            ? 'bg-rose-500 text-white rounded-tr-none' 
            : 'bg-white/[0.03] text-white/90 rounded-tl-none border border-white/10 backdrop-blur-sm'
        )}>
          {message.text}
        </div>
        <div className="flex items-center gap-2 mt-1.5 px-2">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <CheckCheck size={12} className={twMerge(message.is_read ? "text-blue-400" : "text-gray-600")} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
