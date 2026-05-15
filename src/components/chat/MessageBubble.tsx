import { motion } from 'framer-motion';
import { CheckCheck, Heart } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
  message: {
    text: string;
    created_at: string;
    is_read?: boolean;
    image_url?: string;
    message_type?: string;
  };
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const isImage = message.message_type === 'image' || !!message.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={twMerge("flex w-full mb-2", isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge(
        "max-w-[85%] sm:max-w-[70%] flex flex-col group relative",
        isMe ? 'items-end' : 'items-start'
      )}>
        <div className={twMerge(
          "rounded-2xl transition-all relative overflow-hidden",
          isMe 
            ? 'bg-rose-600 text-white rounded-tr-sm shadow-sm' 
            : 'bg-warm-100 text-charcoal rounded-tl-sm',
          isImage ? "p-1" : "px-4 py-2.5"
        )}>
          {isImage && (
            <div className="rounded-xl overflow-hidden mb-1">
              <img 
                src={message.image_url} 
                className="max-w-full h-auto object-cover max-h-80 cursor-pointer hover:scale-[1.02] transition-transform" 
                alt="Shared visual" 
                onClick={() => window.open(message.image_url, '_blank')}
              />
            </div>
          )}
          
          {message.text && (
            <div className={twMerge("text-sm leading-relaxed font-medium", isImage && "px-2 py-1.5")}>
              {message.text}
            </div>
          )}
          
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

