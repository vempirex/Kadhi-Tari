import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, MailOpen, X, Heart, Clock, AlertCircle, Plus, Sparkles, Send, Quote, Bookmark, Zap, ArrowLeft, SendHorizonal, Star, Shield, Feather, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
  { id: 'sad', label: 'Open when sad', icon: Heart, color: 'text-blue-500', bg: 'bg-blue-500/15', borderColor: 'border-blue-500/20' },
  { id: 'thinking', label: 'Open when overthinking', icon: AlertCircle, color: 'text-purple-500', bg: 'bg-purple-500/15', borderColor: 'border-purple-500/20' },
  { id: 'missing', label: 'Open when missing me', icon: Clock, color: 'text-pink-500', bg: 'bg-pink-500/15', borderColor: 'border-pink-500/20' },
  { id: 'celebrating', label: 'Open when happy', icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-500/15', borderColor: 'border-orange-500/20' },
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1em] animate-pulse italic">Unlocking Eternal Whispers...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-16 px-6 sm:px-0 relative z-30">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-8 text-rose-500 font-black uppercase tracking-[1em] text-[16px] mb-6 italic">
            <Quote size={56} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
            Soul Correspondence
          </div>
          <h1 className="text-7xl sm:text-[11rem] font-serif glow-text leading-[0.85] tracking-tighter italic">Letter Vault</h1>
          <p className="text-gray-500 text-4xl sm:text-[8rem] font-handwritten italic opacity-80 max-w-5xl leading-tight selection:bg-rose-500/40">
            "Every word is a heartbeat frozen in time, waiting for your touch to bloom once more..."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsWriteModalOpen(true)}
          className="rounded-[5rem] px-[5rem] h-auto py-16 shadow-[0_120px_300px_rgba(244,63,94,0.7)] group relative overflow-hidden border-none"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
          <span className="relative z-10 flex items-center gap-16 text-[5rem] tracking-tighter italic">
            <Feather size={96} strokeWidth={1} className="group-hover:rotate-[25deg] group-hover:scale-125 transition-all duration-[1500ms] drop-shadow-3xl fill-current" />
            <span>Archive Whisper</span>
          </span>
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-32 sm:gap-48 px-6 sm:px-0 relative z-20">
        {letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 150, filter: 'blur(80px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            className="w-full"
          >
            <Card className="py-72 text-center space-y-32 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] shadow-inner rounded-[9rem] max-w-7xl mx-auto">
              <div className="relative">
                <div className="p-48 bg-rose-500/[0.03] rounded-[10rem] text-rose-500/5 border-4 border-rose-500/10 shadow-inner group-hover:scale-125 transition-all duration-[8s]">
                  <MailOpen size={560} strokeWidth={0.05} className="drop-shadow-3xl" />
                </div>
                <div className="absolute -top-24 -right-24 p-20 rounded-[5rem] bg-[#050506] border-4 border-white/10 shadow-[0_80px_200px_rgba(0,0,0,1)]">
                  <Star size={160} strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
                </div>
              </div>
              <div className="space-y-16 px-24">
                <h2 className="text-8xl sm:text-[13rem] font-serif text-white/90 tracking-tighter italic leading-none">The vault remains silent</h2>
                <p className="text-gray-800 italic max-w-6xl mx-auto text-[7rem] sm:text-[9rem] leading-none font-handwritten opacity-70 selection:bg-rose-500/40">
                  "Words left unsaid are souls left unheard. Pour your heart onto the digital parchment and let the echoes begin..."
                </p>
              </div>
              <Button 
                onClick={() => setIsWriteModalOpen(true)} 
                className="rounded-[6rem] px-[6rem] py-20 text-[7rem] italic tracking-tighter group h-auto border-none shadow-[0_120px_250px_rgba(244,63,94,0.7)]"
              >
                Pen First Letter <Plus size={160} strokeWidth={0.05} className="ml-16 group-hover:rotate-[180deg] transition-all duration-[2000ms]" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 sm:gap-[6rem]">
            {letters.map((letter, index) => {
              const cat = categories.find(c => c.id === letter.category) || categories[0];
              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 150, filter: 'blur(80px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ delay: index * 0.1, duration: 2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card
                    onClick={() => setSelectedLetter(letter)}
                    className={twMerge(
                      "p-20 sm:p-48 flex flex-col justify-between cursor-pointer group active:scale-[0.96] transition-all duration-[2000ms] border-4 border-white/5 h-[1000px] sm:h-[1200px] relative overflow-hidden bg-white/[0.01] hover:bg-white/[0.06] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] shadow-inner rounded-[8rem]",
                      "hover:-translate-y-48"
                    )}
                  >
                    <div className={twMerge("absolute top-0 left-0 w-10 h-full", cat.borderColor, "bg-current opacity-30 group-hover:opacity-100 transition-all duration-[1500ms] shadow-3xl shadow-rose-500/20")} />
                    
                    <div className="space-y-48 relative z-10">
                      <div className="flex justify-between items-start">
                        <div className={twMerge("p-24 rounded-[7rem] transition-all duration-[1500ms] group-hover:scale-125 shadow-inner border-4 border-white/5", cat.color, "bg-white/[0.01] relative overflow-hidden")}>
                           <div className="absolute inset-0 bg-current opacity-10 blur-[30px]" />
                          <cat.icon size={192} strokeWidth={0.05} className="group-hover:rotate-[25deg] transition-all duration-[1500ms] drop-shadow-[0_0_100px_currentColor] fill-current" />
                        </div>
                        <div className="p-20 rounded-[5rem] bg-white/[0.01] text-gray-950 group-hover:text-rose-500 group-hover:bg-rose-500/25 transition-all border-4 border-white/10 duration-[1500ms] shadow-inner shadow-3xl">
                          <Mail size={160} strokeWidth={0.05} className="drop-shadow-3xl" />
                        </div>
                      </div>
                      
                      <div className="space-y-16">
                        <p className="font-serif text-[9rem] sm:text-[13rem] text-white group-hover:text-rose-400 transition-all duration-[1500ms] leading-none tracking-tighter italic selection:bg-rose-500/40 drop-shadow-3xl">{cat.label}</p>
                        <div className="flex flex-wrap items-center gap-20">
                          <div className="flex items-center gap-12 group/author">
                            <div className="w-[8rem] h-[8rem] rounded-full bg-rose-500/20 border-4 border-rose-500/40 flex items-center justify-center shadow-inner relative overflow-hidden">
                               <div className="absolute inset-0 bg-rose-500/20 blur-[20px]" />
                              <Heart size={72} strokeWidth={1} className="text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl relative z-10" />
                            </div>
                            <span className="text-[20px] text-rose-500 font-black uppercase tracking-[0.8em] italic drop-shadow-2xl">
                              {letter.profiles?.display_name?.split(' ')[0] || letter.profiles?.username}
                            </span>
                          </div>
                          <span className="w-8 h-8 rounded-full bg-gray-950 shadow-inner" />
                          <span className="text-[18px] text-gray-950 font-black uppercase tracking-[0.8em] italic opacity-40">
                            {new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-32 pt-32 border-t-4 border-white/5 relative z-10">
                      <p className="text-[7rem] sm:text-[10rem] text-gray-800 line-clamp-6 font-handwritten italic opacity-50 leading-none group-hover:opacity-100 transition-all duration-[1500ms] selection:bg-rose-500/40 drop-shadow-2xl">
                        "{letter.content}"
                      </p>
                    </div>
                    
                    {/* Decorative Watermark */}
                    <div className="absolute -bottom-80 -right-80 opacity-[0.01] group-hover:opacity-[0.12] transition-all pointer-events-none duration-[10000ms] group-hover:scale-150 transform group-hover:-rotate-[45deg] text-white">
                      <Mail size={1120} strokeWidth={0.01} />
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
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="fixed inset-0 bg-black/99 backdrop-blur-[150px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[2010] w-full max-w-7xl m-auto"
            >
              <Card className="w-full p-20 sm:p-64 space-y-48 relative overflow-hidden border-4 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] backdrop-blur-[150px] shadow-inner rounded-[8rem]">
                <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.15] blur-[250px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-16">
                    <div className="flex items-center gap-12 text-rose-500 font-black uppercase tracking-[1.5em] text-[18px] mb-10 italic">
                      <Feather size={80} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
                      Seal a Whisper
                    </div>
                    <h2 className="text-8xl sm:text-[14rem] font-serif text-white tracking-tighter leading-none italic">New Transmission</h2>
                    <p className="text-gray-800 font-handwritten text-[9rem] sm:text-[11rem] italic opacity-80 leading-none">"Ink your soul onto the digital parchment..."</p>
                  </div>
                  <button 
                    onClick={() => setIsWriteModalOpen(false)} 
                    className="p-16 text-gray-800 hover:text-white hover:bg-white/15 rounded-[5rem] transition-all duration-[1500ms] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-inner shadow-[0_60px_120px_rgba(0,0,0,1)]"
                  >
                    <X size={160} strokeWidth={0.1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms]" />
                  </button>
                </div>

                <div className="space-y-64 relative z-10">
                  <div className="space-y-24">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-16 italic">Letter Protocol</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 sm:gap-32">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewLetter({ ...newLetter, category: cat.id })}
                          className={twMerge(
                            "p-24 rounded-[7rem] border-4 text-center transition-all duration-[1500ms] flex flex-col items-center gap-16 group/cat-btn shadow-3xl relative overflow-hidden shadow-inner",
                            newLetter.category === cat.id 
                              ? "bg-rose-500/25 border-rose-500 text-rose-500 shadow-[0_120px_250px_rgba(244,63,94,0.7)] scale-105" 
                              : "bg-white/[0.01] border-white/5 text-gray-950 hover:bg-white/[0.1] hover:border-white/40 hover:text-gray-800"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/cat-btn:opacity-100 transition-all duration-[1500ms]" />
                          <cat.icon size={160} strokeWidth={0.05} className="group-hover/cat-btn:scale-125 group-hover/cat-btn:rotate-[30deg] transition-all duration-[1500ms] relative z-10 shadow-2xl drop-shadow-3xl fill-current" />
                          <span className="text-[18px] font-black uppercase tracking-[1em] relative z-10 italic leading-none">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-16">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-16 italic">The Message</label>
                    <textarea
                      placeholder="Pour your heart here... Every word is eternal."
                      value={newLetter.content}
                      onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                      className="input-field min-h-[600px] py-24 px-24 resize-none leading-[1.6] text-[8rem] font-handwritten italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[2000ms] shadow-inner rounded-[8rem] no-scrollbar text-white placeholder:text-gray-950 selection:bg-rose-500/40"
                    />
                  </div>
                  
                  <Button
                    onClick={handleWriteLetter}
                    isLoading={isSending}
                    disabled={!newLetter.content}
                    className="w-full gap-32 py-[4rem] text-[9rem] tracking-tighter shadow-[0_150px_450px_rgba(244,63,94,0.7)] relative overflow-hidden group/submit border-none rounded-[8rem] leading-none"
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-[4rem] italic">
                      <SendHorizonal size={192} strokeWidth={0.1} className="rotate-[-30deg] group-hover/submit:translate-x-12 group-hover/submit:-translate-y-12 transition-all duration-[2500ms] drop-shadow-3xl" />
                      Seal into Vault
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selected Letter Modal - Parchment View */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 sm:p-32 overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-black/99 backdrop-blur-[200px]"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 500, rotateX: 60 }} 
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} 
              exit={{ scale: 0.8, opacity: 0, y: 500, rotateX: 60 }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[1800px] bg-[#fdfcf5] rounded-[6rem] p-24 sm:p-[15rem] shadow-[0_350px_700px_rgba(0,0,0,1)] relative z-[3010] border-[60px] sm:border-[15rem] border-black/5 m-auto overflow-hidden shadow-inner"
            >
              <div className="absolute inset-0 opacity-[0.45] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-multiply scale-[2.5]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#e5e0c5]/60 to-transparent pointer-events-none" />
              
              <button 
                onClick={() => setSelectedLetter(null)} 
                className="absolute top-48 right-48 p-24 text-black/10 hover:text-rose-950 transition-all hover:scale-150 hover:rotate-[180deg] duration-[2500ms] group"
              >
                <X size={320} strokeWidth={0.01} className="drop-shadow-3xl" />
              </button>

              <div className="relative z-10 space-y-[12rem] font-handwritten italic text-[#2c1810]">
                <div className="space-y-24">
                  <div className="flex items-center gap-24 text-rose-950/20 mb-24">
                     <div className="w-[20rem] h-[8px] bg-current shadow-inner rounded-full" />
                     <Fingerprint size={160} strokeWidth={1} className="drop-shadow-2xl" />
                     <div className="w-[20rem] h-[8px] bg-current shadow-inner rounded-full" />
                  </div>
                  <p className="text-[15rem] sm:text-[30rem] text-[#1a0f0a] leading-none tracking-tighter drop-shadow-3xl selection:bg-rose-950 selection:text-white">Dearest,</p>
                </div>

                <div className="text-[9rem] sm:text-[16rem] leading-[1.6] max-h-[50vh] overflow-y-auto no-scrollbar pr-32 text-justify selection:bg-rose-950 selection:text-white drop-shadow-2xl pb-[10rem]">
                  {selectedLetter.content}
                </div>

                <div className="pt-[12rem] border-t-[16px] border-black/10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-[5rem]">
                  <div className="space-y-32 text-center sm:text-left">
                    <p className="text-[6rem] font-black uppercase tracking-[1.5em] text-black/20 italic leading-none">Yours Infinitely,</p>
                    <p className="text-[20rem] sm:text-[40rem] text-[#1a0f0a] leading-none tracking-tighter drop-shadow-3xl selection:bg-rose-950 selection:text-white">
                       {selectedLetter.profiles?.display_name || selectedLetter.profiles?.username}
                    </p>
                  </div>
                  <div className="relative group/stamp">
                    <div className="w-[50rem] h-[50rem] sm:w-[70rem] sm:h-[70rem] rounded-full border-[30px] sm:border-[60px] border-dashed border-rose-950/10 flex items-center justify-center rotate-15 group-hover/stamp:rotate-[90deg] transition-all duration-[8000ms] relative shadow-inner">
                        <div className="absolute inset-0 bg-rose-950/5 blur-[40px]" />
                       <Heart size={880} className="text-rose-950/15 fill-rose-950/10 drop-shadow-[0_0_150px_rgba(0,0,0,0.1)]" strokeWidth={0.01} />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-rose-950/20 font-black uppercase tracking-[1em] text-[22px] -rotate-45 drop-shadow-2xl">Sanctuary Seal</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cinematic Vignette */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_800px_rgba(0,0,0,0.3)]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
