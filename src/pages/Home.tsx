import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock } from 'lucide-react';
import { useState } from 'react';
import Stories from '../components/Stories';

const moods = [
  { icon: Moon, label: 'Peaceful', color: 'text-blue-400' },
  { icon: Zap, label: 'Chaotic', color: 'text-yellow-400' },
  { icon: Coffee, label: 'Sleepy', color: 'text-purple-400' },
  { icon: Battery, label: 'Low Battery', color: 'text-red-400' },
  { icon: Sun, label: 'Movie Mood', color: 'text-orange-400' },
];

export default function Home() {
  const [currentMood, setCurrentMood] = useState(moods[0]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ☕";
    if (hour < 18) return "Good afternoon 🌤️";
    return "Good evening 🌙";
  };

  return (
    <div className="space-y-10">
      <Stories />

      <motion.header 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-serif glow-text leading-tight">{greeting()}</h1>
        <p className="text-gray-400 font-handwritten text-xl italic">
          Welcome back to our sanctuary... 🌻
        </p>
      </motion.header>

      {/* Today's Vibe */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Sparkles size={18} className="text-rose-400" />
          <h2 className="text-lg font-medium">Today's Vibe</h2>
        </div>
        <div className="premium-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-white/5 ${currentMood.color}`}>
              <currentMood.icon size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Currently feeling</p>
              <p className="text-xl font-semibold">{currentMood.label}</p>
            </div>
          </div>
          <button className="text-rose-400 hover:text-rose-300 transition-colors text-sm font-bold uppercase tracking-widest">
            Update
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 no-scrollbar">
          {moods.map((mood) => (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentMood(mood)}
              className={twMerge(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm premium-card",
                currentMood.label === mood.label ? "border-rose-500/50 bg-rose-500/10 text-rose-400" : "text-gray-500"
              )}
            >
              {mood.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-4">
        <QuickCard icon={Heart} label="Latest Memory" value="Random midnight talks..." color="text-rose-500" />
        <QuickCard icon={Moon} label="Next Plan" value="Pending since forever 😭" color="text-blue-400" />
      </div>

      {/* Shared Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Clock size={18} className="text-rose-400" />
          <h2 className="text-lg font-medium">Recently Shared</h2>
        </div>
        <div className="premium-card p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 animate-pulse" />
          <div className="flex-1">
            <p className="font-medium text-lg">Late Night Vibes</p>
            <p className="text-sm text-gray-400 font-handwritten italic">"study panic anthem"</p>
          </div>
          <button className="p-3 rounded-full bg-white/5 text-rose-500">
            <Heart size={20} className="fill-rose-500" />
          </button>
        </div>
      </section>
    </div>
  );
}

function QuickCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="premium-card p-4 aspect-square flex flex-col justify-between group"
    >
      <div className={twMerge("p-2 w-fit rounded-xl bg-white/5", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{label}</p>
        <p className="text-sm font-medium leading-snug">{value}</p>
      </div>
    </motion.div>
  );
}

import { twMerge } from 'tailwind-merge';
