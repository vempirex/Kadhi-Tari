import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const EMOJIS = [
  '❤️', '💖', '✨', '🌸', '🌻', '🧸', '🍭', '🦋', 
  '🥺', '🥰', '😘', '😊', '🥳', '🌈', '☁️', '🌙',
  '🔥', '💯', '🙏', '🙌', '👀', '🤣', '💀', '😭'
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmojiPicker({ onSelect, isOpen, onClose }: EmojiPickerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-4 p-3 bg-white border border-warm-100 rounded-2xl shadow-xl z-[110] grid grid-cols-6 gap-2"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSelect(emoji);
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center text-xl hover:bg-warm-50 rounded-xl transition-all active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
