import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Coffee, CheckCircle2, Circle, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Plan {
  id: string;
  title: string;
  plan_date: string;
  plan_time: string;
  category: string;
  is_completed: boolean;
}

export default function Planner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    if (!newPlan.title) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('plans').insert([
      {
        ...newPlan,
        user_id: user?.id
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setNewPlan({ title: '', plan_date: new Date().toISOString().split('T')[0], plan_time: '21:00', category: 'Call' });
      fetchPlans();
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
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-serif glow-text">Shared Planner</h1>
          <p className="text-gray-400 text-sm font-handwritten">Next up on our journey...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-full bg-secondary text-background shadow-lg shadow-secondary/20"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          plans.map((plan, i) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-6 flex items-center gap-6 group transition-all ${plan.is_completed ? 'opacity-50 grayscale' : ''}`}
            >
              <div 
                onClick={() => togglePlan(plan.id, plan.is_completed)}
                className="cursor-pointer text-primary hover:scale-110 transition-transform"
              >
                {plan.is_completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className={`text-lg font-bold ${plan.is_completed ? 'line-through' : ''}`}>{plan.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(plan.plan_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{plan.plan_time}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 uppercase tracking-widest font-bold text-[8px]">
                    {plan.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

        <div className="flex items-center gap-2 px-2">
          <Star size={18} className="text-secondary" />
          <h2 className="text-lg font-medium">Idea Box</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-3xl p-4 flex flex-col gap-3 aspect-video justify-center items-center text-center">
            <p className="text-sm font-handwritten">"Let's go to that temple at sunrise?"</p>
            <button className="text-[10px] uppercase font-bold text-primary">Vote Yes</button>
          </div>
          <div className="glass-card rounded-3xl p-4 flex flex-col gap-3 aspect-video justify-center items-center text-center border-dashed border-white/10 bg-transparent">
            <Plus size={20} className="text-gray-600" />
            <p className="text-xs text-gray-600 uppercase font-bold">Add Idea</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const Star = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
