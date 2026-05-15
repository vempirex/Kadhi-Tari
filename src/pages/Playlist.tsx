import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, X, Disc, Music, Sparkles, Volume2, Share2, Send, Zap, History, Shield, Radio, Mic2, Pause, Repeat, Shuffle, Fingerprint, Wind, Sun, Moon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  note: string;
  created_at: string;
}

export default function Playlist() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '', note: '' });

  useEffect(() => {
    fetchSongs();

    const channel = supabase
      .channel('playlist_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'songs' }, () => {
        fetchSongs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setSongs(data);
    setIsLoading(false);
  };

  const handleAddSong = async () => {
    if (!newSong.title || isSaving) return;
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { error } = await supabase.from('songs').insert([
        {
          ...newSong,
          cover_url: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600`,
          user_id: user.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewSong({ title: '', artist: '', note: '' });
      await fetchSongs();
    } catch (err) {
      console.error("Error adding song:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm("Are you sure you want to remove this anthem from our archive?")) return;
    
    try {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
      setSongs(songs.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting song:", err);
    }
  };

  const currentSong = songs[0] || {
    title: 'Silent Symphony',
    artist: 'Sanctuary Beats',
    note: 'The archive is waiting for our rhythm...',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800'
  };

  if (isLoading && songs.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing frequency...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <Radio size={16} />
            Sonic Resonances
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">Our Playlist</h1>
          <p className="text-warm-500 font-medium text-lg max-w-2xl">
            The soundwaves of our shared universe, vibrating in our unique frequency.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => setIsModalOpen(true)}
            size="md"
          >
            <Plus size={18} className="mr-2" /> Add Anthem
          </Button>
        </div>
      </header>

      <div className="space-y-12 px-2">
        {/* Main Player Card */}
        <section className="relative">
          <Card className="p-8 sm:p-12 overflow-hidden bg-white shadow-premium">
            <div className="flex flex-col lg:flex-row items-center gap-10 w-full relative z-10">
              {/* Album Art / Vinyl */}
              <div className="relative shrink-0">
                <motion.div 
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-charcoal border-[12px] border-warm-100 shadow-xl flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="w-full h-full rounded-full overflow-hidden p-1.5">
                    <img src={currentSong.cover_url} alt="Cover" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="absolute w-12 h-12 bg-white rounded-full border-4 border-charcoal flex items-center justify-center shadow-inner">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                  </div>
                </motion.div>
                
                {/* Visualizer */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white border border-warm-100 px-4 py-1.5 rounded-full shadow-soft">
                  <div className="flex gap-1 h-3 items-end">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? [4, 12, 4] : 4 }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-rose-500 rounded-full" 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal">Live</span>
                </div>
              </div>

              {/* Info & Controls */}
              <div className="flex-1 space-y-8 text-center lg:text-left w-full">
                <div className="space-y-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                    <Zap size={14} />
                    Current Resonance
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">{currentSong.title}</h2>
                  <p className="text-lg font-medium text-warm-400 italic">{currentSong.artist}</p>
                </div>
                
                <div className="bg-warm-50 rounded-2xl p-4 border border-warm-100 italic text-sm font-medium text-warm-500 leading-relaxed">
                  "{currentSong.note}"
                </div>

                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full h-1.5 bg-warm-100 rounded-full overflow-hidden relative group cursor-pointer">
                      <motion.div 
                        className="h-full bg-rose-600 rounded-full" 
                        animate={{ width: isPlaying ? '99%' : '35%' }} 
                        transition={{ duration: isPlaying ? 300 : 0.5, ease: "linear" }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-warm-300">
                      <span>02:14</span>
                      <span>05:42</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center lg:justify-start gap-8">
                    <button className="text-warm-300 hover:text-charcoal transition-all">
                       <SkipBack size={28} />
                    </button>
                    <motion.button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      whileTap={{ scale: 0.9 }}
                      className="w-16 h-16 rounded-full bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-black transition-all"
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                    </motion.button>
                    <button className="text-warm-300 hover:text-charcoal transition-all">
                      <SkipForward size={28} />
                    </button>
                    <div className="hidden sm:flex items-center gap-6 ml-8 text-warm-200">
                       <Shuffle size={20} className="hover:text-warm-400 cursor-pointer" />
                       <Repeat size={20} className="hover:text-warm-400 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* History List */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <History size={18} className="text-warm-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-warm-400">Sonic Archive</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.length <= 1 ? (
              <div className="col-span-full py-16 text-center space-y-4 bg-white rounded-3xl border border-dashed border-warm-200">
                <Music size={48} className="mx-auto text-warm-200" strokeWidth={1} />
                <p className="text-sm font-bold text-warm-400">The archive is silent.</p>
              </div>
            ) : (
              songs.slice(1).map((song, i) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-4 flex items-center gap-4 group cursor-pointer hover:border-rose-100 hover:bg-rose-50/20 transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-warm-50 shrink-0 border border-warm-100">
                      <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-charcoal truncate">{song.title}</p>
                      <p className="text-xs font-medium text-warm-400 truncate">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-2 text-warm-300 hover:text-rose-600 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Add Song Modal */}
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
                      Seal an Anthem
                    </div>
                    <h2 className="text-3xl font-outfit font-bold text-charcoal">Add to Playlist</h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Song Title</label>
                      <input
                        placeholder="e.g. Perfect, Yellow..."
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Artist</label>
                      <input
                        placeholder="e.g. Coldplay..."
                        value={newSong.artist}
                        onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm font-medium text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Why this song?</label>
                    <textarea
                      placeholder="Share why this melody resonates in your soul..."
                      value={newSong.note}
                      onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl p-4 text-sm font-medium text-charcoal min-h-[150px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none"
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddSong}
                    isLoading={isSaving}
                    disabled={!newSong.title}
                    className="w-full"
                  >
                    Seal Anthem
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
