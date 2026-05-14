import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Sparkles, MapPin, Zap, ArrowDown, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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

  if (isLoading && events.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Restoring Our History...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24 pb-32">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-10 px-4 sm:px-0 relative">
        <div className="space-y-6 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-4 text-rose-400 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            <History size={12} className="animate-pulse" />
            The Eternal Thread
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif glow-text leading-tight tracking-tight">Our Journey</h1>
          <p className="text-gray-400 text-xl font-handwritten italic opacity-80 max-w-lg leading-relaxed">
            "Every milestone, every shared laugh, every quiet step together... woven forever into the tapestry of time."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[2.5rem] px-10 h-auto py-6 shadow-[0_20px_50px_rgba(244,63,94,0.25)] group relative overflow-hidden"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <span className="relative z-10 flex items-center gap-4">
            <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            <span>Mark Milestone</span>
          </span>
        </Button>
      </header>

      <div className="relative pt-12 sm:pt-20">
        {/* Continuous Timeline Line - Premium Animated Line */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] sm:-translate-x-1/2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/40 via-purple-500/20 to-transparent" />
          <motion.div 
            className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-transparent via-rose-500 to-transparent"
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative z-10"
          >
            <Card className="py-48 text-center space-y-12 border-dashed border-2 flex flex-col items-center border-white/5 bg-white/[0.01]">
              <div className="relative">
                <div className="p-16 bg-rose-500/5 rounded-[4rem] text-rose-400/20 border border-rose-500/10 shadow-inner">
                  <Calendar size={96} strokeWidth={1} />
                </div>
                <div className="absolute -top-4 -right-4 p-5 rounded-[2rem] bg-[#050506] border border-white/5 shadow-2xl">
                  <Plus size={28} className="text-rose-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-6 px-10">
                <h2 className="text-4xl font-serif text-white/90 tracking-tight">The story is yet to be told</h2>
                <p className="text-gray-500 italic max-w-md mx-auto text-xl leading-relaxed font-handwritten opacity-70">
                  "Every epic saga begins with a single shared breath. Let's write our first beautiful chapter onto the tapestry of time..."
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(true)} 
                className="rounded-[2.5rem] px-10 py-6 text-lg h-auto group"
              >
                Capture First Milestone <Sparkles size={20} className="ml-3 group-hover:scale-125 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-24 sm:space-y-40 relative z-10">
            {events.map((event, i) => {
              const Icon = iconMap[event.icon_name] || Heart;
              const isEven = i % 2 === 0;
              
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className={twMerge(
                    "relative flex flex-col sm:flex-row items-start sm:items-center w-full group",
                    isEven ? "sm:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node - Premium Design */}
                  <div className="absolute left-[24px] sm:left-1/2 top-0 sm:top-1/2 w-4 h-4 rounded-full bg-rose-500 z-30 sm:-translate-x-1/2 sm:-translate-y-1/2 shadow-[0_0_20px_rgba(244,63,94,0.8)]">
                    <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
                  </div>
                  
                  {/* Date Badge - Cinematic */}
                  <div className={twMerge(
                    "absolute left-20 sm:left-1/2 top-[-6px] sm:top-auto z-10",
                    isEven ? "sm:translate-x-16" : "sm:-translate-x-[calc(100%+4rem)]"
                  )}>
                    <div className="px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 text-[11px] font-black text-rose-400 uppercase tracking-[0.4em] backdrop-blur-3xl shadow-2xl flex items-center gap-3">
                      <Calendar size={12} className="opacity-50" />
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Content Card - Sanctuary Style */}
                  <div className={twMerge(
                    "w-full sm:w-[44%] pl-20 sm:pl-0 pt-16 sm:pt-0",
                    isEven ? "sm:pr-16 text-left sm:text-right" : "sm:pl-16 text-left"
                  )}>
                    <Card 
                      className="p-10 sm:p-14 space-y-8 group/card hover:border-rose-500/30 transition-all duration-1000 hover:-translate-y-4 bg-white/[0.01] hover:bg-white/[0.03] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
                    >
                      <div className={twMerge(
                        "flex items-center gap-8",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}>
                        <div className={twMerge(
                          "p-6 rounded-[2.5rem] bg-white/[0.02] transition-all duration-1000 group-hover/card:scale-110 group-hover/card:bg-rose-500/10 group-hover/card:rotate-12 shadow-2xl border border-white/5",
                          event.color_class
                        )}>
                          <Icon size={40} strokeWidth={2} />
                        </div>
                        <h3 className="text-3xl sm:text-5xl font-serif font-black text-white group-hover/card:text-rose-400 transition-colors leading-tight tracking-tight">{event.title}</h3>
                      </div>

                      {event.location && (
                        <div className={twMerge(
                          "flex items-center gap-4 text-[11px] text-gray-500 font-black uppercase tracking-[0.5em] opacity-50",
                          isEven ? "sm:flex-row-reverse" : ""
                        )}>
                          <div className="w-8 h-[1px] bg-current opacity-20" />
                          <MapPin size={16} className="text-rose-500" />
                          {event.location}
                        </div>
                      )}

                      <div className="relative">
                        <div className="absolute -left-4 top-0 w-1 h-full bg-rose-500/10 rounded-full" />
                        <p className="text-gray-400 leading-relaxed text-xl sm:text-2xl italic font-handwritten opacity-80 group-hover/card:opacity-100 transition-opacity pl-4">
                          "{event.description}"
                        </p>
                      </div>
                      
                      {/* Interactive Footer */}
                      <div className={twMerge(
                        "flex items-center gap-4 pt-6 border-t border-white/5 opacity-0 group-hover/card:opacity-100 transition-all duration-700 translate-y-4 group-hover/card:translate-y-0",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}>
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                          <Heart size={18} fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Milestone Locked</span>
                      </div>
                    </Card>
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
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/98 backdrop-blur-[30px]"
            />
            <Card className="w-full max-w-3xl p-10 sm:p-20 space-y-16 relative overflow-hidden border-white/5 bg-white/[0.01] shadow-[0_50px_150px_rgba(0,0,0,0.8)] m-auto">
              <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                    <Zap size={14} className="animate-pulse" />
                    Archive Milestone
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-tight">Seal a Memory</h2>
                  <p className="text-gray-500 font-handwritten text-2xl italic opacity-80">"Tether our hearts to this specific moment in eternity..."</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-5 text-gray-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-white/5"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">When did it bloom?</label>
                    <div className="relative group">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500/50 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input
                        type="date"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                        className="input-field py-6 pl-16 text-lg bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Where were we?</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500/50 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input
                        placeholder="e.g. Under the stars"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="input-field py-6 pl-16 text-lg bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">The Headline</label>
                  <input
                    placeholder="e.g. Our first grand adventure"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field py-7 px-8 text-2xl font-serif tracking-tight bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">The Whisper (Description)</label>
                  <textarea
                    placeholder="Capture the feeling, the scent, the light... everything."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="input-field min-h-[180px] resize-none leading-relaxed py-8 px-8 text-xl font-handwritten italic bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500 shadow-inner"
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em] px-1">Choose a Symbol</label>
                  <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
                    {Object.keys(iconMap).map(iconName => {
                      const Icon = iconMap[iconName];
                      const isSelected = newEvent.icon_name === iconName;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setNewEvent({ ...newEvent, icon_name: iconName })}
                          className={twMerge(
                            "flex-shrink-0 p-8 rounded-[2.5rem] transition-all duration-500 border-2 group shadow-xl",
                            isSelected 
                              ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_15px_40px_rgba(244,63,94,0.2)]" 
                              : "bg-white/[0.02] border-white/5 text-gray-700 hover:bg-white/5 hover:border-white/10 hover:text-gray-400"
                          )}
                        >
                          <Icon size={36} className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleAddEvent}
                  isLoading={isSaving}
                  disabled={!newEvent.title}
                  className="w-full gap-6 py-8 text-2xl tracking-tight shadow-[0_25px_80px_rgba(244,63,94,0.3)] relative overflow-hidden group"
                  size="xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <Heart size={28} className="fill-white group-hover:scale-125 transition-transform" />
                    Seal this Milestone
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

