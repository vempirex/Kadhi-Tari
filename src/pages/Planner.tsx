import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Coffee, CheckCircle2, Circle, Plus, X, Loader2, Star, Sparkles, Zap, Phone, Wine, Plane, Tv } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Plan {
  id: string;
  title: string;
  plan_date: string;
  plan_time: string;
  category: string;
  is_completed: boolean;
}

const categories = [
  { id: 'Call', label: 'Call', icon: Phone, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'Date', label: 'Date', icon: Wine, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { id: 'Travel', label: 'Travel', icon: Plane, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'Watch Party', label: 'Watch Party', icon: Tv, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function Planner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({ 
    title: '', 
    plan_date: new Date().toISOString().split('T')[0], 
    plan_time: '21:00',
    category: 'Call'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('plan_date', { ascending: true });
    
    if (!error && data) setPlans(data);
    setIsLoading(false);
  };

  const handleAddPlan = async () => {
    if (!newPlan.title || isAdding) return;
    setIsAdding(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('plans').insert([
        {
          ...newPlan,
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewPlan({ title: '', plan_date: new Date().toISOString().split('T')[0], plan_time: '21:00', category: 'Call' });
      fetchPlans();
    } catch (err) {
      console.error("Error adding plan:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const togglePlan = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('plans')
      .update({ is_completed: !currentStatus })
      .eq('id', id);

    if (!error) {
      setPlans(plans.map(p => p.id === id ? { ...p, is_completed: !currentStatus } : p));
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Calendar size={12} />
            Shared Journey
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Shared Planner</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Mapping our next adventures...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <Plus size={28} />
        </motion.button>
      </header>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={32} />
            <p className="text-sm text-gray-500 font-medium">Reading our stars...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-4">
            <div className="p-4 bg-rose-500/10 rounded-full w-fit mx-auto text-rose-400">
              <Sparkles size={32} />
            </div>
            <p className="text-gray-400 italic">No plans scheduled. Let's make some magic?</p>
          </div>
        ) : (
          plans.map((plan, i) => {
            const cat = categories.find(c => c.id === plan.category) || categories[0];
            return (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={twMerge(
                  "premium-card p-6 flex items-center gap-6 group transition-all",
                  plan.is_completed ? "opacity-40 grayscale" : "hover:border-rose-500/30"
                )}
              >
                <button 
                  onClick={() => togglePlan(plan.id, plan.is_completed)}
                  className={twMerge(
                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                    plan.is_completed ? "bg-rose-500 text-white" : "bg-white/5 text-gray-600 border border-white/10 hover:border-rose-500/50 hover:text-rose-400"
                  )}
                >
                  {plan.is_completed ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <Circle size={24} strokeWidth={2.5} />}
                </button>
                
                <div className="flex-1 space-y-2">
                  <h3 className={twMerge(
                    "text-xl font-bold transition-all",
                    plan.is_completed ? "line-through text-gray-500" : "text-white group-hover:text-rose-400"
                  )}>{plan.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-rose-400" />
                      <span>{new Date(plan.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-blue-400" />
                      <span>{plan.plan_time}</span>
                    </div>
                    <div className={twMerge("px-2 py-0.5 rounded-md flex items-center gap-1", cat.bg, cat.color)}>
                      <cat.icon size={10} />
                      <span>{plan.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Idea Box Section */}
      <section className="pt-8 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-rose-400" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">Idea Universe</h2>
          </div>
          <Star size={14} className="text-yellow-400 fill-yellow-400 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="premium-card p-6 flex items-center justify-between group cursor-pointer border-dashed border-rose-500/20 bg-rose-500/5">
            <div className="space-y-1">
              <p className="text-xl font-handwritten text-white group-hover:text-rose-400 transition-colors">"Temple visit at sunrise? 🌅"</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Suggested by You</p>
            </div>
            <button className="px-5 py-2.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:scale-105 transition-transform">
              Vote Yes
            </button>
          </div>
          
          <button className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all flex flex-col items-center gap-2 text-gray-500 hover:text-rose-400">
            <Plus size={32} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Drop a new idea</span>
          </button>
        </div>
      </section>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Schedule Moment</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Add to shared journey</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">What's the plan?</label>
                  <input
                    placeholder="E.g. Movie night, Dinner date..."
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Date</label>
                    <input
                      type="date"
                      value={newPlan.plan_date}
                      onChange={(e) => setNewPlan({ ...newPlan, plan_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Time</label>
                    <input
                      type="time"
                      value={newPlan.plan_time}
                      onChange={(e) => setNewPlan({ ...newPlan, plan_time: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewPlan({ ...newPlan, category: cat.id })}
                        className={twMerge(
                          "p-3 rounded-2xl border text-left transition-all flex items-center gap-3",
                          newPlan.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/5" 
                            : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                        )}
                      >
                        <cat.icon size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddPlan}
                  disabled={!newPlan.title || isAdding}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-5 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Sparkles size={20} />
                      <span>Seal this Plan</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
