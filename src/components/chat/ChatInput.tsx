import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, Mic, Plus, Sparkles, Zap, Command } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="p-8 sm:p-12 bg-gradient-to-t from-black via-black/80 to-transparent relative z-30">
      <form onSubmit={handleSubmit} className="relative group max-w-6xl mx-auto">
        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-rose-500/5 blur-[50px] rounded-full pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
        
        <div className="bg-white/[0.03] backdrop-blur-[30px] rounded-[3rem] p-3 flex items-center gap-4 border border-white/5 focus-within:border-rose-500/30 focus-within:bg-white/[0.05] transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10">
          <div className="flex items-center gap-2 px-3">
            <button 
              type="button" 
              className="p-5 text-gray-600 hover:text-rose-400 transition-all duration-500 hover:bg-white/5 rounded-2xl group/btn active:scale-90"
            >
              <Plus size={24} strokeWidth={2} className="group-hover/btn:rotate-90 transition-transform duration-500" />
            </button>
            <button 
              type="button" 
              className="p-5 hidden lg:block text-gray-600 hover:text-rose-400 transition-all duration-500 hover:bg-white/5 rounded-2xl active:scale-90"
            >
              <ImageIcon size={24} strokeWidth={2} />
            </button>
          </div>
          
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Whisper into our private universe..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl px-2 text-white placeholder:text-gray-800 font-medium tracking-tight py-6 placeholder:italic transition-all"
          />
          
          <div className="flex items-center gap-2 px-3">
            <button 
              type="button" 
              className="p-5 hidden sm:block text-gray-600 hover:text-rose-400 transition-all duration-500 hover:bg-white/5 rounded-2xl active:scale-90"
            >
              <Smile size={24} strokeWidth={2} />
            </button>
            <button 
              type="button" 
              className="p-5 text-gray-600 hover:text-rose-400 transition-all duration-500 hover:bg-white/5 rounded-2xl active:scale-90"
            >
              <Mic size={24} strokeWidth={2} />
            </button>
            
            <Button 
              type="submit"
              disabled={!text.trim()}
              className="rounded-[2rem] w-16 h-16 p-0 flex items-center justify-center shadow-[0_20px_50px_rgba(244,63,94,0.25)] relative overflow-hidden group/send"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover/send:opacity-100 transition-opacity duration-700" />
              <Send size={24} strokeWidth={3} className={text.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform duration-500 relative z-10" : "relative z-10"} />
            </Button>
          </div>
        </div>

        {/* Input Footer Hints */}
        <div className="mt-6 flex justify-center gap-8 opacity-0 group-focus-within:opacity-40 transition-opacity duration-1000">
          <div className="flex items-center gap-2">
            <Command size={10} className="text-rose-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">Press Enter to whisper</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={10} className="text-rose-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">Sanctuary Encrypted</span>
          </div>
        </div>
      </form>
    </div>
  );
}
