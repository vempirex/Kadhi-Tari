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

  if (isLoading && thoughts.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Capturing clouds...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-3 text-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
            <Wind size={16} />
            Nebulous Notations
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Ethereal Thoughts</h1>
          <p className="text-warm-500 font-medium text-lg max-w-xl mx-auto">
            Small clouds of consciousness drifting through our shared sky.
          </p>
        </div>
      </header>

      {/* Input Area */}
      <section className="max-w-2xl mx-auto w-full px-2">
        <Card className="p-4 flex items-center gap-4 group focus-within:border-rose-200 transition-all bg-white shadow-premium">
          <div className="text-warm-200 group-focus-within:text-rose-500 transition-colors pl-2">
            <Zap size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Whisper into the void..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddThought()}
            className="flex-1 bg-transparent border-none outline-none text-lg py-2 placeholder:text-warm-200 font-medium text-charcoal"
          />
          <Button 
            onClick={handleAddThought}
            isLoading={isSending}
            disabled={!newThought.trim()}
            size="sm"
            className="h-12 w-12 rounded-xl p-0 shrink-0"
          >
            <Plus size={24} />
          </Button>
        </Card>
      </section>

      <div className="grid gap-6 px-2">
        {thoughts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 space-y-6"
          >
            <div className="p-10 bg-warm-50 rounded-full w-fit mx-auto border border-dashed border-warm-200 text-warm-200">
              <Sparkles size={48} strokeWidth={1} />
            </div>
            <p className="font-medium text-warm-400">The sky is clear today. Let's add some thoughts to our constellation...</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-6 relative overflow-hidden group hover:border-rose-100 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                          <Moon size={16} />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-warm-50 text-warm-400 border border-warm-100 text-[10px] font-bold uppercase tracking-widest italic">
                          Passing By
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-warm-300 font-bold">
                        {new Date(thought.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    
                    <p className="text-2xl font-outfit font-bold text-charcoal leading-tight mb-6">
                      "{thought.text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-warm-300 hover:text-rose-600 transition-colors group/res">
                        <Heart size={18} className="group-hover/res:fill-rose-600 transition-all" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Resonate</span>
                      </button>
                      <button className="flex items-center gap-2 text-warm-300 hover:text-blue-600 transition-colors group/echo">
                        <MessageCircle size={18} className="group-hover/echo:fill-blue-600 transition-all" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Echo</span>
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
