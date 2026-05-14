import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, Mic, Plus, Sparkles, Zap, Command, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
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
    <div className="p-4 bg-white/80 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <div className="bg-warm-50 border border-warm-100 rounded-2xl flex items-center p-1.5 focus-within:bg-white focus-within:border-rose-200 focus-within:shadow-sm transition-all">
          <div className="flex items-center px-1">
            <button 
              type="button" 
              className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
            <button 
              type="button" 
              className="p-2 hidden sm:block text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
            >
              <ImageIcon size={20} />
            </button>
          </div>
          
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Whisper a thought..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-charcoal placeholder:text-warm-300 font-medium"
          />
          
          <div className="flex items-center gap-1 px-1">
            <button 
              type="button" 
              className="p-2 hidden sm:block text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
            >
              <Smile size={20} />
            </button>
            <Button 
              type="submit"
              disabled={!text.trim()}
              size="sm"
              className="rounded-xl p-2.5 min-w-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-6 opacity-40">
          <div className="flex items-center gap-1.5">
            <Command size={12} className="text-warm-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-warm-500">Enter to whisper</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fingerprint size={12} className="text-warm-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-warm-500">Encrypted</span>
          </div>
        </div>
      </form>
    </div>
  );
}
