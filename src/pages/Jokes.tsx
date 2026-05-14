import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, Trophy, Star, MessageSquare, Plus, X, Heart, Sparkles, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Joke {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon_name: string;
}

const iconMap: Record<string, any> = {
  Trophy, Star, MessageSquare, Laugh
};

const tags = [
  { id: 'Award', label: 'Award', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'Skill', label: 'Skill', icon: Star, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'Moment', label: 'Moment', icon: Laugh, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { id: 'Quote', label: 'Quote', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function Jokes() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newJoke, setNewJoke] = useState({ title: '', description: '', tag: 'Award', icon_name: 'Laugh' });

  useEffect(() => {
    fetchJokes();
  }, []);

  const fetchJokes = async () => {
    const { data, error } = await supabase
      .from('jokes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setJokes(data);
    setIsLoading(false);
  };

  const handleAddJoke = async () => {
    if (!newJoke.title || isAdding) return;
    setIsAdding(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('jokes').insert([
        {
          ...newJoke,
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewJoke({ title: '', description: '', tag: 'Award', icon_name: 'Laugh' });
      fetchJokes();
    } catch (err) {
      console.error("Error adding joke:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 px-2 sm:px-0">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
            <Laugh size={12} className="animate-pulse" />
            Vibrant Echoes
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Inside Jokes</h1>
          <p className="text-gray-400 text-lg font-handwritten italic opacity-80 max-w-md mx-auto sm:mx-0">The secret dialect of our shared universe...</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="sm:w-fit gap-3"
          size="lg"
        >
          <Plus size={20} strokeWidth={3} />
          <span>New Artifact</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-40 gap-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Heart size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Syncing Laughter...</p>
          </div>
        ) : jokes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-40 premium-card space-y-10 border-dashed border-2 flex flex-col items-center border-white/5"
          >
            <div className="p-10 bg-rose-500/5 rounded-[2.5rem] w-fit text-rose-400/20 border border-rose-500/10 shadow-inner">
              <Laugh size={72} strokeWidth={1} />
            </div>
            <div className="space-y-4 px-8">
              <h2 className="text-3xl font-serif text-white/90 tracking-tight">Silent Corridors</h2>
              <p className="text-gray-500 italic max-w-sm mx-auto text-lg leading-relaxed font-handwritten opacity-70">
                "Our secret language is waiting to be written. Share a moment that only we understand."
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsModalOpen(true)} className="gap-3">
              Create First Joke <Plus size={16} />
            </Button>
          </motion.div>
        ) : (
          jokes.map((joke, i) => {
            const Icon = iconMap[joke.icon_name] || Laugh;
            const tag = tags.find(t => t.id === joke.tag) || tags[2];
            return (
              <Card
                key={joke.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-8 sm:p-10 relative overflow-hidden group hover:border-rose-500/20 transition-all duration-700 cursor-pointer active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 text-rose-400">
                  <Icon size={120} strokeWidth={1} />
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={twMerge("px-4 py-1.5 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2", tag.bg, tag.color)}>
                      <tag.icon size={12} strokeWidth={3} />
                      {joke.tag}
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white group-hover:text-rose-400 transition-colors duration-500 leading-tight tracking-tight">{joke.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed italic font-handwritten opacity-80 group-hover:opacity-100 transition-opacity">
                    "{joke.description}"
                  </p>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Joke Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <Card className="w-full max-w-xl p-8 sm:p-14 space-y-12 relative overflow-hidden border-white/5">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif text-white tracking-tight leading-none">Record a Moment</h2>
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.4em]">Seal a shared artifact in the vault</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-4 text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">Artifact Title</label>
                  <input
                    placeholder="e.g. The 2-minute champion..."
                    value={newJoke.title}
                    onChange={(e) => setNewJoke({ ...newJoke, title: e.target.value })}
                    className="input-field py-5 text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">The Backstory</label>
                  <textarea
                    placeholder="Capture the essence of this artifact..."
                    value={newJoke.description}
                    onChange={(e) => setNewJoke({ ...newJoke, description: e.target.value })}
                    className="input-field min-h-[140px] resize-none leading-relaxed text-lg font-medium py-6"
                  />
                </div>

                <div className="space-y-5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">Artifact Essence</label>
                  <div className="grid grid-cols-2 gap-4">
                    {tags.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setNewJoke({ ...newJoke, tag: t.id, icon_name: t.id === 'Moment' ? 'Laugh' : t.id })}
                        className={twMerge(
                          "p-5 rounded-[1.8rem] border-2 text-left transition-all flex items-center gap-4 group",
                          newJoke.tag === t.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.15)]" 
                            : "bg-white/[0.03] border-white/5 text-gray-600 hover:bg-white/10"
                        )}
                      >
                        <t.icon size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAddJoke}
                  isLoading={isAdding}
                  disabled={!newJoke.title}
                  className="w-full gap-5 py-6"
                  size="xl"
                >
                  <Send size={22} className="rotate-[-20deg]" />
                  <span>Transmit to Vault</span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

