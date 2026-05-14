import { motion } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, Music2 } from 'lucide-react';

const mockSongs = [
  { title: 'Late Night Highway', artist: 'Lofi Girl', note: 'late night highway vibe', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop' },
  { title: 'Rainy Day Jazz', artist: 'Jazz Master', note: 'rain + chai energy', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' },
  { title: 'Midnight City', artist: 'M83', note: 'driving through the city lights', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop' },
];

export default function Playlist() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-serif glow-text">Shared Playlist</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-secondary text-background"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      {/* Now Playing Aesthetic Card */}
      <div className="glass-card rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Spinning Vinyl */}
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 rounded-full bg-[#111] border-[12px] border-[#222] shadow-2xl flex items-center justify-center relative z-10"
            >
              <div className="w-44 h-44 rounded-full overflow-hidden opacity-80">
                <img src={mockSongs[0].cover} alt="Vinyl Cover" className="w-full h-full object-cover" />
              </div>
              <div className="absolute w-12 h-12 bg-[#111] rounded-full border-4 border-[#222]" />
            </motion.div>
            {/* Tone Arm Placeholder */}
            <div className="absolute top-0 right-[-20px] w-4 h-32 bg-gray-600 rounded-full origin-top rotate-[20deg]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{mockSongs[0].title}</h2>
            <p className="text-primary font-medium">{mockSongs[0].artist}</p>
            <p className="text-sm text-gray-400 font-handwritten italic pt-2">"{mockSongs[0].note}"</p>
          </div>
        </div>

        {/* Controls */}
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
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 px-2">Up Next</p>
        {mockSongs.slice(1).map((song, i) => (
          <motion.div 
            key={i}
            className="glass-card rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
              <img src={song.cover} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{song.title}</p>
              <p className="text-xs text-gray-400">{song.artist}</p>
            </div>
            <p className="text-xs font-handwritten text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              "{song.note}"
            </p>
            <Heart size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
