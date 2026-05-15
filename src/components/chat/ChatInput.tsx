import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, Mic, Plus, Sparkles, Zap, Command, Fingerprint, Loader2, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import EmojiPicker from './EmojiPicker';

interface ChatInputProps {
  onSendMessage: (text: string, imageUrl?: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && !imagePreview) return;

    let finalImageUrl = undefined;
    
    // If there's a preview but no upload started (placeholder logic or if we want to upload on send)
    // Actually, it's better to upload immediately on selection to show progress.
    if (imagePreview) {
      finalImageUrl = imagePreview;
    }

    onSendMessage(text.trim(), finalImageUrl);
    setText("");
    setImagePreview(null);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
    
    // Clear typing state
    onTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    // Handle typing broadcast
    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat_media')
        .getPublicUrl(fileName);
      
      setImagePreview(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-4 p-2 bg-white border border-warm-100 rounded-2xl shadow-xl z-50 flex items-end gap-2"
          >
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-warm-100">
              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-warm-50 border border-warm-100 rounded-2xl flex items-center p-1.5 focus-within:bg-white focus-within:border-rose-200 focus-within:shadow-sm transition-all">
          <div className="flex items-center px-1">
            <input 
              type="file" 
              id="chat-image-upload" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
            <button 
              type="button"
              onClick={() => document.getElementById('chat-image-upload')?.click()}
              className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all relative"
            >
              {isUploading ? (
                <Loader2 size={20} className="animate-spin text-rose-500" />
              ) : (
                <ImageIcon size={20} />
              )}
            </button>
          </div>
          
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Whisper a thought..."
            value={text}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-charcoal placeholder:text-warm-300 font-medium"
          />
          
          <div className="flex items-center gap-1 px-1 relative">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={twMerge(
                "p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all",
                showEmojiPicker && "text-rose-500 bg-rose-50"
              )}
            >
              <Smile size={20} />
            </button>
            
            <EmojiPicker 
              isOpen={showEmojiPicker} 
              onClose={() => setShowEmojiPicker(false)}
              onSelect={(emoji) => setText(prev => prev + emoji)}
            />

            <Button 
              type="submit"
              disabled={(!text.trim() && !imagePreview) || isUploading}
              size="sm"
              className="rounded-xl p-2.5 min-w-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-6 opacity-40 sm:flex hidden">
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

