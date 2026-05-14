import { motion } from 'framer-motion';
import { Cloud, Sparkles, MessageCircle, Heart, Loader2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    if (!newThought.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('thoughts').insert([
      {
        text: newThought,
        category: 'Passing By',
        user_id: user?.id
      }
    ]);

    if (!error) setNewThought("");
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-serif glow-text">Random Thoughts</h1>
        <p className="text-gray-400 font-handwritten text-xl italic">
          Just small clouds passing through our minds... ☁️
        </p>
      </motion.div>

      {/* Input Area */}
      <div className="glass-card rounded-3xl p-2 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="What's on your mind?..."
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm px-4 placeholder:text-gray-600"
        />
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleAddThought}
          className="p-3 rounded-2xl bg-secondary text-background"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          thoughts.map((thought, index) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-[2.5rem] p-6 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Cloud size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  {new Date(thought.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="text-lg font-medium leading-relaxed italic">
                "{thought.text}"
              </p>

              <div className="mt-6 flex items-center gap-4 text-gray-500">
                <button className="flex items-center gap-2 hover:text-primary transition-colors text-sm">
                  <Heart size={16} /> 0
                </button>
                <button className="flex items-center gap-2 hover:text-secondary transition-colors text-sm">
                  <MessageCircle size={16} /> 0
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

