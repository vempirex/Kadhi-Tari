import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Loader2, Sparkles, MapPin, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Event {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
  event_date: string;
  location?: string;
  image_url?: string;
}

const iconMap: Record<string, any> = {
  Heart, MessageCircle, Star, Music, Camera, MapPin
};

export default function MemoryTimeline() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    event_date: new Date().toISOString().split('T')[0],
    icon_name: 'Heart',
    location: ''
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
    if (!newEvent.title || !newEvent.event_date || isSaving) return;
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('events').insert([
        {
          ...newEvent,
          color_class: 'text-rose-400',
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewEvent({ title: '', description: '', event_date: new Date().toISOString().split('T')[0], icon_name: 'Heart', location: '' });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Sparkles size={12} />
            Our Journey
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Memory Timeline</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Every little step we took together...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <Plus size={28} />
        </motion.button>
      </header>

      <div className="relative space-y-16 pt-4">
        {/* Continuous Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/50 via-orange-500/50 to-transparent" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={32} />
            <p className="text-sm text-gray-500 font-medium">Rewinding the tapes...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-4">
            <div className="p-4 bg-rose-500/10 rounded-full w-fit mx-auto text-rose-400">
              <Calendar size={32} />
            </div>
            <p className="text-gray-400 italic">No milestones yet. Let's create some!</p>
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
                className="relative pl-14"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[18px] top-0 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] z-10" />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        <MapPin size={10} />
                        {event.location}
                      </span>
                    )}
                  </div>

                  <div className="premium-card p-6 space-y-4 group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className={twMerge("p-2 rounded-lg bg-white/5", event.color_class)}>
                            <Icon size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">{event.title}</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm italic font-handwritten">
                          "{event.description}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Milestone Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Add Milestone</h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Save a new memory</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">When did it happen?</label>
                  <input
                    type="date"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Title</label>
                  <input
                    placeholder="e.g., Our first long call"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Location (Optional)</label>
                  <input
                    placeholder="e.g., Somewhere under the moon"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Description</label>
                  <textarea
                    placeholder="Describe the vibe..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="input-field min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Icon</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {Object.keys(iconMap).map(iconName => {
                      const Icon = iconMap[iconName];
                      const isSelected = newEvent.icon_name === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setNewEvent({ ...newEvent, icon_name: iconName })}
                          className={twMerge(
                            "p-3 rounded-xl transition-all",
                            isSelected ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 text-gray-500"
                          )}
                        >
                          <Icon size={20} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || isSaving}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Heart size={20} />
                      Save Milestone
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

