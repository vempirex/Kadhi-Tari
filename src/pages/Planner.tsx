import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, Circle, Plus, X, Star, Sparkles, Zap, Phone, Wine, Plane, Tv, ArrowRight, History, Heart, MapPin, Compass, Landmark, Fingerprint, Shield, Wind, Sun, Moon } from 'lucide-react';
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
  { id: 'Call', label: 'Call', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-500/15' },
  { id: 'Date', label: 'Date', icon: Wine, color: 'text-rose-500', bg: 'bg-rose-500/15' },
  { id: 'Travel', label: 'Travel', icon: Plane, color: 'text-emerald-500', bg: 'bg-emerald-500/15' },
  { id: 'Watch Party', label: 'Watch Party', icon: Tv, color: 'text-purple-500', bg: 'bg-purple-500/15' },
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1em] animate-pulse italic">Calculating Shared Frequencies...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-16 px-6 sm:px-0 relative z-30">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-6 italic">
            <Calendar size={64} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
            Celestial Coordination
          </div>
          <h1 className="text-7xl sm:text-[13rem] font-serif glow-text leading-[0.85] tracking-tighter italic drop-shadow-3xl">Our Roadmap</h1>
          <p className="text-gray-500 text-4xl sm:text-[11rem] font-handwritten italic opacity-80 max-w-7xl leading-none selection:bg-rose-500/40">
            "Every minute together is a star in our shared constellation, mapping the future of us."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[6rem] px-[6rem] h-auto py-16 shadow-[0_150px_350px_rgba(244,63,94,0.7)] group relative overflow-hidden border-none leading-none shadow-inner"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
          <span className="relative z-10 flex items-center gap-16 text-[6rem] tracking-tighter italic">
            <Plus size={160} strokeWidth={1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
            <span>New Horizon</span>
          </span>
        </Button>
      </header>

      <div className="space-y-48 sm:space-y-[6rem] px-6 sm:px-0 relative z-20">
        {plans.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 150, filter: 'blur(80px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            className="w-full relative z-10"
          >
            <Card className="py-72 text-center space-y-32 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] max-w-7xl mx-auto shadow-inner rounded-[10rem]">
              <div className="relative">
                <div className="p-48 bg-rose-500/[0.03] rounded-[11rem] text-rose-500/5 border-4 border-rose-500/15 shadow-inner group-hover:scale-125 transition-all duration-[10s]">
                  <Sparkles size={560} strokeWidth={0.01} className="drop-shadow-3xl" />
                </div>
                <div className="absolute -top-32 -right-32 p-[4rem] rounded-[7rem] bg-[#050506] border-8 border-white/10 shadow-[0_150px_350px_rgba(0,0,0,1)]">
                  <Zap size={192} strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
                </div>
              </div>
              <div className="space-y-24 px-32">
                <h2 className="text-9xl sm:text-[16rem] font-serif text-white/90 tracking-tighter italic leading-none drop-shadow-3xl">No horizons yet</h2>
                <p className="text-gray-800 italic max-[100rem] mx-auto text-[9rem] sm:text-[12rem] leading-none font-handwritten opacity-60 selection:bg-rose-500/40 drop-shadow-2xl">
                  "Our future is a blank sky waiting for its stars. Let's map our next beautiful shared moment..."
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="rounded-[8rem] px-[8rem] py-24 text-[8rem] h-auto group border-none shadow-[0_150px_350px_rgba(244,63,94,0.7)] leading-none"
              >
                Manifest First Plan <Plus size={160} strokeWidth={0.01} className="ml-24 group-hover:rotate-[180deg] transition-all duration-[2000ms]" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-48 sm:gap-[6rem]">
            {plans.map((plan, i) => {
              const cat = categories.find(c => c.id === plan.category) || categories[0];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 150, filter: 'blur(100px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ delay: i * 0.1, duration: 2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card 
                    className={twMerge(
                      "p-24 sm:p-72 flex flex-col sm:flex-row items-start sm:items-center gap-32 sm:gap-[10rem] group transition-all duration-[2500ms] hover:-translate-y-48 bg-white/[0.01] hover:bg-white/[0.08] shadow-[0_300px_600px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner relative overflow-hidden rounded-[10rem]",
                      plan.is_completed ? "opacity-25 grayscale blur-[10px]" : "hover:border-rose-500/60"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.12] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2500ms]" />
                    <button 
                      onClick={() => togglePlan(plan.id, plan.is_completed)}
                      className={twMerge(
                        "w-[12rem] h-[12rem] sm:w-[25rem] sm:h-[25rem] rounded-[8rem] flex items-center justify-center transition-all duration-[2000ms] shrink-0 relative overflow-hidden group/btn shadow-[0_150px_350px_rgba(0,0,0,1)] shadow-inner",
                        plan.is_completed 
                          ? "bg-rose-950 text-white shadow-[0_100px_250px_rgba(244,63,94,1)]" 
                          : "bg-white/[0.01] text-gray-950 border-8 border-white/5 hover:border-rose-500/60 hover:text-rose-500 group-hover:scale-125 group-hover:rotate-[20deg]"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-all duration-[1500ms]" />
                      {plan.is_completed ? <CheckCircle2 size={240} strokeWidth={0.01} className="relative z-10 drop-shadow-3xl animate-pulse" /> : <Circle size={240} strokeWidth={0.01} className="relative z-10" />}
                    </button>
                    
                    <div className="flex-1 space-y-32">
                      <div className="space-y-24">
                        <div className={twMerge("flex items-center gap-24 transition-all duration-[2000ms]", plan.is_completed ? "opacity-40" : "opacity-100")}>
                          <div className={twMerge("w-[10rem] h-[6px] bg-current opacity-20 shadow-inner rounded-full", cat.color)} />
                          <span className={twMerge("text-[24px] font-black uppercase tracking-[1.5em] italic drop-shadow-2xl", cat.color)}>{plan.category}</span>
                        </div>
                        <h3 className={twMerge(
                          "text-8xl sm:text-[14rem] font-serif tracking-tighter transition-all duration-[2500ms] leading-none italic selection:bg-rose-500/40 drop-shadow-3xl",
                          plan.is_completed ? "line-through text-gray-950" : "text-white group-hover:text-rose-400"
                        )}>{plan.title}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-32 sm:gap-48 text-[24px] text-gray-950 font-black uppercase tracking-[1.2em] italic">
                        <div className="flex items-center gap-16 group/info bg-white/[0.01] px-32 py-12 rounded-full border-4 border-white/5 backdrop-blur-[150px] shadow-3xl shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover/info:opacity-100 transition-all" />
                          <Calendar size={96} strokeWidth={1} className="text-rose-500 animate-pulse drop-shadow-2xl relative z-10" />
                          <span className="group-hover/info:text-white transition-all duration-[2000ms] relative z-10 drop-shadow-2xl">
                            {new Date(plan.plan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-16 group/info bg-white/[0.01] px-32 py-12 rounded-full border-4 border-white/5 backdrop-blur-[150px] shadow-3xl shadow-inner relative overflow-hidden">
                             <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/info:opacity-100 transition-all" />
                          <Clock size={96} strokeWidth={1} className="text-blue-500 animate-pulse drop-shadow-2xl relative z-10" />
                          <span className="group-hover/info:text-white transition-all duration-[2000ms] relative z-10 drop-shadow-2xl">{plan.plan_time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block opacity-0 group-hover:opacity-100 transition-all duration-[2000ms] translate-x-[10rem] group-hover:translate-x-0 relative z-10">
                      <div className="p-32 rounded-[8rem] bg-white/[0.01] border-4 border-white/5 shadow-[0_200px_450px_rgba(0,0,0,1)] group-hover:bg-rose-500/30 group-hover:border-rose-500/60 shadow-inner transition-all duration-[2000ms]">
                        <ArrowRight size={240} strokeWidth={0.01} className="text-rose-500 group-hover:translate-x-32 transition-all duration-[2500ms] drop-shadow-3xl" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Idea Box Section - Sanctuary Style */}
      <section className="pt-[45rem] space-y-64 relative overflow-hidden px-6 sm:px-0 z-10">
        <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full shadow-inner" />
        <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-orange-500/[0.12] blur-[250px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-24 text-center sm:text-left w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start gap-16 text-orange-500 font-black uppercase tracking-[2em] text-[20px] italic">
              <Zap size={96} strokeWidth={1} className="animate-pulse fill-orange-500 drop-shadow-3xl" />
              Idea Manifestation
            </div>
            <h2 className="text-9xl sm:text-[16rem] font-serif text-white tracking-tighter leading-none italic drop-shadow-3xl">The Dream Space</h2>
            <p className="text-gray-950 font-handwritten text-[9rem] sm:text-[12rem] italic opacity-40 leading-none drop-shadow-2xl">"Whispers of what could be, waiting for a 'Yes'..."</p>
          </div>
          <Star size={320} strokeWidth={0.01} className="text-yellow-500 fill-yellow-500 animate-pulse opacity-10 hidden lg:block drop-shadow-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-48 sm:gap-[6rem] relative z-10">
          <Card className="p-24 sm:p-72 space-y-48 group cursor-pointer border-dashed border-[12px] border-rose-500/30 bg-rose-500/[0.04] hover:bg-rose-500/[0.08] hover:border-rose-500/80 transition-all duration-[2500ms] hover:-translate-y-48 relative overflow-hidden shadow-inner rounded-[10rem]">
            <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.15] blur-[250px] rounded-full pointer-events-none" />
            <div className="space-y-32 relative z-10">
              <p className="text-[10rem] sm:text-[14rem] font-handwritten text-white group-hover:text-rose-400 transition-all duration-[2000ms] leading-none italic selection:bg-rose-500/40 drop-shadow-3xl">"Sunrise meditation at the old temple? 🌅"</p>
              <div className="flex items-center gap-24">
                <div className="w-[15rem] h-[6px] bg-gray-950 shadow-inner rounded-full opacity-30" />
                <p className="text-[24px] text-gray-950 font-black uppercase tracking-[1.5em] italic opacity-40 group-hover:opacity-100 transition-all duration-[2000ms]">Resonated by You</p>
              </div>
            </div>
            <Button className="w-full sm:w-fit px-[6rem] text-[22px] tracking-[2em] h-[12rem] rounded-[8rem] group shadow-[0_150px_350px_rgba(244,63,94,1)] overflow-hidden relative border-none mt-24 leading-none">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
              <span className="relative z-10 flex items-center gap-24 italic uppercase drop-shadow-3xl">Echo Yes <Sparkles size={96} strokeWidth={1} className="group-hover:rotate-[180deg] transition-all duration-[2000ms] fill-current drop-shadow-3xl" /></span>
            </Button>
          </Card>
          
          <button className="w-full min-h-[800px] lg:h-auto rounded-[11rem] border-[12px] border-dashed border-white/5 hover:border-rose-500/80 hover:bg-white/[0.06] transition-all duration-[2500ms] flex flex-col items-center justify-center gap-[4rem] text-gray-950 hover:text-rose-400 group relative overflow-hidden shadow-inner backdrop-blur-[200px] shadow-[0_300px_600px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.15] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
            <div className="p-48 rounded-[9rem] bg-white/[0.01] border-8 border-white/10 group-hover:bg-rose-500/30 group-hover:border-rose-500/60 group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-[2500ms] shadow-[0_250px_550px_rgba(0,0,0,1)] relative z-10 shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-all" />
              <Plus size={480} strokeWidth={0.01} className="drop-shadow-3xl relative z-10" />
            </div>
            <div className="space-y-24 text-center relative z-10 px-48">
              <span className="text-[32px] font-black uppercase tracking-[2em] group-hover:tracking-[2.5em] transition-all duration-[2500ms] italic drop-shadow-3xl leading-none">Project a Vision</span>
              <p className="text-gray-950 italic font-medium opacity-20 group-hover:opacity-100 transition-all duration-[2000ms] text-[10rem] sm:text-[13rem] font-handwritten leading-none drop-shadow-2xl">Cast a dream onto our shared horizon</p>
            </div>
          </button>
        </div>
      </section>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/99 backdrop-blur-[200px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(100px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(100px)' }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[2010] w-full max-w-7xl m-auto"
            >
              <Card className="w-full p-20 sm:p-64 space-y-48 relative overflow-hidden border-4 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner rounded-[9rem]">
                <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.2] blur-[250px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-16">
                    <div className="flex items-center gap-16 text-rose-500 font-black uppercase tracking-[2em] text-[20px] mb-12 italic">
                      <Zap size={96} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
                      Manifest Destiny
                    </div>
                    <h2 className="text-8xl sm:text-[16rem] font-serif text-white tracking-tighter leading-none italic drop-shadow-3xl">Seal a Horizon</h2>
                    <p className="text-gray-800 font-handwritten text-[10rem] sm:text-[13rem] italic opacity-80 leading-none drop-shadow-2xl">"Mapping our shared frequency across time..."</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-20 text-gray-800 hover:text-white hover:bg-white/15 rounded-[6rem] transition-all duration-[1500ms] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-inner shadow-[0_100px_250px_rgba(0,0,0,1)]"
                  >
                    <X size={192} strokeWidth={0.01} className="group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
                  </button>
                </div>

                <div className="space-y-[6rem] relative z-10">
                  <div className="space-y-24">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic leading-none">What's the vision?</label>
                    <input
                      placeholder="E.g. Under the stars movie night..."
                      value={newPlan.title}
                      onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                      className="input-field py-32 px-32 text-8xl sm:text-[18rem] font-serif tracking-tighter italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[1500ms] shadow-inner rounded-[8rem] text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none drop-shadow-3xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-48">
                    <div className="space-y-24">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic leading-none">Earth Date</label>
                      <div className="relative group/date">
                        <Calendar className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/20 group-focus-within/date:text-rose-500 transition-all duration-[1500ms] drop-shadow-3xl" size={160} strokeWidth={0.05} />
                        <input
                          type="date"
                          value={newPlan.plan_date}
                          onChange={(e) => setNewPlan({ ...newPlan, plan_date: e.target.value })}
                          className="input-field py-[5rem] pl-[15rem] text-[10rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[1500ms] shadow-inner rounded-[7rem] text-white italic selection:bg-rose-500/40 shadow-3xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-24">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic leading-none">Celestial Time</label>
                      <div className="relative group/time">
                        <Clock className="absolute left-24 top-1/2 -translate-y-1/2 text-blue-500/20 group-focus-within/time:text-blue-500 transition-all duration-[1500ms] drop-shadow-3xl" size={160} strokeWidth={0.05} />
                        <input
                          type="time"
                          value={newPlan.plan_time}
                          onChange={(e) => setNewPlan({ ...newPlan, plan_time: e.target.value })}
                          className="input-field py-[5rem] pl-[15rem] text-[10rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[1500ms] shadow-inner rounded-[7rem] text-white italic selection:bg-rose-500/40 shadow-3xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-32">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic leading-none">Vibe Frequency</label>
                    <div className="grid grid-cols-2 gap-24 sm:gap-48">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setNewPlan({ ...newPlan, category: cat.id })}
                          className={twMerge(
                            "p-32 rounded-[8rem] border-4 text-left transition-all duration-[2000ms] flex items-center gap-32 group/cat-btn shadow-3xl relative overflow-hidden shadow-inner",
                            newPlan.category === cat.id 
                              ? "bg-rose-500/30 border-rose-500 text-rose-500 shadow-[0_150px_350px_rgba(244,63,94,1)] scale-110" 
                              : "bg-white/[0.01] border-white/10 text-gray-950 hover:bg-white/[0.1] hover:border-white/50 hover:text-gray-800"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/cat-btn:opacity-100 transition-all duration-1500" />
                          <cat.icon size={160} strokeWidth={0.01} className="group-hover/cat-btn:scale-150 group-hover/cat-btn:rotate-[30deg] transition-all duration-[2000ms] relative z-10 shadow-3xl drop-shadow-2xl fill-current" />
                          <span className="text-[28px] font-black uppercase tracking-[1.5em] relative z-10 italic leading-none">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddPlan}
                    isLoading={isAdding}
                    disabled={!newPlan.title}
                    className="w-full gap-[4rem] py-[4rem] text-[10rem] tracking-tighter shadow-[0_200px_450px_rgba(244,63,94,1)] relative overflow-hidden group/submit border-none rounded-[10rem] leading-none"
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-48 italic">
                      <Sparkles size={192} strokeWidth={0.01} className="group-hover/submit:scale-150 group-hover/submit:rotate-[180deg] transition-all duration-[2500ms] animate-pulse fill-current drop-shadow-3xl shadow-[0_0_150px_white]" />
                      Seal Transmission
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
