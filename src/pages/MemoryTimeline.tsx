import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Loader2, Sparkles, MapPin } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto space-y-16 pb-20">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Sparkles size={12} className="animate-pulse" />
            The Eternal Thread
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">Our Journey</h1>
          <p className="text-gray-400 text-sm sm:text-base font-handwritten italic opacity-80">Every milestone, every laugh, every step together...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-3 px-8 shadow-rose-500/30"
        >
          <Plus size={20} strokeWidth={3} />
          <span>New Milestone</span>
        </motion.button>
      </header>

      <div className="relative pt-12">
        {/* Continuous Timeline Line */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rose-500/40 via-purple-500/40 to-transparent sm:-translate-x-1/2" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Restoring our history...</p>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 premium-card space-y-6 mx-2 relative z-10 border-dashed border-2"
          >
            <div className="p-8 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/30">
              <Calendar size={64} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-white/90">The story is yet to be told</h2>
              <p className="text-gray-500 italic max-w-xs mx-auto text-sm">Every epic saga begins with a first chapter. Let's write ours.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-24 relative z-10">
            {events.map((event, i) => {
              const Icon = iconMap[event.icon_name] || Heart;
              const isEven = i % 2 === 0;
              
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={twMerge(
                    "relative flex flex-col sm:flex-row items-start sm:items-center w-full",
                    isEven ? "sm:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[19px] sm:left-1/2 top-0 sm:top-1/2 w-4 h-4 rounded-full bg-[#050506] border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 sm:-translate-x-1/2 sm:-translate-y-1/2" />
                  
                  {/* Date Badge */}
                  <div className={twMerge(
                    "absolute left-14 sm:left-1/2 top-[-2px] sm:top-auto z-10",
                    isEven ? "sm:translate-x-8" : "sm:-translate-x-[calc(100%+2rem)]"
                  )}>
                    <span className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] backdrop-blur-md shadow-xl">
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className={twMerge(
                    "w-full sm:w-[45%] pl-14 sm:pl-0 pt-10 sm:pt-0",
                    isEven ? "sm:pr-12 text-left sm:text-right" : "sm:pl-12 text-left"
                  )}>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="premium-card p-6 sm:p-8 space-y-5 group border-white/5 hover:border-rose-500/20"
                    >
                      <div className={twMerge(
                        "flex items-center gap-4",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}>
                        <div className={twMerge(
                          "p-4 rounded-2xl bg-white/[0.03] transition-all group-hover:scale-110 group-hover:bg-rose-500/10",
                          event.color_class
                        )}>
                          <Icon size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-rose-400 transition-colors">{event.title}</h3>
                      </div>

                      {event.location && (
                        <div className={twMerge(
                          "flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]",
                          isEven ? "sm:flex-row-reverse" : ""
                        )}>
                          <MapPin size={12} className="text-rose-400" />
                          {event.location}
                        </div>
                      )}

                      <p className="text-gray-400 leading-relaxed text-sm sm:text-base italic font-handwritten opacity-90">
                        "{event.description}"
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-lg p-8 sm:p-10 space-y-10 shadow-[0_0_100px_rgba(244,63,94,0.15)] border-white/10"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif text-rose-400 leading-none">Seal a Memory</h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Add to our eternal thread</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">When?</label>
                    <input
                      type="date"
                      value={newEvent.event_date}
                      onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Where?</label>
                    <input
                      placeholder="e.g. Under the stars"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">The Headline</label>
                  <input
                    placeholder="e.g. Our first adventure"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">The Whisper (Description)</label>
                  <textarea
                    placeholder="Capture the feeling in words..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="input-field min-h-[140px] resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Choose a Symbol</label>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-1 px-1">
                    {Object.keys(iconMap).map(iconName => {
                      const Icon = iconMap[iconName];
                      const isSelected = newEvent.icon_name === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setNewEvent({ ...newEvent, icon_name: iconName })}
                          className={twMerge(
                            "flex-shrink-0 p-5 rounded-[1.5rem] transition-all border-2",
                            isSelected 
                              ? "bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/20" 
                              : "bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/10"
                          )}
                        >
                          <Icon size={24} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title || isSaving}
                  className="btn-primary w-full mt-6 py-5 flex items-center justify-center gap-4 text-base tracking-wide disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <Heart size={22} className="fill-white" />
                      <span>Seal this Milestone</span>
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

