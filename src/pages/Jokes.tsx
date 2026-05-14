import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, Trophy, Star, MessageSquare, Plus, X, Loader2, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

export default function Jokes() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (!newJoke.title) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('jokes').insert([
      {
        ...newJoke,
        user_id: user?.id
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setNewJoke({ title: '', description: '', tag: 'Award', icon_name: 'Laugh' });
      fetchJokes();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-serif glow-text">Inside Jokes 😂</h1>
          <p className="text-gray-400 text-sm font-handwritten">Our shared language...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-full bg-primary text-background"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          jokes.map((joke, i) => {
            const Icon = iconMap[joke.icon_name] || Laugh;
            return (
              <motion.div
                key={joke.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:bg-white/5 transition-all"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon size={80} />
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-primary`}>
                      {joke.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{joke.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed italic">
                    "{joke.description}"
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Joke Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card rounded-[3rem] w-full max-w-md p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Add a Joke</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  placeholder="Joke Title (e.g. 2-minute champion)"
                  value={newJoke.title}
                  onChange={(e) => setNewJoke({ ...newJoke, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors"
                />
                <textarea
                  placeholder="Describe the moment..."
                  value={newJoke.description}
                  onChange={(e) => setNewJoke({ ...newJoke, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                />
                <select
                  value={newJoke.tag}
                  onChange={(e) => setNewJoke({ ...newJoke, tag: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors appearance-none text-white"
                >
                  <option value="Award" className="bg-background">Award 🏆</option>
                  <option value="Skill" className="bg-background">Skill ⭐</option>
                  <option value="Hobby" className="bg-background">Hobby 🎮</option>
                  <option value="Memory" className="bg-background">Memory 📸</option>
                </select>
                <button
                  onClick={handleAddJoke}
                  className="w-full py-4 rounded-2xl bg-primary text-background font-bold shadow-lg shadow-primary/20"
                >
                  Save to Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

