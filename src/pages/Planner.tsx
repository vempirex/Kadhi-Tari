import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Circle, Plus, X, Star, Sparkles, Zap, Phone, Wine, Plane, Tv, ArrowRight, History, Heart, MapPin, Compass, Landmark, Fingerprint, Shield, Wind, Sun, Moon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Plan {
  id: string;
  title: string;
  plan_date: string;
  plan_time: string;
  category: string;
  is_completed: boolean;
}

const categories = [
  { id: 'Call', label: 'Call', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Date', label: 'Date', icon: Wine, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'Travel', label: 'Travel', icon: Plane, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'Watch Party', label: 'Watch Party', icon: Tv, color: 'text-purple-600', bg: 'bg-purple-50' },
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
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase.from('plans').insert([
        {
          ...newPlan,
          user_id: user.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewPlan({ title: '', plan_date: new Date().toISOString().split('T')[0], plan_time: '21:00', category: 'Call' });
      await fetchPlans();
    } catch (err) {
      console.error("Error adding plan:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (error) throw error;
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
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

  if (isLoading && plans.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing horizons...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <Calendar size={16} />
            Celestial Coordination
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Our Roadmap</h1>
          <p className="text-warm-500 font-medium text-lg max-w-2xl">
            Mapping our shared future, one beautiful moment at a time.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="md"
          >
            <Plus size={18} className="mr-2" /> New Horizon
          </Button>
        </div>
      </header>

      <div className="space-y-8 px-2 pb-24">
        {plans.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="py-24 text-center space-y-6 border-dashed border-2 flex flex-col items-center">
              <div className="p-10 bg-warm-50 rounded-3xl text-warm-200 border border-warm-100">
                <Sparkles size={64} strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-charcoal">No horizons yet</h2>
                <p className="text-warm-400 font-medium max-w-sm mx-auto">
                  Our future is a blank sky waiting for its stars. Let's map our next moment.
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                variant="soft"
              >
                Manifest First Plan <Plus size={18} className="ml-2" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto w-full">
            {plans.map((plan, i) => {
              const cat = categories.find(c => c.id === plan.category) || categories[0];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    className={twMerge(
                      "p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 group transition-all hover:border-rose-100",
                      plan.is_completed ? "opacity-60 bg-warm-50/50" : "bg-white"
                    )}
                  >
                    <button 
                      onClick={() => togglePlan(plan.id, plan.is_completed)}
                      className={twMerge(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0",
                        plan.is_completed 
                          ? "bg-emerald-500 text-white" 
                          : "bg-warm-50 text-warm-200 border-2 border-warm-100 hover:border-rose-200 hover:text-rose-500"
                      )}
                    >
                      {plan.is_completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1 space-y-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <cat.icon size={14} className={cat.color} />
                          <span className={twMerge("text-[10px] font-bold uppercase tracking-widest", cat.color)}>{plan.category}</span>
                        </div>
                        <h3 className={twMerge(
                          "text-xl font-outfit font-bold tracking-tight transition-all",
                          plan.is_completed ? "line-through text-warm-400" : "text-charcoal group-hover:text-rose-600"
                        )}>{plan.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-warm-400">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warm-50 border border-warm-100">
                          <Calendar size={12} className="text-rose-500" />
                          <span>
                            {new Date(plan.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warm-50 border border-warm-100">
                          <Clock size={12} className="text-blue-500" />
                          <span>{plan.plan_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 h-auto text-warm-300 hover:text-rose-600"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Idea Box Section */}
      <section className="pt-12 space-y-8 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-[10px]">
            <Zap size={16} />
            Idea Manifestation
          </div>
          <h2 className="text-3xl font-outfit font-bold text-charcoal tracking-tight">The Dream Space</h2>
          <p className="text-warm-400 font-medium text-sm">Whispers of what could be, waiting for a "Yes".</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-24">
          <Card className="p-6 space-y-6 border-dashed border-2 border-rose-200 bg-rose-50/20 hover:bg-rose-50/40 transition-all group">
            <div className="space-y-2">
              <p className="text-xl font-medium text-charcoal italic leading-relaxed">"Sunrise meditation at the old temple? 🌅"</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400">Projected by You</p>
            </div>
            <Button size="sm" className="w-full sm:w-auto">
              Echo Yes <Sparkles size={16} className="ml-2" />
            </Button>
          </Card>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl border-dashed border-2 border-warm-200 hover:border-rose-300 hover:bg-rose-50/10 transition-all flex flex-col items-center justify-center p-8 gap-3 group text-warm-300 hover:text-rose-500"
          >
            <div className="p-4 rounded-xl bg-warm-50 group-hover:bg-rose-50 border border-warm-100 group-hover:border-rose-100 transition-all">
              <Plus size={32} />
            </div>
            <div className="space-y-1 text-center">
              <span className="text-xs font-bold uppercase tracking-widest">Project a Vision</span>
              <p className="text-[10px] font-medium italic">Cast a dream onto our horizon</p>
            </div>
          </button>
        </div>
      </section>

      {/* Add Plan Modal */}
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
                      <Zap size={16} />
                      Manifest Destiny
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-charcoal">New Plan</h2>
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
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">What's the vision?</label>
                    <input
                      placeholder="E.g. Movie night, Dinner date..."
                      value={newPlan.title}
                      onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-bold text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Earth Date</label>
                      <input
                        type="date"
                        value={newPlan.plan_date}
                        onChange={(e) => setNewPlan({ ...newPlan, plan_date: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Celestial Time</label>
                      <input
                        type="time"
                        value={newPlan.plan_time}
                        onChange={(e) => setNewPlan({ ...newPlan, plan_time: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Vibe Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewPlan({ ...newPlan, category: cat.id })}
                          className={twMerge(
                            "p-4 rounded-xl border text-left transition-all flex items-center gap-3 group/cat-btn",
                            newPlan.category === cat.id 
                              ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                              : "bg-warm-50 border-warm-100 text-warm-400 hover:bg-warm-100 hover:border-warm-200"
                          )}
                        >
                          <cat.icon size={20} className={twMerge("transition-all", newPlan.category === cat.id ? cat.color : "text-warm-300")} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddPlan}
                    isLoading={isAdding}
                    disabled={!newPlan.title}
                    className="w-full"
                  >
                    Seal Transmission
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
