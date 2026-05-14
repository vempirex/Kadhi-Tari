import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, X, Loader2, Disc, Music, Sparkles, Volume2, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

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
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 px-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Music size={12} className="animate-pulse" />
            Shared Rhythm
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">Our Playlist</h1>
          <p className="text-gray-400 text-sm sm:text-base font-handwritten italic opacity-80">The soundtrack to our little universe...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-3 px-8 shadow-rose-500/30"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Anthem</span>
        </motion.button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 relative z-10">
          <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Syncing the frequencies...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Main Player Card */}
          <section className="premium-card p-8 sm:p-16 flex flex-col items-center gap-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20 w-full max-w-3xl">
              {/* Vinyl Record */}
              <div className="relative group/vinyl flex-shrink-0">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#050506] border-[16px] border-[#121214] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex items-center justify-center relative z-10"
                >
                  <div className="absolute inset-0 rounded-full border border-white/5 opacity-50" />
                  <div className="w-52 h-52 sm:w-68 sm:h-68 rounded-full overflow-hidden opacity-95 scale-[0.98] border border-black">
                    <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-[#050506] rounded-full border-[8px] border-[#121214] flex items-center justify-center shadow-inner">
                     <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  </div>
                </motion.div>
                
                {/* Visual Feedback Line */}
                <div className="absolute -inset-4 border-2 border-dashed border-rose-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
              </div>

              {/* Info & Controls */}
              <div className="flex-1 space-y-8 text-center lg:text-left relative z-10 w-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.3em] text-[10px]">
                    <Sparkles size={12} />
                    Now Resonating
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-serif text-white group-hover:text-rose-400 transition-colors leading-tight">{currentSong.title}</h2>
                  <p className="text-xl sm:text-2xl font-handwritten text-gray-400 italic opacity-80">{currentSong.artist}</p>
                </div>
                
                <div className="premium-card bg-white/[0.03] p-6 rounded-3xl border-white/5">
                  <p className="text-sm sm:text-base text-gray-300 font-medium italic leading-relaxed">
                    "{currentSong.note}"
                  </p>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12">
                  <button className="p-3 text-gray-500 hover:text-white transition-all active:scale-90"><SkipBack size={28} fill="currentColor" /></button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-black flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:shadow-white/30 transition-all"
                  >
                    <Play size={40} fill="currentColor" className="ml-2" />
                  </motion.button>
                  <button className="p-3 text-gray-500 hover:text-white transition-all active:scale-90"><SkipForward size={28} fill="currentColor" /></button>
                </div>

                {/* Progress Bar Mock */}
                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500" 
                      animate={{ width: ['20%', '85%', '20%'] }} 
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <span>1:24</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Archive List */}
          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/[0.03] text-rose-400 border border-white/5">
                  <Disc size={20} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white/90">The Sonic Archive</h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Volume2 size={12} /> Sync On</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span>{songs.length} Tracks</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {songs.length <= 1 ? (
                <div className="col-span-full text-center py-20 premium-card border-dashed border-2 opacity-50 space-y-4">
                  <Music size={40} strokeWidth={1} className="mx-auto" />
                  <p className="font-handwritten text-xl italic">The archives are empty. Add a song that reminds you of us...</p>
                </div>
              ) : (
                songs.slice(1).map((song, i) => (
                  <motion.div 
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="premium-card p-4 flex items-center gap-5 group cursor-pointer active:scale-[0.98] transition-all border-white/5 hover:border-rose-500/20"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#050506] border border-white/5 relative flex-shrink-0">
                      <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Play size={24} fill="currentColor" className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-bold text-lg text-white truncate group-hover:text-rose-400 transition-colors">{song.title}</p>
                      <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest truncate">{song.artist}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="p-3 rounded-2xl bg-white/[0.03] text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-white/5">
                        <Heart size={18} />
                      </button>
                      <button className="p-3 rounded-2xl bg-white/[0.03] text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </motion.div>
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
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-lg p-8 sm:p-12 space-y-10 overflow-hidden shadow-[0_0_100px_rgba(244,63,94,0.1)] border-white/10"
            >
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif text-rose-400">Add an Anthem</h2>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Share our rhythm with the sanctuary</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Song Title</label>
                    <input
                      placeholder="e.g. Perfect, Yellow..."
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Artist</label>
                    <input
                      placeholder="e.g. Ed Sheeran, Coldplay..."
                      value={newSong.artist}
                      onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Why this song?</label>
                  <textarea
                    placeholder="Capture the vibe of this melody..."
                    value={newSong.note}
                    onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                    className="input-field min-h-[140px] resize-none leading-relaxed"
                  />
                </div>
                
                <button
                  onClick={handleAddSong}
                  disabled={!newSong.title || isSaving}
                  className="btn-primary w-full mt-6 py-5 flex items-center justify-center gap-4 text-base tracking-wide disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <Sparkles size={22} className="text-white" />
                      <span>Seal this Vibe</span>
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


