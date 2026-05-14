import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, Music2, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    if (!newSong.title) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('songs').insert([
      {
        ...newSong,
        cover_url: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400`,
        user_id: user?.id
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setNewSong({ title: '', artist: '', note: '' });
      fetchSongs();
    }
  };

  const currentSong = songs[0] || {
    title: 'No songs yet',
    artist: 'Add your first vibe',
    note: 'The silence is loud...',
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400'
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-serif glow-text">Shared Playlist</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-full bg-secondary text-background"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Now Playing Aesthetic Card */}
          <div className="glass-card rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full bg-[#111] border-[12px] border-[#222] shadow-2xl flex items-center justify-center relative z-10"
                >
                  <div className="w-44 h-44 rounded-full overflow-hidden opacity-80">
                    <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute w-12 h-12 bg-[#111] rounded-full border-4 border-[#222]" />
                </motion.div>
                <div className="absolute top-0 right-[-20px] w-4 h-32 bg-gray-600 rounded-full origin-top rotate-[20deg]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                <p className="text-primary font-medium">{currentSong.artist}</p>
                <p className="text-sm text-gray-400 font-handwritten italic pt-2">"{currentSong.note}"</p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-8">
              <SkipBack className="text-gray-400 cursor-pointer hover:text-white" size={28} />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl shadow-white/10"
              >
                <Play size={32} fill="currentColor" />
              </motion.button>
              <SkipForward className="text-gray-400 cursor-pointer hover:text-white" size={28} />
            </div>
          </div>

          {/* Up Next List */}
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500 px-2">Recently Added</p>
            {songs.slice(1).map((song) => (
              <motion.div 
                key={song.id}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                  <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
                <Heart size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add Song Modal */}
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
                <h2 className="text-xl font-medium">Add a Vibe</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  placeholder="Song Title"
                  value={newSong.title}
                  onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors"
                />
                <input
                  placeholder="Artist"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors"
                />
                <textarea
                  placeholder="Why did you pick this? (Optional note)"
                  value={newSong.note}
                  onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                />
                <button
                  onClick={handleAddSong}
                  className="w-full py-4 rounded-2xl bg-secondary text-background font-bold shadow-lg shadow-secondary/20"
                >
                  Add to Playlist
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

