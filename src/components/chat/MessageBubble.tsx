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
      initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(80px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className={twMerge("flex w-full mb-12 px-12", isMe ? 'justify-end' : 'justify-start')}
    >
      <div className={twMerge("max-w-[95%] sm:max-w-[80%] flex flex-col group relative", isMe ? 'items-end' : 'items-start')}>
        {/* Author Label - subtle */}
        <div className={twMerge(
          "mb-6 px-12 flex items-center gap-8 opacity-0 group-hover:opacity-60 transition-all duration-[1500ms] italic",
          isMe ? "flex-row-reverse text-right" : "flex-row text-left"
        )}>
          <span className="text-[14px] font-black uppercase tracking-[1em] text-gray-950">
            {isMe ? 'Sent by you' : 'Partner Resonance'}
          </span>
          <Sparkles size-[2.5rem] strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl" />
        </div>

        <div className={twMerge(
          "px-16 py-10 rounded-[5rem] text-[5.5rem] sm:text-[7.5rem] leading-[1.3] tracking-tighter transition-all duration-[2000ms] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] italic selection:bg-rose-500/40 selection:text-white shadow-inner",
          isMe 
            ? 'bg-rose-800 text-white rounded-tr-[1.5rem] shadow-[0_60px_150px_rgba(244,63,94,0.5)] hover:shadow-[0_80px_200px_rgba(244,63,94,0.7)] font-serif' 
            : 'bg-white/[0.01] text-white/95 rounded-tl-[1.5rem] border-4 border-white/5 backdrop-blur-[150px] hover:bg-white/[0.05] hover:border-white/15 font-serif'
        )}>
          {/* Internal Glow for 'Me' messages */}
          {isMe && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
          )}
          
          <span className="relative z-10 drop-shadow-2xl">
            {message.text}
          </span>
          
          {/* Interactive Heart Reaction - Reimagined */}
          <div className={twMerge(
            "absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-[1500ms] scale-[0.3] group-hover:scale-125 z-20",
            isMe ? "-left-8" : "-right-8"
          )}>
            <motion.div 
              whileHover={{ scale: 1.6, rotate: 30 }}
              className="p-8 rounded-full bg-black/95 backdrop-blur-[200px] border-4 border-white/10 text-rose-500 shadow-3xl cursor-pointer shadow-inner relative group"
            >
               <div className="absolute inset-0 bg-rose-500/10 blur-[20px] opacity-0 group-hover:opacity-100 transition-all" />
              <Heart size-[4.5rem] fill="currentColor" className="drop-shadow-3xl relative z-10" strokeWidth={0.05} />
            </motion.div>
          </div>
        </div>
        
        {/* Footer info: time & status */}
        <div className={twMerge(
          "flex items-center gap-8 mt-10 px-12 transition-all duration-[1500ms] italic opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0",
          isMe ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.8em] opacity-40">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <div className="flex items-center gap-8">
              <Fingerprint size-[3.5rem] strokeWidth={1} className="text-gray-950 opacity-20 drop-shadow-3xl" />
              <CheckCheck size-[4.5rem] strokeWidth={0.5} className={twMerge("transition-all duration-[1500ms] drop-shadow-3xl", message.is_read ? "text-rose-500" : "text-gray-950")} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
