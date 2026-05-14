import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, Music2, X, Loader2, Disc, Music, Sparkles } from 'lucide-react';
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
    title: 'No songs yet',
    artist: 'Add our anthem',
    note: 'The silence awaits our rhythm...',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400'
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Music size={12} />
            Shared Rhythm
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Our Playlist</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Songs that define our universe...</p>
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-rose-500" size={32} />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Syncing beats...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Now Playing Aesthetic Card */}
          <section className="premium-card p-10 flex flex-col items-center gap-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Vinyl Record Animation */}
            <div className="relative group/vinyl">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-56 h-56 rounded-full bg-[#0a0a0c] border-[14px] border-[#1a1a1e] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10"
              >
                <div className="absolute inset-0 rounded-full border border-white/5 opacity-50" />
                <div className="w-52 h-52 rounded-full overflow-hidden opacity-90 scale-[0.98]">
                  <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
                </div>
                {/* Center Hole */}
                <div className="absolute w-14 h-14 bg-[#0a0a0c] rounded-full border-[6px] border-[#1a1a1e] flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </div>
              </motion.div>
              
              {/* Tonearm Mockup */}
              <motion.div 
                initial={{ rotate: -20 }}
                animate={{ rotate: 5 }}
                className="absolute -top-4 -right-8 w-6 h-40 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full origin-top z-20 shadow-xl border-r border-white/5 hidden sm:block"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-6 bg-gray-600 rounded-md" />
              </motion.div>
            </div>

            <div className="text-center space-y-3 relative z-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif text-white group-hover:text-rose-400 transition-colors">{currentSong.title}</h2>
                <p className="text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">{currentSong.artist}</p>
              </div>
              <p className="text-gray-400 font-handwritten text-xl italic max-w-[280px] leading-relaxed">
                "{currentSong.note}"
              </p>
            </div>

            <div className="flex justify-center items-center gap-10 relative z-10">
              <SkipBack className="text-gray-600 cursor-pointer hover:text-white transition-colors" size={24} />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-white/10"
              >
                <Play size={36} fill="currentColor" className="ml-1" />
              </motion.button>
              <SkipForward className="text-gray-600 cursor-pointer hover:text-white transition-colors" size={24} />
            </div>
          </section>

          {/* Up Next List */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Disc size={18} className="text-rose-400" />
              <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">The Archive</h2>
            </div>
            
            <div className="space-y-3">
              {songs.length <= 1 ? (
                <div className="text-center py-10 opacity-30 italic font-handwritten text-lg">
                  Add more songs to fill our archive...
                </div>
              ) : (
                songs.slice(1).map((song, i) => (
                  <motion.div 
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="premium-card p-4 flex items-center gap-5 group cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/5 relative">
                      <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={20} fill="currentColor" className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-bold text-white group-hover:text-rose-400 transition-colors">{song.title}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{song.artist}</p>
                    </div>
                    <button className="p-3 rounded-full hover:bg-rose-500/10 text-gray-600 hover:text-rose-400 transition-all">
                      <Heart size={18} />
                    </button>
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Add our Anthem</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Share a new vibe</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Song Title</label>
                  <input
                    placeholder="E.g., Perfect, Thinking Out Loud..."
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Artist</label>
                  <input
                    placeholder="E.g., Ed Sheeran..."
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Why this song?</label>
                  <textarea
                    placeholder="Tell me the vibe..."
                    value={newSong.note}
                    onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>
                
                <button
                  onClick={handleAddSong}
                  disabled={!newSong.title || isSaving}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-5 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Sparkles size={20} />
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


