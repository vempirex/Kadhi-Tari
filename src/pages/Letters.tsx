import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Letter {
  id: string;
  category: string;
  content: string;
  sender_name: string;
  created_at: string;
}

const categories = [
  { id: 'sad', label: 'Open when sad', icon: Heart, color: 'bg-blue-500/10 text-blue-400', borderColor: 'border-blue-500/20' },
  { id: 'thinking', label: 'Open when overthinking', icon: AlertCircle, color: 'bg-purple-500/10 text-purple-400', borderColor: 'border-purple-500/20' },
  { id: 'missing', label: 'Open when missing me', icon: Clock, color: 'bg-pink-500/10 text-pink-400', borderColor: 'border-pink-500/20' },
  { id: 'celebrating', label: 'Open when happy', icon: Sparkles, color: 'bg-orange-500/10 text-orange-400', borderColor: 'border-orange-500/20' },
];

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
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
    if (!newLetter.content || isSending) return;
    setIsSending(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('letters').insert([
        {
          ...newLetter,
          sender_name: user?.email?.split('@')[0] || 'Anonymous',
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      setIsWriteModalOpen(false);
      setNewLetter({ category: 'sad', content: '' });
      fetchLetters();
    } catch (err) {
      console.error("Error sending letter:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Mail size={12} />
            Private Vault
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Letter Vault</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Handwritten souls in a digital world...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWriteModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <Plus size={28} />
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={32} />
            <p className="text-sm text-gray-500 font-medium">Unlocking the vault...</p>
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-4">
            <div className="p-4 bg-rose-500/10 rounded-full w-fit mx-auto text-rose-400">
              <MailOpen size={32} />
            </div>
            <p className="text-gray-400 italic">The vault is empty. Write the first letter?</p>
          </div>
        ) : (
          letters.map((letter, index) => {
            const cat = categories.find(c => c.id === letter.category) || categories[0];
            return (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedLetter(letter)}
                className={twMerge(
                  "premium-card p-6 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all border-l-4",
                  cat.borderColor
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={twMerge("p-4 rounded-2xl transition-all group-hover:scale-110", cat.color)}>
                    <cat.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors">{cat.label}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      From {letter.sender_name} • {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-white/5 text-gray-600 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-all">
                  <Mail size={20} />
                </div>
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
            className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 100, rotate: -5 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 100, rotate: 5 }}
              className="w-full max-w-lg bg-[#fffdfa] text-[#2d241e] rounded-sm p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[500px] flex flex-col"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              
              {/* Envelope Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500" />
              
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-4 right-4 p-2 text-black/20 hover:text-rose-500 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="space-y-8 relative z-10 flex-1">
                <header className="border-b border-black/5 pb-6">
                  <div className="flex justify-between items-start">
                    <p className="font-handwritten text-3xl text-rose-600/80">My Dearest,</p>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                        {new Date(selectedLetter.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="font-handwritten text-2xl leading-[1.8] space-y-6 flex-1 text-black/80">
                  <p className="whitespace-pre-wrap">{selectedLetter.content}</p>
                </div>

                <footer className="pt-8 border-t border-black/5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">With all my heart,</p>
                      <p className="font-handwritten text-3xl text-rose-600/80">{selectedLetter.sender_name}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 flex items-center justify-center text-rose-500/40 rotate-12">
                      <Heart size={24} fill="currentColor" className="opacity-20" />
                    </div>
                  </div>
                </footer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Write a Letter</h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Seal your thoughts</p>
                </div>
                <button onClick={() => setIsWriteModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">When should they open it?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                        className={twMerge(
                          "p-3 rounded-2xl border text-left transition-all",
                          newLetter.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/5" 
                            : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                        )}
                      >
                        <cat.icon size={16} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Your message</label>
                  <textarea
                    placeholder="Pour your heart out here..."
                    value={newLetter.content}
                    onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                    className="input-field min-h-[200px] resize-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleWriteLetter}
                  disabled={!newLetter.content || isSending}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Sparkles size={20} />
                      Seal & Send Letter
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

