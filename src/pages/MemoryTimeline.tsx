import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
  event_date: string;
}

const iconMap: Record<string, any> = {
  Heart, MessageCircle, Star, Music, Camera
};

export default function MemoryTimeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    event_date: new Date().toISOString().split('T')[0],
    icon_name: 'Heart'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    
    if (!error && data) setEvents(data);
    setIsLoading(false);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('events').insert([
      {
        ...newEvent,
        color_class: 'text-primary',
        user_id: user?.id
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setNewEvent({ title: '', description: '', event_date: new Date().toISOString().split('T')[0], icon_name: 'Heart' });
      fetchEvents();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-2xl font-serif glow-text">Memory Timeline🌻</h1>
          <p className="text-gray-400 text-sm font-handwritten">A small digital universe of us...</p>
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

      <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-secondary/50 before:to-transparent">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          events.map((event, i) => {
            const Icon = iconMap[event.icon_name] || Heart;
            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className={`absolute -left-[35px] top-1 p-2 rounded-full bg-background border-2 border-current shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 ${event.color_class}`}>
                  <Icon size={12} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gray-500" />
                    <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="glass-card rounded-2xl p-6 space-y-3 hover:border-primary/20 transition-colors">
                    <h3 className="text-lg font-bold glow-text">{event.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed italic">"{event.description}"</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card rounded-[3rem] w-full max-w-md p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Add a Milestone</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors text-white"
                />
                <input
                  placeholder="What happened?"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors"
                />
                <textarea
                  placeholder="Describe the moment..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                />
                <button
                  onClick={handleAddEvent}
                  className="w-full py-4 rounded-2xl bg-secondary text-background font-bold shadow-lg shadow-secondary/20"
                >
                  Save to Timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

