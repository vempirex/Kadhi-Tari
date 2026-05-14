import { motion } from 'framer-motion';
import { MapPin, Film, Coffee, Calendar, Plus, ChevronRight, Clock } from 'lucide-react';

const plans = [
  { title: 'Late night walk at the park', type: 'Outing', icon: MapPin, status: 'Pending since forever 😭', color: 'text-red-400' },
  { title: 'Movie Marathon: Interstellar', type: 'Movie', icon: Film, status: 'Voting in progress', color: 'text-blue-400' },
  { title: 'That new aesthetic cafe', type: 'Cafe', icon: Coffee, status: 'Planned for Saturday', color: 'text-green-400' },
];

export default function Planner() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-serif glow-text">Outing & Movie Planner 🎬</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-secondary text-background"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="space-y-4">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-5 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-white/5 ${plan.color}`}>
                <plan.icon size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{plan.type}</p>
                <h3 className="font-bold">{plan.title}</h3>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-gray-600" />
                  <p className={`text-xs italic font-medium ${plan.status.includes('😭') ? 'text-red-400/80' : 'text-gray-400'}`}>
                    {plan.status}
                  </p>
                </div>
              </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </div>

      {/* Suggestion Section */}
      <section className="pt-8 space-y-4">
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
