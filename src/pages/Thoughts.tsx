import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sparkles, MessageCircle, Heart, Plus, Send, Zap } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <header className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
            <Cloud size={12} className="animate-pulse" />
            Nebulous Notations
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Ethereal Thoughts</h1>
          <p className="text-gray-400 text-lg font-handwritten italic opacity-80 max-w-lg mx-auto">
            Small clouds of consciousness drifting through our shared sky... ☁️
          </p>
        </div>
      </header>

      {/* Input Area */}
      <section className="px-2 sm:px-0">
        <Card className="p-2 sm:p-3 flex items-center gap-4 border-white/5 bg-white/[0.02] shadow-2xl focus-within:border-rose-500/30 transition-all duration-500 rounded-[2.5rem]">
          <div className="pl-6 text-rose-400 opacity-50">
            <Zap size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Whisper into the void..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
            className="flex-1 bg-transparent border-none outline-none text-lg py-4 placeholder:text-gray-600 font-medium"
          />
          <Button 
            onClick={handleAddThought}
            isLoading={isSending}
            disabled={!newThought.trim()}
            className="h-14 w-14 rounded-full p-0 shrink-0"
          >
            <Plus size={24} strokeWidth={3} />
          </Button>
        </Card>
      </section>

      <div className="grid gap-8 px-2 sm:px-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Cloud size={20} className="absolute inset-0 m-auto text-rose-500/50 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Capturing Clouds...</p>
          </div>
        ) : thoughts.length === 0 ? (
          <div className="text-center py-40 space-y-8 opacity-40">
            <div className="p-10 bg-white/[0.02] rounded-[2.5rem] w-fit mx-auto border border-white/5">
              <Sparkles size={64} strokeWidth={1} />
            </div>
            <p className="font-handwritten text-2xl italic">The sky is clear today. Let's add some thoughts...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought, index) => (
                <Card
                  key={thought.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-8 sm:p-12 relative overflow-hidden group hover:border-rose-500/20 transition-all duration-700"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cloud size={120} strokeWidth={1} />
                  </div>

                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">
                      Passing By
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">
                        {new Date(thought.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black">
                        {new Date(thought.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-2xl sm:text-3xl font-serif leading-tight italic text-white/90 group-hover:text-rose-400 transition-colors duration-700 relative z-10">
                    "{thought.text}"
                  </p>

                  <div className="mt-12 flex items-center gap-10 relative z-10">
                    <button className="flex items-center gap-3 text-gray-500 hover:text-rose-400 transition-all duration-500 group/btn">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover/btn:bg-rose-500/10 group-hover/btn:border-rose-500/20 transition-all">
                        <Heart size={20} className="group-hover/btn:fill-rose-500 transition-all" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Resonate</span>
                    </button>
                    <button className="flex items-center gap-3 text-gray-500 hover:text-blue-400 transition-all duration-500 group/btn">
                      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover/btn:bg-blue-500/10 group-hover/btn:border-blue-500/20 transition-all">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Echo</span>
                    </button>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

