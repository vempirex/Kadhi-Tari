import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Sparkles, Send, Quote, Bookmark, Zap, ArrowLeft, SendHorizontal, Star, Shield, Feather, Fingerprint, Wind, Sun, Moon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
  { id: 'sad', label: 'Open when sad', icon: Heart, color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-100' },
  { id: 'thinking', label: 'Open when overthinking', icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-100' },
  { id: 'missing', label: 'Open when missing me', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50', borderColor: 'border-rose-100' },
  { id: 'celebrating', label: 'Open when happy', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-100' },
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

  if (isLoading && letters.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing whispers...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <Quote size={16} />
            Soul Correspondence
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Letter Vault</h1>
          <p className="text-warm-500 font-medium text-lg max-w-2xl">
            Heartbeats frozen in time, waiting for your touch to bloom once more.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsWriteModalOpen(true)}
            size="md"
          >
            <Feather size={18} className="mr-2" /> Write Letter
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 px-2">
        {letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="py-32 text-center space-y-6 border-dashed border-2 flex flex-col items-center">
              <div className="p-10 bg-warm-50 rounded-3xl text-warm-200 border border-warm-100">
                <MailOpen size={64} strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-charcoal">The vault is silent</h2>
                <p className="text-warm-400 font-medium max-w-sm mx-auto">
                  Pour your heart onto the digital parchment and let the echoes begin.
                </p>
              </div>
              <Button 
                onClick={() => setIsWriteModalOpen(true)} 
                variant="soft"
              >
                Pen First Letter <Plus size={18} className="ml-2" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((letter, index) => {
              const cat = categories.find(c => c.id === letter.category) || categories[0];
              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => setSelectedLetter(letter)}
                    className="p-6 h-[400px] flex flex-col justify-between cursor-pointer group hover:border-rose-200 hover:shadow-premium transition-all"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={twMerge("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm border", cat.bg, cat.color, cat.borderColor)}>
                          <cat.icon size={28} />
                        </div>
                        <div className="p-2 text-warm-300 group-hover:text-rose-600 transition-colors">
                          <Mail size={20} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-2xl font-outfit font-bold text-charcoal leading-tight group-hover:text-rose-600 transition-colors">{cat.label}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                            {letter.profiles?.display_name?.split(' ')[0] || letter.profiles?.username}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-warm-200" />
                          <span className="text-[10px] text-warm-400 font-bold uppercase tracking-widest">
                            {new Date(letter.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 mt-6">
                      <p className="text-sm font-medium text-warm-500 line-clamp-6 leading-relaxed italic">
                        "{letter.content}"
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[2010] w-full max-w-2xl"
            >
              <Card className="p-8 space-y-8 bg-white shadow-premium">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                      <Feather size={16} />
                      Seal a Whisper
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-charcoal">New Letter</h2>
                  </div>
                  <button 
                    onClick={() => setIsWriteModalOpen(false)} 
                    className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Choose Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                          className={twMerge(
                            "p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 group/cat-btn",
                            newLetter.category === cat.id 
                              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                              : "bg-warm-50 border-warm-100 text-warm-400 hover:bg-warm-100 hover:border-warm-200"
                          )}
                        >
                          <cat.icon size={24} className={twMerge("transition-transform group-hover/cat-btn:scale-110", newLetter.category === cat.id ? "text-rose-600" : "text-warm-300")} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea
                      placeholder="Pour your heart here..."
                      value={newLetter.content}
                      onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-2xl p-4 text-sm font-medium text-charcoal min-h-[300px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none"
                    />
                  </div>
                  
                  <Button
                    onClick={handleWriteLetter}
                    isLoading={isSending}
                    disabled={!newLetter.content}
                    className="w-full"
                  >
                    Seal into Vault
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#fffdfa] rounded-3xl p-10 sm:p-16 shadow-premium relative z-[3010] m-auto overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
              
              <button 
                onClick={() => setSelectedLetter(null)} 
                className="absolute top-6 right-6 p-2 text-warm-300 hover:text-charcoal transition-all"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-warm-200">
                     <div className="flex-1 h-px bg-current" />
                     <Fingerprint size={24} />
                     <div className="flex-1 h-px bg-current" />
                  </div>
                  <p className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Dearest,</p>
                </div>

                <div className="text-lg sm:text-xl font-medium text-warm-700 leading-relaxed max-h-[50vh] overflow-y-auto no-scrollbar pr-4 italic">
                  {selectedLetter.content}
                </div>

                <div className="pt-8 border-t border-warm-100 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-warm-300">Yours Infinitely,</p>
                    <p className="text-2xl font-outfit font-bold text-charcoal tracking-tight">
                       {selectedLetter.profiles?.display_name || selectedLetter.profiles?.username}
                    </p>
                  </div>
                  <div className="relative group/stamp opacity-40">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-900/20 flex items-center justify-center rotate-12">
                       <Heart size={32} className="text-rose-900/20 fill-rose-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
