import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Loader2, Sparkles, Send, Quote, Bookmark } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Quote size={12} className="animate-pulse" />
            Soul to Soul
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">Letter Vault</h1>
          <p className="text-gray-400 text-sm sm:text-base font-handwritten italic opacity-80">Whispers of the heart, sealed forever...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsWriteModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-3 px-8 shadow-rose-500/30"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Write a Letter</span>
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-6 px-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Unlocking the vault...</p>
          </div>
        ) : letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 premium-card space-y-6 relative z-10 border-dashed border-2"
          >
            <div className="p-8 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/30">
              <MailOpen size={64} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white/90">The vault is silent</h2>
              <p className="text-gray-500 italic max-w-xs mx-auto text-sm">Seal your thoughts in time. Pour your heart onto digital paper.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {letters.map((letter, index) => {
              const cat = categories.find(c => c.id === letter.category) || categories[0];
              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedLetter(letter)}
                  className={twMerge(
                    "premium-card p-6 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all border-l-4",
                    cat.borderColor
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={twMerge("p-4 rounded-2xl transition-all group-hover:rotate-12 group-hover:scale-110", cat.color)}>
                      <cat.icon size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-lg sm:text-xl text-white group-hover:text-rose-400 transition-colors">{cat.label}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">
                          From {letter.profiles?.display_name?.split(' ')[0] || letter.profiles?.username}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">
                          {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] text-gray-600 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-all border border-white/5 shadow-xl">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.9, y: 100, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 100, rotate: 2 }}
              className="w-full max-w-2xl bg-[#fcfaf7] text-[#2d241e] rounded-[4px] p-8 sm:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden min-h-[600px] flex flex-col z-[510] border-[12px] border-white/5"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500 opacity-80" />
              <div className="absolute top-12 right-12 w-24 h-24 border-2 border-rose-500/10 rounded-full flex items-center justify-center -rotate-12">
                <Bookmark size={48} className="text-rose-500/20" />
              </div>
              
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-6 right-6 p-3 text-black/20 hover:text-rose-500 hover:bg-black/5 rounded-full transition-all active:scale-90 z-30"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 flex-1 flex flex-col">
                <header className="border-b border-black/[0.08] pb-10 mb-12">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="font-handwritten text-4xl sm:text-5xl text-rose-700/80">Dearest Soulmate,</p>
                      <p className="text-[10px] text-black/30 font-black uppercase tracking-[0.2em]">Our private correspondence</p>
                    </div>
                    <div className="text-right sm:pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 font-serif">
                        {new Date(selectedLetter.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="font-handwritten text-2xl sm:text-3xl leading-[2] space-y-8 flex-1 text-black/85 overflow-y-auto no-scrollbar pr-4">
                  <p className="whitespace-pre-wrap">{selectedLetter.content}</p>
                </div>

                <footer className="pt-12 mt-12 border-t border-black/[0.08]">
                  <div className="flex flex-col sm:flex-row justify-between items-end gap-8">
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">With all my love,</p>
                      <p className="font-handwritten text-4xl sm:text-5xl text-rose-700/80">
                        {selectedLetter.profiles?.display_name || selectedLetter.profiles?.username}
                      </p>
                    </div>
                    <div className="w-20 h-20 rounded-full border-[3px] border-dashed border-rose-500/20 flex items-center justify-center text-rose-500/20 rotate-[15deg] group hover:rotate-0 transition-transform duration-700">
                      <Heart size={40} fill="currentColor" className="opacity-10 group-hover:opacity-20 transition-opacity" />
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
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-xl p-8 sm:p-12 space-y-10 overflow-hidden shadow-[0_0_100px_rgba(244,63,94,0.1)] border-white/10"
            >
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif text-rose-400">Pour Your Heart</h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Seal a new letter in the vault</p>
                </div>
                <button 
                  onClick={() => setIsWriteModalOpen(false)} 
                  className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Open This When...</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                        className={twMerge(
                          "p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-3",
                          newLetter.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-xl shadow-rose-500/10" 
                            : "bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10"
                        )}
                      >
                        <cat.icon size={22} strokeWidth={newLetter.category === cat.id ? 2.5 : 2} />
                        <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{cat.label.split('Open when ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">The Message</label>
                  <textarea
                    placeholder="Whisper your thoughts, dreams, and feelings..."
                    value={newLetter.content}
                    onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                    className="input-field min-h-[220px] resize-none leading-relaxed text-base sm:text-lg font-medium py-6"
                  />
                </div>

                <button
                  onClick={handleWriteLetter}
                  disabled={!newLetter.content || isSending}
                  className="btn-primary w-full flex items-center justify-center gap-4 py-5 text-base tracking-wide disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <Send size={22} className="rotate-[-20deg] group-hover:rotate-0 transition-transform" />
                      <span>Seal & Store in Vault</span>
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


