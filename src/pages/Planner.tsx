import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Circle, Plus, X, Star, Sparkles, Zap, Phone, Wine, Plane, Tv, ArrowRight, History, Heart } from 'lucide-react';
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

  if (isLoading && plans.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Calculating Shared Frequencies...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-32">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 px-4 sm:px-0 relative">
        <div className="space-y-6 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-4 text-rose-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            <Calendar size={12} className="animate-pulse" />
            Celestial Coordination
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif glow-text leading-tight tracking-tight">Our Roadmap</h1>
          <p className="text-gray-400 text-xl font-handwritten italic opacity-80 max-w-lg leading-relaxed">
            "Every minute together is a star in our shared constellation, mapping the future of us."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[2.5rem] px-10 h-auto py-6 shadow-[0_20px_50px_rgba(244,63,94,0.25)] group relative overflow-hidden"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="relative z-10 flex items-center gap-4">
            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>New Horizon</span>
          </span>
        </Button>
      </header>

      <div className="space-y-10 sm:space-y-12 px-4 sm:px-0 relative">
        {plans.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative z-10"
          >
            <Card className="py-48 text-center space-y-12 border-dashed border-2 flex flex-col items-center border-white/5 bg-white/[0.01]">
              <div className="relative">
                <div className="p-16 bg-rose-500/5 rounded-[4rem] text-rose-400/20 border border-rose-500/10 shadow-inner">
                  <Sparkles size={96} strokeWidth={1} />
                </div>
                <div className="absolute -top-4 -right-4 p-5 rounded-[2rem] bg-[#050506] border border-white/5 shadow-2xl">
                  <Zap size={28} className="text-rose-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-6 px-10">
                <h2 className="text-4xl font-serif text-white/90 tracking-tight">No horizons yet</h2>
                <p className="text-gray-500 italic max-w-md mx-auto text-xl leading-relaxed font-handwritten opacity-70">
                  "Our future is a blank sky waiting for its stars. Let's map our next beautiful shared moment..."
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(true)} 
                className="rounded-[2.5rem] px-10 py-6 text-lg h-auto group"
              >
                Manifest First Plan <Plus size={20} className="ml-3 group-hover:scale-125 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:gap-10">
            {plans.map((plan, i) => {
              const cat = categories.find(c => c.id === plan.category) || categories[0];
              return (
                <Card 
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={twMerge(
                    "p-8 sm:p-14 flex flex-col sm:flex-row items-start sm:items-center gap-10 group transition-all duration-1000 hover:-translate-y-2 bg-white/[0.01] hover:bg-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.5)]",
                    plan.is_completed ? "opacity-30 grayscale-[0.8] blur-[0.5px]" : "hover:border-rose-500/30"
                  )}
                >
                  <button 
                    onClick={() => togglePlan(plan.id, plan.is_completed)}
                    className={twMerge(
                      "w-16 h-16 sm:w-20 sm:h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 shrink-0 relative overflow-hidden group/btn shadow-2xl",
                      plan.is_completed 
                        ? "bg-rose-500 text-white shadow-[0_15px_40px_rgba(244,63,94,0.4)]" 
                        : "bg-white/[0.02] text-gray-700 border border-white/5 hover:border-rose-500/50 hover:text-rose-400 group-hover:scale-110"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    {plan.is_completed ? <CheckCircle2 size={36} strokeWidth={3} className="relative z-10" /> : <Circle size={36} strokeWidth={2} className="relative z-10" />}
                  </button>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <div className={twMerge("flex items-center gap-3 transition-opacity duration-700", plan.is_completed ? "opacity-50" : "opacity-100")}>
                        <div className={twMerge("w-10 h-[1px] bg-current opacity-30", cat.color)} />
                        <span className={twMerge("text-[10px] font-black uppercase tracking-[0.5em]", cat.color)}>{plan.category}</span>
                      </div>
                      <h3 className={twMerge(
                        "text-3xl sm:text-5xl font-serif tracking-tight transition-all duration-1000 leading-tight",
                        plan.is_completed ? "line-through text-gray-500" : "text-white group-hover:text-rose-400"
                      )}>{plan.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 sm:gap-12 text-[11px] text-gray-500 font-black uppercase tracking-[0.4em]">
                      <div className="flex items-center gap-3 group/info">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover/info:bg-rose-500/10 group-hover/info:border-rose-500/20 transition-all duration-500">
                          <Calendar size={16} className="text-rose-500" />
                        </div>
                        <span className="group-hover/info:text-white transition-colors">
                          {new Date(plan.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 group/info">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover/info:bg-blue-500/10 group-hover/info:border-blue-500/20 transition-all duration-500">
                          <Clock size={16} className="text-blue-400" />
                        </div>
                        <span className="group-hover/info:text-white transition-colors">{plan.plan_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={32} className="text-rose-500/40" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Idea Box Section - Sanctuary Style */}
      <section className="pt-20 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex items-center justify-between px-4 sm:px-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-400 font-black uppercase tracking-[0.5em] text-[10px]">
              <Zap size={16} className="animate-pulse" />
              Idea Manifestation
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-tight">The Dream Space</h2>
            <p className="text-gray-500 font-handwritten text-2xl italic opacity-80">"Whispers of what could be, waiting for a 'Yes'..."</p>
          </div>
          <Star size={32} className="text-yellow-500 fill-yellow-500 animate-pulse opacity-20 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="p-10 sm:p-14 space-y-10 group cursor-pointer border-dashed border-rose-500/20 bg-rose-500/[0.01] hover:bg-rose-500/[0.03] hover:border-rose-500/40 transition-all duration-1000 hover:-translate-y-4 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="space-y-6 relative z-10">
              <p className="text-3xl sm:text-4xl font-handwritten text-white group-hover:text-rose-400 transition-colors leading-relaxed">"Sunrise meditation at the old temple? 🌅"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-gray-800" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Resonated by You</p>
              </div>
            </div>
            <Button size="lg" className="w-full sm:w-fit px-12 text-[11px] tracking-[0.3em] h-14 rounded-2xl group shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-3">Echo Yes <Sparkles size={14} className="group-hover:animate-spin" /></span>
            </Button>
          </Card>
          
          <button className="w-full min-h-[300px] lg:h-auto rounded-[4rem] border-2 border-dashed border-white/5 hover:border-rose-500/30 hover:bg-white/[0.02] transition-all duration-1000 flex flex-col items-center justify-center gap-8 text-gray-700 hover:text-rose-400 group relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl relative z-10">
              <Plus size={56} strokeWidth={1} />
            </div>
            <div className="space-y-3 text-center relative z-10 px-10">
              <span className="text-[11px] font-black uppercase tracking-[0.6em] group-hover:tracking-[0.8em] transition-all duration-700">Project a Vision</span>
              <p className="text-gray-800 italic font-medium opacity-50 group-hover:opacity-100 transition-opacity">Cast a dream onto our shared horizon</p>
            </div>
          </button>
        </div>
      </section>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/98 backdrop-blur-[40px]"
            />
            <Card className="w-full max-w-2xl p-10 sm:p-20 space-y-16 relative overflow-hidden border-white/5 bg-white/[0.01] shadow-[0_50px_150px_rgba(0,0,0,0.8)] m-auto">
              <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
                    <Zap size={14} className="animate-pulse" />
                    Manifest Destiny
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-tight">Seal a Horizon</h2>
                  <p className="text-gray-500 font-handwritten text-2xl italic opacity-80">"Mapping our shared frequency across time..."</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-5 text-gray-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-white/5"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">What's the vision?</label>
                  <input
                    placeholder="E.g. Under the stars movie night..."
                    value={newPlan.title}
                    onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                    className="input-field py-8 px-8 text-2xl font-serif tracking-tight bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-700 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Earth Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500/40 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input
                        type="date"
                        value={newPlan.plan_date}
                        onChange={(e) => setNewPlan({ ...newPlan, plan_date: e.target.value })}
                        className="input-field py-6 pl-16 text-lg bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Celestial Time</label>
                    <div className="relative group">
                      <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500/40 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="time"
                        value={newPlan.plan_time}
                        onChange={(e) => setNewPlan({ ...newPlan, plan_time: e.target.value })}
                        className="input-field py-6 pl-16 text-lg bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Vibe Frequency</label>
                  <div className="grid grid-cols-2 gap-6">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewPlan({ ...newPlan, category: cat.id })}
                        className={twMerge(
                          "p-6 rounded-[2.5rem] border-2 text-left transition-all duration-700 flex items-center gap-5 group/cat-btn shadow-xl",
                          newPlan.category === cat.id 
                            ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_15px_40px_rgba(244,63,94,0.2)]" 
                            : "bg-white/[0.02] border-white/5 text-gray-700 hover:bg-white/5 hover:border-white/10"
                        )}
                      >
                        <cat.icon size={28} strokeWidth={2} className="group-hover/cat-btn:scale-125 group-hover/cat-btn:rotate-12 transition-all duration-700" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAddPlan}
                  isLoading={isAdding}
                  disabled={!newPlan.title}
                  className="w-full gap-6 py-8 text-2xl tracking-tight shadow-[0_25px_80px_rgba(244,63,94,0.3)] relative overflow-hidden group"
                  size="xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-5">
                    <Sparkles size={28} className="group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                    Seal Transmission
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
