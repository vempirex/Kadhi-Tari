import { motion } from 'framer-motion';
import { Laugh, Trophy, Star, MessageSquare, Plus } from 'lucide-react';

const jokes = [
  { 
    title: '2 minute call extending champion', 
    description: 'Awarded to the person who says "okay bye" and then proceeds to talk for 45 more minutes.',
    tag: 'Award',
    icon: Trophy,
    color: 'text-yellow-400'
  },
  { 
    title: 'Professional disappearing artist', 
    description: 'When you read the message and then decide to reply 3 days later in your head but not on the phone.',
    tag: 'Skill',
    icon: Star,
    color: 'text-primary'
  },
  { 
    title: 'Reel recommendation engine', 
    description: '90% of our chat is just reels. The other 10% is "did you see the reel I sent?"',
    tag: 'Hobby',
    icon: MessageSquare,
    color: 'text-blue-400'
  }
];

export default function Jokes() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-serif glow-text">Inside Jokes 😂</h1>
          <p className="text-gray-400 text-sm font-handwritten">Our shared language...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-primary text-background"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {jokes.map((joke, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:bg-white/5 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <joke.icon size={80} />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 ${joke.color}`}>
                  {joke.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold">{joke.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "{joke.description}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="pt-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 italic font-handwritten text-lg">
          <Laugh size={20} className="text-primary" />
          More nonsense coming soon...
        </div>
      </div>
    </div>
  );
}
