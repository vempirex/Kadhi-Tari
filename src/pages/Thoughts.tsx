import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sparkles, MessageCircle, Heart, Plus, Send, Zap, Wind, Star, Sun, Moon, Compass, Globe, Fingerprint, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Thought {
  id: string;
  text: string;
  category: string;
  created_at: string;
}

export default function Thoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThought, setNewThought] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchThoughts();

    const channel = supabase
      .channel('public:thoughts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'thoughts' }, (payload) => {
        setThoughts((prev) => [payload.new as Thought, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchThoughts = async () => {
    const { data, error } = await supabase
      .from('thoughts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setThoughts(data);
    setIsLoading(false);
  };

  const handleAddThought = async () => {
    if (!newThought.trim() || isSending) return;
    setIsSending(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('thoughts').insert([
        {
          text: newThought,
          category: 'Passing By',
          user_id: user?.id
        }
      ]);

      if (error) throw error;
      setNewThought("");
    } catch (err) {
      console.error("Error adding thought:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="space-y-12 text-center relative py-12 px-6 sm:px-0 z-30">
        <div className="flex flex-col items-center gap-16 relative z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-10 px-16 py-8 rounded-full bg-white/[0.01] border-4 border-white/5 text-rose-500 font-black uppercase tracking-[1.5em] text-[18px] backdrop-blur-[150px] shadow-inner italic"
          >
            <Wind size-[4rem] strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
            Nebulous Notations
          </motion.div>
          <h1 className="text-7xl sm:text-[12rem] font-serif glow-text leading-[0.85] tracking-tighter italic drop-shadow-3xl">Ethereal Thoughts</h1>
          <p className="text-gray-500 text-4xl sm:text-[9rem] font-handwritten italic opacity-80 max-w-6xl mx-auto leading-none selection:bg-rose-500/40">
            "Small clouds of consciousness drifting through our shared sky, waiting to be whispered back to life..."
          </p>
        </div>
      </header>

      {/* Input Area - Premium Cinematic Input */}
      <section className="px-6 sm:px-0 relative z-40 max-w-7xl mx-auto w-full">
        <Card className="p-20 sm:p-32 flex items-center gap-24 border-4 border-white/5 bg-white/[0.01] shadow-[0_250px_600px_rgba(0,0,0,1)] backdrop-blur-[200px] focus-within:border-rose-500/60 transition-all duration-[1500ms] rounded-[8rem] group/input shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.1] to-transparent opacity-0 group-focus-within/input:opacity-100 transition-all duration-[2500ms]" />
          <div className="pl-16 text-rose-500 opacity-20 group-focus-within/input:opacity-100 transition-all duration-[1500ms]">
            <Zap size-[10rem] strokeWidth={0.05} className="group-focus-within/input:animate-pulse fill-rose-500 drop-shadow-3xl" />
          </div>
          <input 
            type="text" 
            placeholder="Whisper into the collective void..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
            className="flex-1 bg-transparent border-none outline-none text-[8rem] sm:text-[10rem] py-16 placeholder:text-gray-950 font-serif italic tracking-tighter transition-all duration-[1500ms] text-white selection:bg-rose-500/40 leading-none"
          />
          <Button 
            onClick={handleAddThought}
            isLoading={isSending}
            disabled={!newThought.trim()}
            className="h-[15rem] w-[15rem] sm:h-[22rem] sm:w-[22rem] rounded-[7rem] p-0 shrink-0 shadow-[0_150px_350px_rgba(244,63,94,0.7)] relative overflow-hidden group/btn border-none"
            size="xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-950 to-orange-950 opacity-0 group-hover/btn:opacity-100 transition-all duration-[1500ms]" />
            <Plus size-[12rem] strokeWidth={0.05} className="relative z-10 group-hover/btn:rotate-[180deg] transition-all duration-[2000ms] text-white drop-shadow-3xl" />
          </Button>
        </Card>
      </section>

      <div className="grid gap-48 sm:gap-[6rem] px-6 sm:px-0 relative z-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-[25rem] gap-24">
            <div className="relative">
              <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Cloud size-[10rem] strokeWidth={0.05} className="absolute inset-0 m-auto text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
            </div>
            <p className="text-[18px] text-gray-800 font-black uppercase tracking-[1.5em] animate-pulse italic">Capturing Clouds...</p>
          </div>
        ) : thoughts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 150, filter: 'blur(80px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            className="text-center py-[25rem] space-y-48"
          >
            <div className="p-[12rem] bg-white/[0.01] rounded-[10rem] w-fit mx-auto border-8 border-dashed border-white/5 shadow-inner group hover:scale-125 transition-all duration-[10s] shadow-[0_150px_350px_rgba(0,0,0,1)]">
              <Sparkles size-[30rem] strokeWidth={0.01} className="text-gray-950 opacity-10 group-hover:opacity-100 transition-all duration-[3000ms] drop-shadow-3xl" />
            </div>
            <p className="font-handwritten text-[10rem] sm:text-[13rem] italic text-gray-800 opacity-20 leading-none drop-shadow-2xl">"The sky is clear today. Let's add some thoughts to our constellation..."</p>
          </motion.div>
        ) : (
          <div className="grid gap-48 sm:gap-[6rem] max-w-7xl mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought, index) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: 200, filter: 'blur(80px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.8, y: -150, filter: 'blur(80px)' }}
                  transition={{ delay: index * 0.05, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card
                    className="p-24 sm:p-64 relative overflow-hidden group hover:border-rose-500/60 transition-all duration-[2500ms] bg-white/[0.01] backdrop-blur-[150px] shadow-[0_250px_550px_rgba(0,0,0,1)] shadow-inner rounded-[9rem]"
                  >
                    {/* Floating Decorative Elements */}
                    <div className="absolute top-0 right-0 p-64 opacity-[0.01] group-hover:opacity-[0.15] transition-all duration-[12000ms] group-hover:scale-150 transform group-hover:rotate-[-45deg] pointer-events-none text-white">
                      <Cloud size-[60rem] strokeWidth={0.01} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-32 mb-48 relative z-10">
                      <div className="flex items-center gap-24">
                        <div className="w-[12rem] h-[12rem] rounded-[6rem] bg-rose-500/20 border-4 border-rose-500/40 flex items-center justify-center text-rose-500 group-hover:bg-rose-500/40 transition-all duration-[2000ms] shadow-inner shadow-3xl relative overflow-hidden">
                           <div className="absolute inset-0 bg-rose-500/10 blur-[20px]" />
                          <Moon size-[7rem] strokeWidth={0.01} className="group-hover:rotate-[60deg] transition-all duration-[2000ms] fill-rose-500 shadow-2xl drop-shadow-3xl relative z-10" />
                        </div>
                        <div className="px-32 py-10 rounded-full bg-white/[0.01] text-gray-950 border-4 border-white/5 text-[22px] font-black uppercase tracking-[1.2em] italic shadow-inner backdrop-blur-[150px] shadow-3xl drop-shadow-2xl">
                          Passing By
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-12 text-right">
                        <div className="flex items-center gap-16">
                           <Fingerprint size-[5rem] strokeWidth={1} className="text-gray-950 opacity-20 drop-shadow-3xl" />
                          <span className="text-[20px] uppercase tracking-[1em] text-gray-950 font-black italic opacity-40">
                            {new Date(thought.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="w-8 h-8 rounded-full bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,1)] animate-pulse" />
                        </div>
                        <span className="text-[20px] uppercase tracking-[1em] text-gray-950 font-black italic opacity-20">
                          {new Date(thought.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-8xl sm:text-[14rem] font-serif leading-none italic text-white group-hover:text-rose-400 transition-all duration-[2000ms] relative z-10 tracking-tighter mb-48 selection:bg-rose-500/40 drop-shadow-3xl">
                      "{thought.text}"
                    </p>

                    <div className="flex items-center gap-48 relative z-10">
                      <button className="flex items-center gap-16 text-gray-950 hover:text-rose-500 transition-all duration-[2000ms] group/btn">
                        <div className="p-24 rounded-[6rem] bg-white/[0.01] border-4 border-white/5 group-hover/btn:bg-rose-500/30 group-hover/btn:border-rose-500/60 transition-all duration-[2000ms] shadow-inner shadow-3xl group-hover/btn:shadow-[0_100px_200px_rgba(244,63,94,0.7)] relative overflow-hidden">
                           <div className="absolute inset-0 bg-rose-500/10 blur-[30px] opacity-0 group-hover/btn:opacity-100 transition-all" />
                          <Heart size-[8rem] strokeWidth={0.01} className="group-hover/btn:fill-rose-500 transition-all duration-[2000ms] group-hover/btn:scale-150 group-hover/btn:rotate-[30deg] drop-shadow-3xl relative z-10" />
                        </div>
                        <span className="text-[24px] font-black uppercase tracking-[1.5em] italic drop-shadow-2xl">Resonate</span>
                      </button>
                      <button className="flex items-center gap-16 text-gray-950 hover:text-blue-500 transition-all duration-[2000ms] group/btn">
                        <div className="p-24 rounded-[6rem] bg-white/[0.01] border-4 border-white/5 group-hover/btn:bg-blue-500/30 group-hover/btn:border-blue-500/60 transition-all duration-[2000ms] shadow-inner shadow-3xl group-hover/btn:shadow-[0_100px_200px_rgba(59,130,246,0.7)] relative overflow-hidden">
                           <div className="absolute inset-0 bg-blue-500/10 blur-[30px] opacity-0 group-hover/btn:opacity-100 transition-all" />
                          <MessageCircle size-[8rem] strokeWidth={0.01} className="group-hover/btn:scale-150 transition-all duration-[2000ms] group-hover/btn:-rotate-[30deg] drop-shadow-3xl relative z-10" />
                        </div>
                        <span className="text-[24px] font-black uppercase tracking-[1.5em] italic drop-shadow-2xl">Echo</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
