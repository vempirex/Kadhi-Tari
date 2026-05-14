import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Sparkles, MapPin, Zap, ArrowDown, History, Shield, Globe, Compass, Landmark, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
  Heart, MessageCircle, Star, Music, Camera, MapPin, Compass, Landmark
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-800 font-black uppercase tracking-[0.8em] animate-pulse italic">Restoring Our Shared History...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-16 px-6 sm:px-0 relative z-30">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-[2rem] text-rose-500 font-black uppercase tracking-[1em] text-[18px] mb-6 italic">
            <History size-[3.5rem] strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
            The Eternal Thread
          </div>
          <h1 className="text-7xl sm:text-[12rem] font-serif glow-text leading-[0.85] tracking-tighter italic drop-shadow-3xl">Our Journey</h1>
          <p className="text-gray-500 text-4xl sm:text-[9rem] font-handwritten italic opacity-80 max-w-6xl leading-none selection:bg-rose-500/40">
            "Every milestone, every shared laugh, every quiet step together... woven forever into the tapestries of our universe."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[5rem] px-[5rem] h-auto py-16 shadow-[0_120px_300px_rgba(244,63,94,0.7)] group relative overflow-hidden border-none"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
          <span className="relative z-10 flex items-center gap-16 text-[5rem] tracking-tighter italic">
            <Plus size-[6rem] strokeWidth={1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
            <span>Mark Milestone</span>
          </span>
        </Button>
      </header>

      <div className="relative pt-24 sm:pt-[10rem] px-6 sm:px-0">
        {/* Continuous Timeline Line - Premium Cinematic Design */}
        <div className="absolute left-24 sm:left-1/2 top-0 bottom-0 w-[16px] sm:-translate-x-1/2 overflow-hidden pointer-events-none rounded-full shadow-inner z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-950/50 via-purple-950/20 to-transparent" />
          <motion.div 
            className="absolute top-0 left-0 w-full h-[1500px] bg-gradient-to-b from-transparent via-rose-500 to-transparent shadow-[0_0_200px_rgba(244,63,94,1)] shadow-inner"
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 150, filter: 'blur(80px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            className="w-full relative z-20"
          >
            <Card className="py-72 text-center space-y-32 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] max-w-7xl mx-auto shadow-inner rounded-[9rem]">
              <div className="relative">
                <div className="p-48 bg-rose-500/[0.03] rounded-[10rem] text-rose-500/5 border-4 border-rose-500/10 shadow-inner group-hover:scale-125 transition-all duration-[10s]">
                  <Calendar size-[35rem] strokeWidth={0.01} className="drop-shadow-3xl" />
                </div>
                <div className="absolute -top-32 -right-32 p-32 rounded-[7rem] bg-[#050506] border-8 border-white/10 shadow-[0_120px_250px_rgba(0,0,0,1)]">
                  <Star size-[12rem] strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
                </div>
              </div>
              <div className="space-y-24 px-32">
                <h2 className="text-9xl sm:text-[15rem] font-serif text-white/90 tracking-tighter leading-none italic drop-shadow-3xl">The story is yet to bloom</h2>
                <p className="text-gray-800 italic max-w-[100rem] mx-auto text-[8rem] sm:text-[11rem] leading-none font-handwritten opacity-60 selection:bg-rose-500/40 drop-shadow-2xl">
                  "Every epic saga begins with a single shared breath. Let's write our first beautiful chapter onto the tapestry of time..."
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="rounded-[8rem] px-[8rem] py-24 text-[8rem] h-auto group border-none shadow-[0_150px_350px_rgba(244,63,94,0.7)]"
              >
                Capture First Milestone <Plus size-[10rem] strokeWidth={0.01} className="ml-24 group-hover:rotate-[180deg] transition-all duration-[2000ms]" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-48 sm:space-y-[45rem] relative z-20">
            {events.map((event, i) => {
              const Icon = iconMap[event.icon_name] || Heart;
              const isEven = i % 2 === 0;
              
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 200, filter: 'blur(80px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                  className={twMerge(
                    "relative flex flex-col sm:flex-row items-start sm:items-center w-full group",
                    isEven ? "sm:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node - Premium Design */}
                  <div className="absolute left-[40px] sm:left-1/2 top-0 sm:top-1/2 w-32 h-32 rounded-full bg-[#050506] z-40 sm:-translate-x-1/2 sm:-translate-y-1/2 border-[10px] border-rose-500/30 group-hover:border-rose-500 transition-all duration-[2000ms] group-hover:scale-150 shadow-[0_0_150px_rgba(244,63,94,1)] shadow-inner">
                    <div className="absolute inset-8 rounded-full bg-rose-500 shadow-[0_0_80px_rgba(244,63,94,1)]" />
                    <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-20" />
                  </div>
                  
                  {/* Date Badge - Cinematic */}
                  <div className={twMerge(
                    "absolute left-[10rem] sm:left-1/2 top-[-8rem] sm:top-auto z-30",
                    isEven ? "sm:translate-x-[15rem]" : "sm:-translate-x-[calc(100%+15rem)]"
                  )}>
                    <div className="px-48 py-20 rounded-full bg-white/[0.01] border-4 border-white/5 text-[26px] font-black text-rose-500 uppercase tracking-[1.2em] backdrop-blur-[150px] shadow-[0_150px_350px_rgba(0,0,0,1)] flex items-center gap-24 group-hover:scale-110 transition-all duration-[2000ms] italic group-hover:bg-rose-500/30 group-hover:border-rose-500/60 shadow-inner drop-shadow-3xl">
                      <Calendar size-[4rem] strokeWidth={1} className="opacity-40 drop-shadow-2xl" />
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Content Card - Sanctuary Style */}
                  <div className={twMerge(
                    "w-full sm:w-[45%] pl-[10rem] sm:pl-0 pt-[10rem] sm:pt-0",
                    isEven ? "sm:pr-[10rem] text-left sm:text-right" : "sm:pl-[10rem] text-left"
                  )}>
                    <Card 
                      className="p-24 sm:p-72 space-y-48 group/card hover:border-rose-500/60 transition-all duration-[2500ms] hover:-translate-y-48 bg-white/[0.01] hover:bg-white/[0.08] backdrop-blur-[200px] shadow-[0_300px_600px_rgba(0,0,0,1)] relative overflow-hidden shadow-inner rounded-[10rem]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.12] to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-[2500ms]" />
                      
                      <div className={twMerge(
                        "flex items-center gap-32",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}>
                        <div className={twMerge(
                          "p-24 rounded-[7rem] bg-white/[0.01] transition-all duration-[2500ms] group-hover/card:scale-125 group-hover/card:bg-rose-500/30 group-hover/card:rotate-[25deg] shadow-3xl border-4 border-white/5 relative z-10 shadow-inner overflow-hidden",
                          event.color_class
                        )}>
                           <div className="absolute inset-0 bg-current opacity-10 blur-[30px]" />
                          <Icon size-[15rem] strokeWidth={0.05} className="drop-shadow-[0_0_150px_rgba(244,63,94,1)] group-hover/card:animate-pulse fill-current relative z-10" />
                        </div>
                        <h3 className="text-8xl sm:text-[14rem] font-serif font-black text-white group-hover/card:text-rose-400 transition-all duration-[2000ms] leading-none tracking-tighter relative z-10 italic selection:bg-rose-500/40 drop-shadow-3xl">{event.title}</h3>
                      </div>

                      {event.location && (
                        <div className={twMerge(
                          "flex items-center gap-24 text-[24px] text-gray-950 font-black uppercase tracking-[1.5em] relative z-10 italic drop-shadow-2xl",
                          isEven ? "sm:flex-row-reverse" : ""
                        )}>
                          <div className="w-[8rem] h-[6px] bg-current opacity-15 shadow-inner rounded-full" />
                          <MapPin size-[5rem] strokeWidth={1} className="text-rose-500 animate-bounce drop-shadow-2xl" />
                          {event.location}
                        </div>
                      )}

                      <div className="relative z-10 pt-24">
                        <div className={twMerge(
                          "absolute top-0 w-12 h-full bg-gradient-to-b from-rose-950/80 via-rose-500/30 to-transparent rounded-full shadow-inner shadow-3xl opacity-0 group-hover/card:opacity-100 transition-all duration-2000",
                          isEven ? "-right-24" : "-left-24"
                        )} />
                        <p className="text-gray-950 leading-none text-7xl sm:text-[11rem] italic font-handwritten opacity-60 group-hover/card:opacity-100 transition-all duration-[2000ms] selection:bg-rose-500/40 drop-shadow-2xl">
                          "{event.description}"
                        </p>
                      </div>
                      
                      {/* Interactive Footer */}
                      <div className={twMerge(
                        "flex items-center gap-24 pt-48 border-t-8 border-white/5 opacity-0 group-hover/card:opacity-100 transition-all duration-[2000ms] translate-y-48 group-hover/card:translate-y-0 relative z-10",
                        isEven ? "sm:flex-row-reverse" : ""
                      )}>
                        <div className="w-[8rem] h-[8rem] rounded-[5rem] bg-rose-500/30 flex items-center justify-center text-rose-500 border-4 border-rose-500/60 shadow-inner shadow-[0_60px_150px_rgba(0,0,0,1)] relative overflow-hidden group/heart">
                            <div className="absolute inset-0 bg-rose-500/20 blur-[30px]" />
                          <Heart size-[5rem] strokeWidth={1} fill="currentColor" className="animate-pulse shadow-[0_0_60px_rgba(244,63,94,1)] relative z-10 drop-shadow-3xl" />
                        </div>
                        <span className="text-[20px] font-black uppercase tracking-[1.2em] text-gray-950 italic drop-shadow-2xl">Archived in Infinity</span>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Modal - Sanctuary Reimagined */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/99 backdrop-blur-[200px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[2010] w-full max-w-7xl m-auto"
            >
              <Card className="w-full p-20 sm:p-64 space-y-48 relative overflow-hidden border-4 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner rounded-[9rem]">
                <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.18] blur-[250px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-16">
                    <div className="flex items-center gap-[3rem] text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-12 italic">
                      <Zap size-[6rem] strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
                      Seal an Eternal Frequency
                    </div>
                    <h2 className="text-8xl sm:text-[15rem] font-serif text-white tracking-tighter leading-none italic drop-shadow-3xl">Archive a Milestone</h2>
                    <p className="text-gray-800 font-handwritten text-[10rem] sm:text-[13rem] italic opacity-80 leading-none">"Bind this shared breath to the fabric of our universe..."</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-16 text-gray-800 hover:text-white hover:bg-white/15 rounded-[6rem] transition-all duration-[1500ms] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-inner shadow-[0_80px_200px_rgba(0,0,0,1)]"
                  >
                    <X size-[12rem] strokeWidth={0.01} className="group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
                  </button>
                </div>

                <div className="space-y-64 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-48">
                    <div className="space-y-24">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic">When did it bloom?</label>
                      <div className="relative group/date">
                        <Calendar className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/20 group-focus-within/date:text-rose-500 transition-all duration-[1500ms]" size-[8rem] strokeWidth={0.05} />
                        <input
                          type="date"
                          value={newEvent.event_date}
                          onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                          className="input-field py-[5rem] pl-[12rem] text-[9rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[6rem] italic text-white selection:bg-rose-500/40 leading-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-24">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic">Where were we?</label>
                      <div className="relative group/loc">
                        <MapPin className="absolute left-24 top-1/2 -translate-y-1/2 text-blue-500/20 group-focus-within/loc:text-blue-500 transition-all duration-[1500ms]" size-[8rem] strokeWidth={0.05} />
                        <input
                          placeholder="e.g. Under the silver stars"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          className="input-field py-[5rem] pl-[12rem] text-[9rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[6rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-24">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic">The Headline</label>
                    <input
                      placeholder="e.g. Our first grand adventure"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="input-field py-32 px-32 text-8xl sm:text-[18rem] font-serif tracking-tighter italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[8rem] text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none drop-shadow-3xl"
                    />
                  </div>

                  <div className="space-y-24">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic">The Whisper (Description)</label>
                    <textarea
                      placeholder="Capture the feeling, the scent, the light... the essence of the moment."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="input-field min-h-[600px] resize-none leading-[1.6] py-32 px-32 text-[10rem] font-handwritten italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[2000ms] shadow-inner rounded-[9rem] no-scrollbar text-white placeholder:text-gray-950 selection:bg-rose-500/40 drop-shadow-2xl"
                    />
                  </div>

                  <div className="space-y-32">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic">Choose a Sacred Symbol</label>
                    <div className="flex gap-32 overflow-x-auto pb-48 no-scrollbar -mx-16 px-16">
                      {Object.keys(iconMap).map(iconName => {
                        const Icon = iconMap[iconName];
                        const isSelected = newEvent.icon_name === iconName;
                        return (
                          <button
                            key={iconName}
                            onClick={() => setNewEvent({ ...newEvent, icon_name: iconName })}
                            className={twMerge(
                              "flex-shrink-0 p-32 rounded-[7rem] transition-all duration-[1500ms] border-4 group shadow-3xl relative overflow-hidden shadow-inner",
                              isSelected 
                                ? "bg-rose-500/30 border-rose-500/80 text-rose-500 shadow-[0_120px_250px_rgba(244,63,94,1)] scale-110" 
                                : "bg-white/[0.01] border-white/10 text-gray-950 hover:bg-white/[0.1] hover:border-white/40 hover:text-gray-800"
                            )}
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1500" />
                            <Icon size-[15rem] strokeWidth={0.01} className="group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-[2000ms] relative z-10 drop-shadow-[0_0_150px_rgba(244,63,94,1)] fill-current" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddEvent}
                    isLoading={isSaving}
                    disabled={!newEvent.title}
                    className="w-full gap-48 py-[4rem] text-[10rem] tracking-tighter shadow-[0_200px_450px_rgba(244,63,94,1)] relative overflow-hidden group/submit border-none rounded-[10rem] leading-none"
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-48 italic">
                      <Heart size-[12rem] strokeWidth={0.1} className="fill-white group-hover/submit:scale-125 transition-all duration-[1500ms] animate-pulse shadow-[0_0_150px_white] drop-shadow-3xl" />
                      Seal this Milestone
                    </span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
