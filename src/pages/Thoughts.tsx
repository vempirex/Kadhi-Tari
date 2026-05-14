import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Sparkles, MessageCircle, Heart, Plus, Zap, 
  Wind, Moon, Fingerprint, Loader2
} from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4">
      <header className="space-y-6 text-center py-12">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.01] border border-white/5 text-rose-500 font-black uppercase tracking-[1em] text-[10px] backdrop-blur-3xl italic"
          >
            <Wind size={20} className="animate-pulse" />
            Nebulous Notations
          </motion.div>
          <h1 className="text-6xl sm:text-8xl font-serif italic text-white leading-none">Ethereal Thoughts</h1>
          <p className="text-gray-400 text-3xl sm:text-4xl font-handwritten italic opacity-80 max-w-2xl mx-auto">
            "Small clouds of consciousness drifting through our shared sky, waiting to be whispered back to life..."
          </p>
        </div>
      </header>

      {/* Input Area */}
      <section className="relative z-40 w-full">
        <Card variant="glass" className="p-6 flex items-center gap-6 group focus-within:border-rose-500/30 transition-all">
          <div className="text-rose-500/20 group-focus-within:text-rose-500 transition-colors">
            <Zap size={32} strokeWidth={1} />
          </div>
          <input 
            type="text" 
            placeholder="Whisper into the collective void..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
            className="flex-1 bg-transparent border-none outline-none text-4xl py-4 placeholder:text-white/5 font-serif italic text-white"
          />
          <Button 
            onClick={handleAddThought}
            isLoading={isSending}
            disabled={!newThought.trim()}
            className="h-16 w-16 rounded-2xl p-0 shrink-0"
          >
            <Plus size={32} />
          </Button>
        </Card>
      </section>

      <div className="grid gap-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={48} className="animate-spin text-rose-500" />
            <p className="text-[12px] text-white/20 font-black uppercase tracking-[1em] italic">Capturing Clouds...</p>
          </div>
        ) : thoughts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 space-y-8"
          >
            <div className="p-12 bg-white/[0.01] rounded-[4rem] w-fit mx-auto border border-dashed border-white/10 opacity-20">
              <Sparkles size={120} strokeWidth={0.5} />
            </div>
            <p className="font-handwritten text-4xl italic text-gray-400 opacity-40">"The sky is clear today. Let's add some thoughts to our constellation..."</p>
          </motion.div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card variant="glass" className="p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-10 transition-all duration-[5000ms] group-hover:scale-150 pointer-events-none">
                      <Cloud size={120} />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                          <Moon size={20} />
                        </div>
                        <div className="px-4 py-1 rounded-full bg-white/[0.02] text-white/40 border border-white/5 text-[10px] font-black uppercase tracking-widest italic">
                          Passing By
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <span className="text-[10px] uppercase tracking-widest text-white/20 font-black italic">
                          {new Date(thought.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-5xl font-serif italic text-white leading-tight mb-8">
                      "{thought.text}"
                    </p>

                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-3 text-white/20 hover:text-rose-500 transition-colors">
                        <Heart size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Resonate</span>
                      </button>
                      <button className="flex items-center gap-3 text-white/20 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Echo</span>
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
