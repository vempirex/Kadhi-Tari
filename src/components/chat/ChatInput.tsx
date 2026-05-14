import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';
import { useState, useRef } from 'react';

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
    <div className="p-4 sm:p-6 bg-gradient-to-t from-[#050506] to-transparent relative z-20">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-white/10 focus-within:border-rose-500/30 transition-all shadow-2xl">
          <button 
            type="button" 
            className="p-3 text-gray-500 hover:text-rose-400 transition-colors active:scale-90"
          >
            <ImageIcon size={20} strokeWidth={2} />
          </button>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Whisper something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-gray-600 font-medium"
          />
          <button 
            type="button" 
            className="p-3 hidden sm:block text-gray-500 hover:text-rose-400 transition-colors active:scale-90"
          >
            <Smile size={20} strokeWidth={2} />
          </button>
          <motion.button 
            type="submit"
            disabled={!text.trim()}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/20 disabled:opacity-40 disabled:grayscale transition-all"
          >
            <Send size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
