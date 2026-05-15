import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Heart, Camera, Music, MessageCircle, Star, Plus, X, Sparkles, MapPin, Zap, ArrowDown, History, Shield, Globe, Compass, Landmark, Fingerprint, Wind, Sun, Moon, Loader2 } from 'lucide-react';
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
    description: '', 
    event_date: new Date().toISOString().split('T')[0],
    icon_name: 'Heart',
    location: '',
    image_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('milestones').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('milestones').getPublicUrl(fileName);
      setPreviewUrl(publicUrl);
      setNewEvent(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date || isSaving) return;
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase.from('events').insert([
        {
          ...newEvent,
          color_class: 'text-rose-600',
          user_id: user.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewEvent({ title: '', description: '', event_date: new Date().toISOString().split('T')[0], icon_name: 'Heart', location: '', image_url: '' });
      setPreviewUrl(null);
      await fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to remove this milestone from our journey?")) return;
    
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  if (isLoading && events.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing history...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <History size={16} />
            The Eternal Thread
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Our Journey</h1>
          <p className="text-warm-500 font-medium text-lg max-w-2xl">
            Every shared laugh and quiet step together, woven into the tapestry of time.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="md"
          >
            <Plus size={18} className="mr-2" /> Mark Milestone
          </Button>
        </div>
      </header>

      <div className="relative px-2 pt-12 pb-32">
        {/* Timeline Line */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-warm-200 sm:-translate-x-1/2 z-0" />

        {events.length === 0 ? (
          <div className="w-full relative z-10 pt-12">
            <Card className="py-24 text-center space-y-6 border-dashed border-2 flex flex-col items-center">
              <div className="p-10 bg-warm-50 rounded-3xl text-warm-200 border border-warm-100">
                <Calendar size={64} strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-charcoal">The story is yet to bloom</h2>
                <p className="text-warm-400 font-medium max-w-sm mx-auto">
                  Every epic saga begins with a single shared breath. Let's write our first chapter.
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                variant="soft"
              >
                Capture First Milestone <Plus size={18} className="ml-2" />
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24 relative z-10">
            {events.map((event, i) => {
              const Icon = iconMap[event.icon_name] || Heart;
              const isEven = i % 2 === 0;
              
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={twMerge(
                    "relative flex flex-col sm:flex-row items-start sm:items-center w-full gap-8 sm:gap-0",
                    isEven ? "sm:flex-row-reverse" : ""
                  )}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[3px] sm:left-1/2 top-4 sm:top-1/2 w-4 h-4 rounded-full bg-white border-2 border-rose-500 z-20 sm:-translate-x-1/2 sm:-translate-y-1/2 shadow-sm" />
                  
                  {/* Date Badge */}
                  <div className={twMerge(
                    "sm:w-1/2 pl-10 sm:pl-0 sm:px-12",
                    isEven ? "sm:text-left" : "sm:text-right"
                  )}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-50 text-warm-400 border border-warm-100 text-[10px] font-bold uppercase tracking-widest italic">
                      <Calendar size={12} className="text-rose-400" />
                      {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={twMerge(
                    "w-full sm:w-1/2 pl-10 sm:pl-0 sm:px-12",
                    isEven ? "sm:pr-12" : "sm:pl-12"
                  )}>
                    <Card className="p-6 space-y-4 hover:border-rose-100 hover:shadow-premium transition-all">
                      <div className="flex items-center gap-4">
                        <div className={twMerge("w-12 h-12 rounded-xl flex items-center justify-center bg-warm-50 shadow-sm border border-warm-100", event.color_class)}>
                          <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-outfit font-bold text-charcoal tracking-tight">{event.title}</h3>
                      </div>

                      {event.image_url && (
                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-warm-100">
                          <img src={event.image_url} className="w-full h-full object-cover" alt={event.title} />
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warm-400">
                          <MapPin size={14} className="text-rose-500" />
                          {event.location}
                        </div>
                      )}

                      <p className="text-sm font-medium text-warm-500 italic leading-relaxed">
                        "{event.description}"
                      </p>
                      
                      <div className="flex justify-end pt-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 hover:text-rose-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
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
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[2010] w-full max-w-xl"
            >
              <Card className="p-8 space-y-8 bg-white shadow-premium">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                      <Zap size={16} />
                      Seal a Frequency
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-charcoal">Mark Milestone</h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">When?</label>
                      <input
                        type="date"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Where?</label>
                      <input
                        placeholder="e.g. Under the stars"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Headline</label>
                    <input
                      placeholder="e.g. Our first grand adventure"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-bold text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      placeholder="Capture the feeling, the scent, the light..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl p-4 text-sm font-medium text-charcoal min-h-[120px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Photo (Optional)</label>
                    <div 
                      className="h-32 rounded-xl border-2 border-dashed border-warm-200 flex flex-col items-center justify-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/10 transition-all relative overflow-hidden"
                      onClick={() => document.getElementById('milestone-photo-upload')?.click()}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          {isUploading ? <Loader2 className="animate-spin text-rose-500" /> : <Camera className="text-warm-300" />}
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-warm-400">Add Memory Photo</span>
                        </>
                      )}
                      <input id="milestone-photo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Choose Symbol</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {Object.keys(iconMap).map(iconName => {
                        const Icon = iconMap[iconName];
                        const isSelected = newEvent.icon_name === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setNewEvent({ ...newEvent, icon_name: iconName })}
                            className={twMerge(
                              "flex-shrink-0 p-3 rounded-xl border transition-all",
                              isSelected 
                                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                                : "bg-warm-50 border-warm-100 text-warm-400 hover:bg-warm-100 hover:border-warm-200"
                            )}
                          >
                            <Icon size={20} />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddEvent}
                    isLoading={isSaving}
                    disabled={!newEvent.title}
                    className="w-full"
                  >
                    Seal Milestone
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
