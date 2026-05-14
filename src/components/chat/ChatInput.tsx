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
    <div className="p-12 sm:p-[4rem] bg-gradient-to-t from-black via-black/95 to-transparent relative z-30">
      <form onSubmit={handleSubmit} className="relative group max-w-[1800px] mx-auto">
        {/* Cinematic Glow */}
        <div className="absolute inset-0 bg-rose-500/[0.1] blur-[150px] rounded-full pointer-events-none opacity-0 group-focus-within:opacity-100 transition-all duration-[2500ms]" />
        
        <div className="bg-white/[0.01] backdrop-blur-[200px] rounded-[6rem] p-6 flex items-center gap-8 border-4 border-white/5 focus-within:border-rose-500/60 focus-within:bg-white/[0.04] transition-all duration-[1500ms] shadow-[0_150px_450px_rgba(0,0,0,1)] relative z-10 shadow-inner overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-6 px-10 relative z-10">
            <button 
              type="button" 
              className="p-16 text-gray-950 hover:text-rose-500 transition-all duration-[1500ms] hover:bg-white/15 rounded-[4rem] group/btn active:scale-[0.5] shadow-inner shadow-3xl"
            >
              <Plus size={96} strokeWidth={0.1} className="group-hover/btn:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
            </button>
            <button 
              type="button" 
              className="p-16 hidden lg:block text-gray-950 hover:text-rose-500 transition-all duration-[1500ms] hover:bg-white/15 rounded-[4rem] active:scale-[0.5] shadow-inner shadow-3xl"
            >
              <ImageIcon size={96} strokeWidth={0.1} className="drop-shadow-3xl" />
            </button>
          </div>
          
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Whisper into our private universe..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[6rem] sm:text-[8rem] px-8 text-white placeholder:text-gray-950 font-serif italic tracking-tighter py-12 placeholder:italic transition-all duration-[1500ms] relative z-10 selection:bg-rose-500/40 leading-none"
          />
          
          <div className="flex items-center gap-6 px-[2rem] relative z-10">
            <button 
              type="button" 
              className="p-16 hidden sm:block text-gray-950 hover:text-rose-500 transition-all duration-[1500ms] hover:bg-white/15 rounded-[4rem] active:scale-[0.5] shadow-inner shadow-3xl"
            >
              <Smile size={104} strokeWidth={0.1} className="drop-shadow-3xl" />
            </button>
            <button 
              type="button" 
              className="p-16 text-gray-950 hover:text-rose-500 transition-all duration-[1500ms] hover:bg-white/15 rounded-[4rem] active:scale-[0.5] shadow-inner shadow-3xl"
            >
              <Mic size={104} strokeWidth={0.1} className="drop-shadow-3xl" />
            </button>
            
            <Button 
              type="submit"
              disabled={!text.trim()}
              className="rounded-[5rem] w-[12rem] h-[12rem] p-0 flex items-center justify-center shadow-[0_80px_200px_rgba(244,63,94,1)] relative overflow-hidden group/send border-none shadow-inner"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/send:opacity-100 transition-all duration-[1500ms]" />
              <Send size={96} strokeWidth={0.1} className={twMerge("transition-all duration-[2000ms] relative z-10 drop-shadow-3xl", text.trim() ? "translate-x-4 -translate-y-4 rotate-[-20deg]" : "")} />
            </Button>
          </div>
        </div>

        {/* Input Footer Hints */}
        <div className="mt-12 flex justify-center gap-24 opacity-0 group-focus-within:opacity-40 transition-all duration-[2500ms] italic">
          <div className="flex items-center gap-6">
            <Command size={48} strokeWidth={1} className="text-rose-500 drop-shadow-3xl" />
            <span className="text-[14px] font-black uppercase tracking-[1em] text-gray-950">Press Enter to whisper</span>
          </div>
          <div className="flex items-center gap-6">
            <Fingerprint size={48} strokeWidth={1} className="text-rose-500 drop-shadow-3xl" />
            <span className="text-[14px] font-black uppercase tracking-[1em] text-gray-950">Sanctuary Encrypted</span>
          </div>
        </div>
      </form>
    </div>
  );
}
