import { motion } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star } from 'lucide-react';

const events = [
  { 
    date: 'March 14, 2026', 
    title: 'First long call', 
    description: '3 hours passed like 3 minutes. Discussed everything from favorite lo-fi beats to why pineapples belong on pizza 😭',
    icon: Heart,
    color: 'text-primary'
  },
  { 
    date: 'February 28, 2026', 
    title: 'Random midnight talks', 
    description: 'That deep conversation about life and the universe. Felt very cinematic.',
    icon: MessageCircle,
    color: 'text-blue-400'
  },
  { 
    date: 'February 14, 2026', 
    title: 'The disappearing act 😭', 
    description: 'When you vanished for 5 hours and I thought you were kidnapped by aliens.',
    icon: Star,
    color: 'text-yellow-400'
  },
  { 
    date: 'January 10, 2026', 
    title: 'First shared song', 
    description: '"Late Night Highway" - our anthem since then.',
    icon: Music,
    color: 'text-secondary'
  }
];

export default function MemoryTimeline() {
  return (
    <div className="space-y-8">
      <header className="px-2">
        <h1 className="text-2xl font-serif glow-text">Memory Timeline🌻</h1>
        <p className="text-gray-400 text-sm font-handwritten">A small digital universe of us...</p>
      </header>

      <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-secondary/50 before:to-transparent">
        {events.map((event, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[35px] top-1 p-2 rounded-full bg-background border-2 border-current shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 ${event.color}`}>
              <event.icon size={12} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-gray-500" />
                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">{event.date}</p>
              </div>
              <div className="glass-card rounded-2xl p-6 space-y-3 hover:border-primary/20 transition-colors">
                <h3 className="text-lg font-bold glow-text">{event.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed italic">"{event.description}"</p>
                
                {i === 0 && (
                  <div className="pt-2 flex gap-2">
                    <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=200" alt="Memory" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-gray-800 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=200" alt="Memory" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
