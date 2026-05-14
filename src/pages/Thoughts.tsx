import { motion } from 'framer-motion';
import { Cloud, Sparkles, MessageCircle, Heart } from 'lucide-react';

export default function Thoughts() {
  const thoughts = [
    { text: "I wonder if we'll ever finish that one movie...", time: "2:00 AM", category: "Midnight" },
    { text: "That song you sent today was so beautiful.", time: "11:30 AM", category: "Music" },
    { text: "Counting days until we meet again. 🌻", time: "4:15 PM", category: "Dreaming" }
  ];

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

      <div className="grid gap-6">
        {thoughts.map((thought, index) => (
          <motion.div
            key={index}
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
                {thought.category} • {thought.time}
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
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-gray-400 font-medium flex items-center justify-center gap-2"
      >
        <Sparkles size={18} className="text-secondary" />
        Add a passing thought
      </motion.button>
    </div>
  );
}
