import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, Trophy, Star, MessageSquare, Plus, X, Heart, Sparkles, Send, Shield, Zap, Globe, Fingerprint, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { twMerge } from 'tailwind-merge';

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
  { id: 'Award', label: 'Award', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'Skill', label: 'Skill', icon: Star, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Moment', label: 'Moment', icon: Laugh, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'Quote', label: 'Quote', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
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
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase.from('jokes').insert([
        {
          ...newJoke,
          user_id: user.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewJoke({ title: '', description: '', tag: 'Award', icon_name: 'Laugh' });
      await fetchJokes();
    } catch (err) {
      console.error("Error adding joke:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteJoke = async (id: string) => {
    if (!confirm("Are you sure you want to remove this artifact from our dialet?")) return;
    
    try {
      const { error } = await supabase.from('jokes').delete().eq('id', id);
      if (error) throw error;
      setJokes(jokes.filter(j => j.id !== id));
    } catch (err) {
      console.error("Error deleting joke:", err);
    }
  };

  if (isLoading && jokes.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing artifacts...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <Laugh size={16} />
            Vibrant Echoes
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Inside Jokes</h1>
          <p className="text-warm-500 font-medium text-lg max-w-2xl">
            The secret dialect of our shared universe. Artifacts of shared laughter.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="md"
          >
            <Plus size={18} className="mr-2" /> Seal an Artifact
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
        {jokes.length === 0 ? (
          <div className="col-span-full py-24 text-center space-y-6 bg-white rounded-3xl border border-dashed border-warm-200">
            <div className="p-10 bg-warm-50 rounded-3xl text-warm-200 border border-warm-100 w-fit mx-auto">
              <Laugh size={64} strokeWidth={1} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-charcoal">Silent corridors</h2>
              <p className="text-warm-400 font-medium max-w-sm mx-auto">
                Our secret language is waiting to be written. Share a moment that only we understand.
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="soft"
            >
              Seal First Artifact <Plus size={18} className="ml-2" />
            </Button>
          </div>
        ) : (
          jokes.map((joke, i) => {
            const Icon = iconMap[joke.icon_name] || Laugh;
            const tag = tags.find(t => t.id === joke.tag) || tags[2];
            return (
              <motion.div
                key={joke.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 h-full flex flex-col justify-between hover:border-rose-100 transition-all group">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className={twMerge("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border shadow-sm", tag.bg, tag.color, "border-current/10")}>
                        <tag.icon size={14} />
                        {joke.tag}
                      </div>
                      <div className="p-2 text-warm-200 group-hover:text-rose-500 transition-colors">
                        <Icon size={24} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-outfit font-bold text-charcoal tracking-tight group-hover:text-rose-600 transition-colors leading-tight">{joke.title}</h3>
                      <p className="text-sm font-medium text-warm-500 italic leading-relaxed">
                        "{joke.description}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-warm-100 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-all">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warm-400">
                      <Fingerprint size={14} />
                      <span>Encrypted Artifact</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleDeleteJoke(joke.id)}
                        className="p-1 hover:text-rose-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <Sparkles size={14} className="text-rose-500" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Joke Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[2010] w-full max-w-xl"
            >
              <Card className="p-8 space-y-8 bg-white shadow-premium">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                      <Shield size={16} />
                      Archive Transmission
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-charcoal">New Artifact</h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Artifact Title</label>
                    <input
                      placeholder="e.g. The 2-minute champion..."
                      value={newJoke.title}
                      onChange={(e) => setNewJoke({ ...newJoke, title: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-bold text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">The Backstory</label>
                    <textarea
                      placeholder="Capture the essence of this shared moment..."
                      value={newJoke.description}
                      onChange={(e) => setNewJoke({ ...newJoke, description: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl p-4 text-sm font-medium text-charcoal min-h-[150px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Artifact Essence</label>
                    <div className="grid grid-cols-2 gap-3">
                      {tags.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setNewJoke({ ...newJoke, tag: t.id, icon_name: t.id === 'Moment' ? 'Laugh' : t.id })}
                          className={twMerge(
                            "p-3 rounded-xl border text-left transition-all flex items-center gap-3",
                            newJoke.tag === t.id 
                              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                              : "bg-warm-50 border-warm-100 text-warm-400 hover:bg-warm-100 hover:border-warm-200"
                          )}
                        >
                          <t.icon size={18} className={twMerge("transition-all", newJoke.tag === t.id ? t.color : "text-warm-300")} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddJoke}
                    isLoading={isAdding}
                    disabled={!newJoke.title}
                    className="w-full"
                  >
                    Seal Artifact
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
