import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle } from 'lucide-react';

const letterCategories = [
  { id: 'sad', label: 'Open when sad', icon: Heart, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'thinking', label: 'Open when overthinking', icon: AlertCircle, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'missing', label: 'Open when missing bakbak 😭', icon: Clock, color: 'bg-pink-500/20 text-pink-400' },
];

export default function Letters() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="px-2">
        <h1 className="text-2xl font-serif glow-text">Letter Vault</h1>
        <p className="text-gray-400 text-sm font-handwritten">Messages for every mood...</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {letterCategories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedLetter(cat.id)}
            className="glass-card rounded-3xl p-6 flex items-center justify-between cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${cat.color}`}>
                <cat.icon size={24} />
              </div>
              <div>
                <p className="font-medium">{cat.label}</p>
                <p className="text-xs text-gray-500">From Vijay • 2 days ago</p>
              </div>
            </div>
            <Mail className="text-gray-600 group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 50, rotate: 2 }}
              className="w-full max-w-lg bg-[#fff9eb] text-[#3d2b1f] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Paper Texture Effect */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]" />
              
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="space-y-6 relative z-10">
                <header className="border-b border-black/10 pb-4">
                  <p className="font-handwritten text-2xl">Dear You,</p>
                </header>
                
                <div className="font-handwritten text-xl leading-loose space-y-4">
                  <p>
                    I know you're feeling {selectedLetter === 'sad' ? 'a bit low' : 'caught up in your thoughts'} right now. 
                    Just wanted to leave this here to remind you that you're doing great.
                  </p>
                  <p>
                    Take a deep breath. Drink some water. This too shall pass, and soon we'll be laughing about some random meme again.
                  </p>
                  <p className="text-right pt-4">
                    — Vijay 🌙
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
