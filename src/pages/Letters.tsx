import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Sparkles, Send, Quote, Bookmark, Zap, ArrowLeft, SendHorizonal } from 'lucide-react';
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

  if (isLoading && letters.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Unlocking Eternal Whispers...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24 pb-32">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 px-4 sm:px-0 relative">
        <div className="space-y-6 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-4 text-rose-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            <Quote size={12} className="animate-pulse" />
            Soul Correspondence
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif glow-text leading-tight tracking-tight">The Letter Vault</h1>
          <p className="text-gray-400 text-xl font-handwritten italic opacity-80 max-w-lg leading-relaxed">
            "Every word is a heartbeat frozen in time, waiting for your touch to bloom..."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsWriteModalOpen(true)}
          className="rounded-[2.5rem] px-10 h-auto py-6 shadow-[0_20px_50px_rgba(244,63,94,0.25)] group relative overflow-hidden"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="relative z-10 flex items-center gap-4">
            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>Archive Whisper</span>
          </span>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-12 px-2 sm:px-0 relative z-10">
        {letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="py-48 text-center space-y-12 border-dashed border-2 flex flex-col items-center border-white/5 bg-white/[0.01]">
              <div className="relative">
                <div className="p-16 bg-rose-500/5 rounded-[4rem] text-rose-400/20 border border-rose-500/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <MailOpen size={96} strokeWidth={1} />
                </div>
                <div className="absolute -top-4 -right-4 p-5 rounded-[2rem] bg-[#050506] border border-white/5 shadow-2xl">
                  <Sparkles size={28} className="text-rose-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-6 px-10">
                <h2 className="text-4xl font-serif text-white/90 tracking-tight">The vault is silent</h2>
                <p className="text-gray-500 italic max-w-md mx-auto text-xl leading-relaxed font-handwritten opacity-70">
                  "Words left unsaid are souls left unheard. Pour your heart onto the digital parchment..."
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsWriteModalOpen(true)} 
                className="rounded-[2.5rem] px-10 py-6 text-lg h-auto group"
              >
                Pen First Letter <Plus size={20} className="ml-3 group-hover:rotate-90 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {letters.map((letter, index) => {
              const cat = categories.find(c => c.id === letter.category) || categories[0];
              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <Card
                    onClick={() => setSelectedLetter(letter)}
                    className={twMerge(
                      "p-10 sm:p-12 flex flex-col justify-between cursor-pointer group active:scale-[0.98] transition-all border-white/5 h-[420px] relative overflow-hidden bg-white/[0.01] hover:bg-white/[0.03] shadow-2xl",
                      "hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
                    )}
                  >
                    <div className={twMerge("absolute top-0 left-0 w-2 h-full", cat.borderColor, "bg-current opacity-40")} />
                    
                    <div className="space-y-10 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className={twMerge("p-6 rounded-[2rem] transition-all group-hover:scale-110 shadow-2xl duration-500", cat.color, "group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]")}>
                          <cat.icon size={36} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] text-gray-800 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-all border border-white/5 duration-500 shadow-inner">
                          <Mail size={22} strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="font-serif text-3xl sm:text-4xl text-white group-hover:text-rose-400 transition-colors leading-tight tracking-tight">{cat.label}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                              <Heart size={10} className="text-rose-400 fill-rose-400" />
                            </div>
                            <span className="text-[10px] text-rose-400/80 font-black uppercase tracking-[0.3em]">
                              {letter.profiles?.display_name?.split(' ')[0] || letter.profiles?.username}
                            </span>
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                          <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
                            {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                      <p className="text-lg text-gray-500 line-clamp-3 font-handwritten italic opacity-60 leading-relaxed group-hover:opacity-90 transition-opacity">
                        "{letter.content}"
                      </p>
                    </div>
                    
                    {/* Decorative Element */}
                    <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none duration-1000 group-hover:scale-150 transform">
                      <Mail size={200} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-12 overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-black/98 backdrop-blur-[40px]"
            />
            
            <motion.div
              initial={{ scale: 0.8, y: 100, rotateY: 90 }}
              animate={{ scale: 1, y: 0, rotateY: 0 }}
              exit={{ scale: 0.8, y: 100, rotateY: -90 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl bg-[#fdfaf5] text-[#2d241e] rounded-[0.5rem] p-10 sm:p-24 shadow-[0_80px_200px_rgba(0,0,0,0.9)] relative overflow-hidden min-h-[85vh] flex flex-col z-[510] border-[24px] border-white/5 m-auto"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply" />
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] mix-blend-multiply" />
              
              {/* Wax Seal Placeholder Accent */}
              <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-rose-900/10 border-2 border-rose-900/5 flex items-center justify-center opacity-20 pointer-events-none">
                <Heart size={48} className="text-rose-900" />
              </div>

              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-rose-700 via-rose-500 to-rose-700 opacity-90 shadow-lg" />
              
              <button 
                onClick={() => setSelectedLetter(null)}
                className="absolute top-10 right-10 p-5 text-black/10 hover:text-rose-700 hover:bg-black/5 rounded-full transition-all active:scale-90 z-[520]"
              >
                <X size={32} />
              </button>

              <div className="relative z-10 flex-1 flex flex-col py-8 sm:py-12">
                <header className="border-b-2 border-black/[0.04] pb-16 mb-16 relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-10">
                    <div className="space-y-4">
                      <p className="font-handwritten text-6xl sm:text-8xl text-rose-900/90 leading-none">My Dearest,</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-rose-900/20" />
                        <p className="text-[11px] text-black/40 font-black uppercase tracking-[0.4em]">Resonance Protocol Active</p>
                      </div>
                    </div>
                    <div className="text-right sm:pt-10 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3 text-black/40 mb-1">
                        <Clock size={14} />
                        <p className="text-xs font-black uppercase tracking-[0.4em] font-serif">
                          Captured in Eternity
                        </p>
                      </div>
                      <p className="text-2xl font-handwritten text-black/60 italic">
                        {new Date(selectedLetter.created_at).toLocaleDateString('en-US', { dateStyle: 'full' })}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="font-handwritten text-3xl sm:text-5xl leading-[2] space-y-12 flex-1 text-black/85 overflow-y-auto no-scrollbar pr-10 selection:bg-rose-100 italic">
                  <p className="whitespace-pre-wrap">{selectedLetter.content}</p>
                </div>

                <footer className="pt-20 mt-20 border-t-2 border-black/[0.04] relative">
                  <div className="flex flex-col sm:flex-row justify-between items-end gap-12">
                    <div className="space-y-6">
                      <p className="text-[14px] font-black uppercase tracking-[0.5em] text-black/40 italic">Yours infinitely,</p>
                      <p className="font-handwritten text-7xl sm:text-9xl text-rose-900/90 leading-none transform -rotate-2">
                        {selectedLetter.profiles?.display_name || selectedLetter.profiles?.username}
                      </p>
                    </div>
                    <div className="relative group/seal">
                      <div className="w-32 h-32 rounded-full border-[6px] border-dashed border-rose-900/10 flex items-center justify-center text-rose-900/10 rotate-[25deg] group-hover/seal:rotate-0 transition-all duration-[2s] group-hover/seal:border-rose-900/30 group-hover/seal:text-rose-900/30 shadow-inner">
                        <Heart size={64} fill="currentColor" className="opacity-10 group-hover/seal:opacity-40 transition-opacity duration-[2s]" />
                      </div>
                      <div className="absolute -top-4 -left-4 text-rose-900/5 group-hover/seal:text-rose-900/20 transition-colors duration-[2s]">
                        <Sparkles size={40} />
                      </div>
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
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="fixed inset-0 bg-black/98 backdrop-blur-[30px]"
            />
            <Card className="w-full max-w-3xl p-10 sm:p-20 space-y-16 relative overflow-hidden border-white/5 bg-white/[0.01] shadow-[0_50px_150px_rgba(0,0,0,0.7)] m-auto">
              <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                    <Zap size={14} className="animate-pulse" />
                    Archive Transmission
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-tight">Pour Your Heart</h2>
                  <p className="text-gray-500 font-handwritten text-2xl italic opacity-80">"Leave no beautiful thought unshared..."</p>
                </div>
                <button 
                  onClick={() => setIsWriteModalOpen(false)} 
                  className="p-5 text-gray-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-white/5"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Tuning the Resonance</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                        className={twMerge(
                          "p-7 rounded-[2.5rem] border-2 text-center transition-all duration-500 flex flex-col items-center gap-5 group",
                          newLetter.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_15px_40px_rgba(244,63,94,0.2)]" 
                            : "bg-white/[0.02] border-white/5 text-gray-700 hover:bg-white/5 hover:border-white/10 hover:text-gray-400"
                        )}
                      >
                        <cat.icon size={32} strokeWidth={newLetter.category === cat.id ? 2.5 : 2} className="group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight whitespace-nowrap">{cat.label.split('Open when ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">The Frequency Stream</label>
                  <div className="relative group/input">
                    <div className="absolute top-8 left-8 text-rose-500/20 group-focus-within/input:text-rose-500/40 transition-colors pointer-events-none">
                      <Quote size={40} />
                    </div>
                    <textarea
                      placeholder="Whisper your thoughts, dreams, and echoes of our soul onto this digital parchment..."
                      value={newLetter.content}
                      onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                      className="input-field min-h-[350px] resize-none leading-relaxed text-xl font-medium py-12 px-12 sm:px-16 bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-700 shadow-inner font-handwritten italic placeholder:opacity-20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleWriteLetter}
                  isLoading={isSending}
                  disabled={!newLetter.content}
                  className="w-full gap-6 py-8 text-2xl tracking-tight shadow-[0_25px_80px_rgba(244,63,94,0.3)] relative overflow-hidden group"
                  size="xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <SendHorizonal size={28} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                    Seal and Archive
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


