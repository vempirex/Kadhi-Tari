import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Letter {
  id: string;
  category: string;
  content: string;
  sender_name: string;
  created_at: string;
}

const categories = [
  { id: 'sad', label: 'Open when sad', icon: Heart, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'thinking', label: 'Open when overthinking', icon: AlertCircle, color: 'bg-purple-500/20 text-purple-400' },
  { id: 'missing', label: 'Open when missing bakbak 😭', icon: Clock, color: 'bg-pink-500/20 text-pink-400' },
];

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newLetter, setNewLetter] = useState({ category: 'sad', content: '' });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setLetters(data);
    setIsLoading(false);
  };

  const handleWriteLetter = async () => {
    if (!newLetter.content) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('letters').insert([
      {
        ...newLetter,
        sender_name: user?.email?.split('@')[0] || 'Anonymous',
        user_id: user?.id
      }
    ]);

    if (!error) {
      setIsWriteModalOpen(false);
      setNewLetter({ category: 'sad', content: '' });
      fetchLetters();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-serif glow-text">Letter Vault</h1>
          <p className="text-gray-400 text-sm font-handwritten">Messages for every mood...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWriteModalOpen(true)}
          className="p-3 rounded-full bg-primary text-background shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          letters.map((letter, index) => {
            const cat = categories.find(c => c.id === letter.category) || categories[0];
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedLetter(letter)}
                className="glass-card rounded-3xl p-6 flex items-center justify-between cursor-pointer group active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${cat.color}`}>
                    <cat.icon size={24} />
                  </div>
                  <div>
                    <p className="font-medium">{cat.label}</p>
                    <p className="text-xs text-gray-500">From {letter.sender_name} • {new Date(letter.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Mail className="text-gray-600 group-hover:text-primary transition-colors" />
              </motion.div>
            );
          })
        )}
      </div>

      {/* View Letter Modal */}
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
                  <p>{selectedLetter.content}</p>
                  <p className="text-right pt-4">— {selectedLetter.sender_name} 🌙</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card rounded-[3rem] w-full max-w-md p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Write a Letter</h2>
                <button onClick={() => setIsWriteModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <select 
                  value={newLetter.category}
                  onChange={(e) => setNewLetter({ ...newLetter, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors appearance-none text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-background text-white">{cat.label}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Pour your heart out..."
                  value={newLetter.content}
                  onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors h-48 resize-none"
                />

                <button
                  onClick={handleWriteLetter}
                  className="w-full py-4 rounded-2xl bg-primary text-background font-bold shadow-lg shadow-primary/20"
                >
                  Seal & Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

