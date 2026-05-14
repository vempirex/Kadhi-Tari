import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Coffee, Zap, Battery, Heart, Clock } from 'lucide-react';
import { useState } from 'react';

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
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-serif glow-text">{greeting()}</h1>
        <p className="text-gray-400 font-handwritten text-xl italic">
          Welcome back to our Kadhi Tari universe... 🌻
        </p>
      </motion.div>

      {/* Today's Vibe Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Sparkles size={18} className="text-secondary glow-yellow" />
          <h2 className="text-lg font-medium">Today's Vibe</h2>
        </div>
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-white/5 ${currentMood.color}`}>
              <currentMood.icon size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Currently feeling</p>
              <p className="text-xl font-semibold">{currentMood.label}</p>
            </div>
          </div>
          <button className="text-primary hover:text-primary-light transition-colors text-sm font-medium">
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
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm glass-card ${
                currentMood.label === mood.label ? 'border-primary/50 bg-primary/10' : ''
              }`}
            >
              {mood.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card rounded-3xl p-4 aspect-square flex flex-col justify-between group"
        >
          <div className="p-2 w-fit rounded-xl bg-primary/20 text-primary">
            <Heart size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Latest Memory</p>
            <p className="font-medium">Random midnight talks...</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card rounded-3xl p-4 aspect-square flex flex-col justify-between group"
        >
          <div className="p-2 w-fit rounded-xl bg-secondary/20 text-secondary">
            <Moon size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Next Plan</p>
            <p className="font-medium italic">Pending since forever 😭</p>
          </div>
        </motion.div>
      </div>

      {/* Latest Song Preview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Clock size={18} className="text-primary" />
          <h2 className="text-lg font-medium">Recently Shared</h2>
        </div>
        <div className="glass-card rounded-3xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-spin-slow" />
          <div className="flex-1">
            <p className="font-medium text-lg">Late Night Vibes</p>
            <p className="text-sm text-gray-400 font-handwritten">"study panic anthem"</p>
          </div>
          <button className="p-3 rounded-full bg-white/5">
            <Heart size={20} className="text-primary" />
          </button>
        </div>
      </section>
    </div>
  );
}
