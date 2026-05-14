import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, Trophy, Star, MessageSquare, Plus, X, Heart, Sparkles, Send, Shield, Zap, Globe, Fingerprint } from 'lucide-react';
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
  { id: 'Award', label: 'Award', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/15' },
  { id: 'Skill', label: 'Skill', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/15' },
  { id: 'Moment', label: 'Moment', icon: Laugh, color: 'text-rose-500', bg: 'bg-rose-500/15' },
  { id: 'Quote', label: 'Quote', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/15' },
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
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-16 px-6 sm:px-0 relative z-20">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-8 text-rose-500 font-black uppercase tracking-[1em] text-[14px] mb-6 italic">
            <Laugh size={32} strokeWidth={1} className="animate-pulse fill-rose-500" />
            Vibrant Echoes
          </div>
          <h1 className="text-7xl sm:text-[11rem] font-serif glow-text leading-[0.85] tracking-tighter italic">Inside Jokes</h1>
          <p className="text-gray-500 text-4xl sm:text-[8rem] font-handwritten italic opacity-80 max-w-5xl mx-auto sm:mx-0 leading-tight selection:bg-rose-500/40">
            "The secret dialect of our shared universe. Artifacts of shared laughter frozen in our private constellation..."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[4rem] px-24 h-auto py-12 shadow-[0_100px_250px_rgba(244,63,94,0.6)] group relative overflow-hidden border-none"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-orange-800 opacity-0 group-hover:opacity-100 transition-all duration-[1500ms]" />
          <span className="relative z-10 flex items-center gap-12 text-4xl tracking-tighter italic">
            <Plus size={64} strokeWidth={1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms]" />
            <span>Seal an Artifact</span>
          </span>
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-32 sm:gap-48 px-6 sm:px-0 relative z-10">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-[25rem] gap-20">
            <div className="relative">
              <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Heart size={96} strokeWidth={0.1} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse drop-shadow-2xl" />
            </div>
            <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1.2em] animate-pulse italic">Syncing Shared Frequencies...</p>
          </div>
        ) : jokes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(50px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="col-span-full text-center py-[25rem] space-y-32 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] rounded-[8rem] shadow-inner"
          >
            <div className="p-48 bg-rose-500/[0.03] rounded-[9rem] w-fit text-rose-500/5 border-2 border-rose-500/10 shadow-inner group-hover:scale-125 transition-all duration-[8s]">
              <Laugh size={480} strokeWidth={0.1} className="drop-shadow-3xl" />
            </div>
            <div className="space-y-16 px-24">
              <h2 className="text-8xl sm:text-[12rem] font-serif text-white/90 tracking-tighter italic leading-none">Silent Corridors</h2>
              <p className="text-gray-800 italic max-w-6xl mx-auto text-[7rem] leading-tight font-handwritten opacity-70 selection:bg-rose-500/40">
                "Our secret language is waiting to be written. Share a moment that only we understand and let the echoes begin..."
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="rounded-[6rem] px-32 py-20 text-6xl h-auto group border-none shadow-[0_100px_200px_rgba(244,63,94,0.6)]"
            >
              Seal First Artifact <Plus size={96} strokeWidth={0.1} className="ml-16 group-hover:rotate-[180deg] transition-all duration-[1500ms]" />
            </Button>
          </motion.div>
        ) : (
          jokes.map((joke, i) => {
            const Icon = iconMap[joke.icon_name] || Laugh;
            const tag = tags.find(t => t.id === joke.tag) || tags[2];
            return (
              <motion.div
                key={joke.id}
                initial={{ opacity: 0, y: 150, filter: 'blur(60px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ delay: i * 0.1, duration: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  className="p-16 sm:p-48 relative overflow-hidden group hover:border-rose-500/60 transition-all duration-[2000ms] cursor-pointer active:scale-[0.96] bg-white/[0.01] backdrop-blur-[120px] shadow-[0_150px_350px_rgba(0,0,0,1)] rounded-[7rem] shadow-inner"
                >
                  <div className="absolute top-0 right-0 p-32 opacity-[0.01] group-hover:opacity-[0.1] group-hover:scale-150 group-hover:rotate-[30deg] transition-all duration-[5000ms] text-rose-500 pointer-events-none">
                    <Icon size={800} strokeWidth={0.05} />
                  </div>

                  <div className="space-y-24 relative z-10">
                    <div className="flex items-center gap-12">
                      <div className={twMerge("px-20 py-8 rounded-full border-2 border-white/5 text-[18px] font-black uppercase tracking-[0.8em] flex items-center gap-10 shadow-inner italic shadow-3xl", tag.bg, tag.color)}>
                        <tag.icon size={64} strokeWidth={1} className="drop-shadow-2xl" />
                        {joke.tag}
                      </div>
                    </div>
                    <h3 className="text-7xl sm:text-[10rem] font-serif text-white group-hover:text-rose-400 transition-all duration-[1500ms] leading-none tracking-tighter italic selection:bg-rose-500/40">{joke.title}</h3>
                    <p className="text-gray-800 text-[6rem] sm:text-[8rem] leading-tight italic font-handwritten opacity-80 group-hover:opacity-100 transition-all duration-[1500ms] selection:bg-rose-500/40">
                      "{joke.description}"
                    </p>
                  </div>

                  {/* Decorative Footnote */}
                  <div className="mt-[4rem] pt-16 border-t-4 border-white/5 flex items-center justify-between opacity-10 group-hover:opacity-60 transition-all duration-[1500ms] italic">
                    <div className="flex items-center gap-10 text-[18px] font-black uppercase tracking-[1.2em] text-gray-950">
                      <Fingerprint size={64} strokeWidth={1} />
                      <span>Encrypted Artifact</span>
                    </div>
                    <Sparkles size={64} strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-2xl" />
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Joke Modal - Sanctuary Reimagining */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/99 backdrop-blur-[150px]"
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
                      <Shield size={64} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
                      Archive Transmission
                    </div>
                    <h2 className="text-8xl sm:text-[13rem] font-serif text-white tracking-tighter leading-none italic">Record an Artifact</h2>
                    <p className="text-gray-800 font-handwritten text-[8rem] sm:text-[10rem] italic opacity-80 leading-none">"Seal a shared memory into the eternal vault..."</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-16 text-gray-800 hover:text-white hover:bg-white/15 rounded-[5rem] transition-all duration-[1500ms] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-inner shadow-[0_60px_120px_rgba(0,0,0,1)]"
                  >
                    <X size={160} strokeWidth={0.1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms]" />
                  </button>
                </div>

                <div className="space-y-48 relative z-10">
                  <div className="space-y-12">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-12 italic">Artifact Title</label>
                    <input
                      placeholder="e.g. The 2-minute champion..."
                      value={newJoke.title}
                      onChange={(e) => setNewJoke({ ...newJoke, title: e.target.value })}
                      className="input-field py-24 px-24 text-8xl sm:text-[14rem] font-serif tracking-tighter italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[7rem] text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none"
                    />
                  </div>

                  <div className="space-y-12">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-12 italic">The Backstory</label>
                    <textarea
                      placeholder="Capture the essence of this shared moment... Why does it matter?"
                      value={newJoke.description}
                      onChange={(e) => setNewJoke({ ...newJoke, description: e.target.value })}
                      className="input-field min-h-[600px] resize-none leading-[1.6] py-24 px-24 text-[8rem] font-handwritten italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[2000ms] shadow-inner rounded-[8rem] no-scrollbar text-white placeholder:text-gray-950 selection:bg-rose-500/40"
                    />
                  </div>

                  <div className="space-y-24">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-12 italic">Artifact Essence</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-16 sm:gap-32">
                      {tags.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setNewJoke({ ...newJoke, tag: t.id, icon_name: t.id === 'Moment' ? 'Laugh' : t.id })}
                          className={twMerge(
                            "p-20 rounded-[6rem] border-4 text-center transition-all duration-[1500ms] flex flex-col items-center gap-12 group relative overflow-hidden shadow-3xl shadow-inner",
                            newJoke.tag === t.id 
                              ? "bg-rose-500/25 border-rose-500 text-rose-500 shadow-[0_100px_200px_rgba(244,63,94,0.7)] scale-105" 
                              : "bg-white/[0.01] border-white/5 text-gray-950 hover:bg-white/[0.08] hover:border-white/40 hover:text-gray-800"
                          )}
                        >
                          <t.icon size={160} strokeWidth={0.05} className="group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-[1500ms] relative z-10 drop-shadow-2xl fill-current" />
                          <span className="text-[18px] font-black uppercase tracking-[1em] leading-tight italic relative z-10">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddJoke}
                    isLoading={isAdding}
                    disabled={!newJoke.title}
                    className="w-full gap-32 py-24 text-8xl tracking-tighter shadow-[0_120px_300px_rgba(244,63,94,0.6)] relative overflow-hidden group/submit border-none rounded-[8rem]"
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[1500ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-24 italic">
                      <Send size={160} strokeWidth={0.1} className="rotate-[-30deg] group-hover/submit:translate-x-20 group-hover/submit:-translate-y-20 transition-all duration-[2500ms] drop-shadow-3xl" />
                      Transmit to Vault
                    </span>
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
