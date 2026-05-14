import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, X, Disc, Music, Sparkles, Volume2, Share2, Send } from 'lucide-react';
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
      const { error } = await supabase.from('songs').insert([
        {
          ...newSong,
          cover_url: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400`,
          user_id: user?.id
        }
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setNewSong({ title: '', artist: '', note: '' });
      fetchSongs();
    } catch (err) {
      console.error("Error adding song:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentSong = songs[0] || {
    title: 'Silent Symphony',
    artist: 'Sanctuary Beats',
    note: 'The archive is waiting for our rhythm...',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 px-2 sm:px-0">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
            <Music size={12} className="animate-pulse" />
            Sonic Resonances
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Our Playlist</h1>
          <p className="text-gray-400 text-lg font-handwritten italic opacity-80 max-w-md mx-auto sm:mx-0">The soundwaves of our shared universe, vibrating in harmony...</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="sm:w-fit gap-3"
          size="lg"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Anthem</span>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
            <Heart size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Syncing Frequencies...</p>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Main Player Section */}
          <section className="relative group">
            <Card variant="premium" className="p-10 sm:p-20 flex flex-col items-center gap-12 sm:gap-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.05] via-transparent to-purple-500/[0.05] opacity-50 pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-24 w-full max-w-4xl relative z-10">
                {/* Vinyl Record */}
                <div className="relative shrink-0">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#0a0a0c] border-[20px] border-[#161618] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-20 group-hover:scale-105 transition-transform duration-1000"
                  >
                    <div className="absolute inset-0 rounded-full border border-white/5 opacity-50" />
                    {/* Grooves */}
                    <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
                    <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
                    <div className="absolute inset-12 rounded-full border border-white/[0.03]" />
                    
                    <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden opacity-95 scale-[0.98] border border-black shadow-inner">
                      <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute w-16 h-16 sm:w-24 sm:h-24 bg-[#0a0a0c] rounded-full border-[12px] border-[#161618] flex items-center justify-center shadow-2xl">
                       <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                    </div>
                  </motion.div>
                  
                  {/* Outer Rings */}
                  <div className="absolute -inset-8 border border-white/[0.02] rounded-full animate-[spin_60s_linear_infinite]" />
                  <div className="absolute -inset-12 border border-white/[0.01] rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 space-y-10 text-center lg:text-left w-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      Now Resonating
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-serif text-white group-hover:text-rose-400 transition-colors leading-tight tracking-tight">{currentSong.title}</h2>
                    <p className="text-2xl sm:text-3xl font-handwritten text-gray-400 italic opacity-80">{currentSong.artist}</p>
                  </div>
                  
                  <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-white/[0.02] relative group/note overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/20" />
                    <p className="text-sm sm:text-lg text-gray-300 font-medium italic leading-relaxed font-handwritten">
                      "{currentSong.note}"
                    </p>
                  </div>

                  <div className="space-y-10">
                    <div className="flex items-center justify-center lg:justify-start gap-10 sm:gap-16">
                      <button className="p-4 text-gray-600 hover:text-white transition-all active:scale-90 hover:scale-110"><SkipBack size={36} fill="currentColor" /></button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white text-black flex items-center justify-center shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:shadow-white/20 transition-all duration-500"
                      >
                        <Play size={48} fill="currentColor" className="ml-2" />
                      </motion.button>
                      <button className="p-4 text-gray-600 hover:text-white transition-all active:scale-90 hover:scale-110"><SkipForward size={36} fill="currentColor" /></button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="w-full h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
                          animate={{ width: ['20%', '85%', '20%'] }} 
                          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                        <span>1:24</span>
                        <span>3:45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Archive List */}
          <section className="space-y-10 px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] text-rose-400 border border-white/5 shadow-xl">
                  <Disc size={24} className="animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif text-white tracking-tight">The Sonic Archive</h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Echoes of our shared history</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                <span className="flex items-center gap-2.5 text-rose-400"><Volume2 size={14} /> Frequency Synced</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                <span>{songs.length} Resonance Points</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {songs.length <= 1 ? (
                <div className="col-span-full text-center py-40 premium-card border-dashed border-2 flex flex-col items-center border-white/5 opacity-50">
                  <div className="p-10 bg-rose-500/5 rounded-[2.5rem] w-fit text-rose-400/20 border border-rose-500/10 mb-8">
                    <Music size={72} strokeWidth={1} />
                  </div>
                  <p className="font-handwritten text-2xl italic text-gray-400">The archive is silent. Seal a song that reminds you of us...</p>
                </div>
              ) : (
                songs.slice(1).map((song, i) => (
                  <Card 
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 flex items-center gap-6 group cursor-pointer active:scale-[0.98] transition-all duration-500 border-white/5 hover:border-rose-500/20"
                  >
                    <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden bg-[#0a0a0c] border border-white/5 relative shrink-0 shadow-2xl group-hover:rotate-3 transition-transform duration-700">
                      <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Play size={28} fill="currentColor" className="text-white scale-75 group-hover:scale-100 transition-transform duration-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="font-serif text-xl text-white truncate group-hover:text-rose-400 transition-colors leading-tight">{song.title}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] truncate opacity-70 group-hover:opacity-100 transition-opacity">{song.artist}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="p-3.5 rounded-2xl bg-white/[0.03] text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5 active:scale-90">
                        <Heart size={20} />
                      </button>
                      <button className="p-3.5 rounded-2xl bg-white/[0.03] text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5 active:scale-90">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* Add Song Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <Card className="w-full max-w-2xl p-8 sm:p-14 space-y-12 relative overflow-hidden border-white/5">
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-2">
                  <h2 className="text-4xl font-serif text-white tracking-tight leading-none">Seal an Anthem</h2>
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.4em]">Broadcast our rhythm to the vault</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-4 text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">Song Title</label>
                    <input
                      placeholder="e.g. Perfect, Yellow..."
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      className="input-field py-5 text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">Vocal Artist</label>
                    <input
                      placeholder="e.g. Ed Sheeran, Coldplay..."
                      value={newSong.artist}
                      onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                      className="input-field py-5 text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] px-1">The Resonance Note</label>
                  <textarea
                    placeholder="Capture the frequency of this melody in words..."
                    value={newSong.note}
                    onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                    className="input-field min-h-[180px] resize-none leading-relaxed text-lg font-medium py-8"
                  />
                </div>
                
                <Button
                  onClick={handleAddSong}
                  isLoading={isSaving}
                  disabled={!newSong.title}
                  className="w-full gap-5 py-6"
                  size="xl"
                >
                  <Send size={22} className="rotate-[-20deg]" />
                  <span>Transmit to Archive</span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


