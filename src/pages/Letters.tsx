import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Loader2, Sparkles, BookOpen, Send, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Letter {
  id: string;
  category: string;
  content: string;
  sender_name: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
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

    const channel = supabase
      .channel('letter_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'letters' }, () => {
        fetchLetters();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLetters = async () => {
    const { data, error } = await supabase
      .from('letters')
      .select('*, profiles(username, display_name, avatar_url)')
      .order('created_at', { ascending: false });
    
    if (!error && data) setLetters(data as any);
    setIsLoading(false);
  };

  const handleWriteLetter = async () => {
    if (!newLetter.content || isSending) return;
    setIsSending(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('letters').insert([
        {
          ...newLetter,
          user_id: user.id
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
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Quote size={12} />
            Soul to Soul
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Letter Vault</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Whispers of the heart, sealed forever...</p>
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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Unlocking vault...</p>
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-6 mx-2 border-dashed border-2 border-white/5">
            <div className="p-6 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/50">
              <MailOpen size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif text-white/80">No letters yet</p>
              <p className="text-gray-500 italic max-w-[200px] mx-auto text-sm">Seal your thoughts in time. Write a letter to your soulmate.</p>
            </div>
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
                className={twMerge(
                  "premium-card p-6 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all border-l-4",
                  cat.borderColor
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={twMerge("p-4 rounded-2xl transition-all group-hover:rotate-12", cat.color)}>
                    <cat.icon size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg text-white group-hover:text-rose-400 transition-colors">{cat.label}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      From {letter.profiles?.display_name || letter.profiles?.username || 'Soulmate'} • {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.8, y: 100, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 100, rotate: 3 }}
              className="w-full max-w-lg bg-[#fffdfa] text-[#2d241e] rounded-sm p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[500px] flex flex-col z-[510]"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500" />
              
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-6 right-6 p-2 text-black/20 hover:text-rose-500 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="space-y-10 relative z-10 flex-1">
                <header className="border-b border-black/5 pb-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-handwritten text-4xl text-rose-600/80">My Dearest,</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                        {new Date(selectedLetter.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="font-handwritten text-2xl md:text-3xl leading-[1.8] space-y-6 flex-1 text-black/80 max-h-[50vh] overflow-y-auto no-scrollbar">
                  <p className="whitespace-pre-wrap">{selectedLetter.content}</p>
                </div>

                <footer className="pt-10 border-t border-black/5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">With eternal love,</p>
                      <p className="font-handwritten text-4xl text-rose-600/80">{selectedLetter.profiles?.display_name || selectedLetter.profiles?.username}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-rose-500/20 flex items-center justify-center text-rose-500/40 rotate-12">
                      <Heart size={32} fill="currentColor" className="opacity-10" />
                    </div>
                  </div>
                </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-12 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Write a Letter</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Seal your soulmate thoughts</p>
                </div>
                <button onClick={() => setIsWriteModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Open When...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                        className={twMerge(
                          "p-4 rounded-2xl border text-left transition-all",
                          newLetter.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/5" 
                            : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                        )}
                      >
                        <cat.icon size={20} className="mb-3" />
                        <span className="text-[10px] font-bold uppercase tracking-tight leading-tight block">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Your whispers</label>
                  <textarea
                    placeholder="Pour your heart out here..."
                    value={newLetter.content}
                    onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                    className="input-field min-h-[180px] resize-none leading-relaxed text-base"
                  />
                </div>

                <button
                  onClick={handleWriteLetter}
                  disabled={!newLetter.content || isSending}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-5 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Send size={20} />
                      <span>Seal & Send Letter</span>
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


