import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, SkipBack, Heart, Plus, X, Disc, Music, Sparkles, Volume2, Share2, Send, Zap, History, Shield, Radio, Mic2, Pause, Repeat, Shuffle, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
      const { error } = await supabase.from('songs').insert([
        {
          ...newSong,
          cover_url: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600`,
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
    cover_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-16 px-6 sm:px-0 relative z-30">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-8 text-rose-500 font-black uppercase tracking-[1em] text-[16px] mb-6 italic">
            <Radio size={56} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
            Sonic Resonances
          </div>
          <h1 className="text-7xl sm:text-[11rem] font-serif glow-text leading-[0.85] tracking-tighter italic">Our Playlist</h1>
          <p className="text-gray-500 text-4xl sm:text-[8rem] font-handwritten italic opacity-80 max-w-5xl leading-tight selection:bg-rose-500/40">
            "The soundwaves of our shared universe, vibrating in a frequency only we can understand."
          </p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-[5rem] px-[5rem] h-auto py-16 shadow-[0_120px_300px_rgba(244,63,94,0.7)] group relative overflow-hidden border-none"
          size="xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
          <span className="relative z-10 flex items-center gap-16 text-[5rem] tracking-tighter italic">
            <Plus size={96} strokeWidth={1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms] drop-shadow-3xl" />
            <span>Add Anthem</span>
          </span>
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-[25rem] gap-24">
          <div className="relative">
            <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
            <Zap size={128} strokeWidth={1} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse drop-shadow-3xl" />
          </div>
          <p className="text-[18px] text-gray-800 font-black uppercase tracking-[1.2em] animate-pulse italic">Syncing Sonic Frequencies...</p>
        </div>
      ) : (
        <div className="space-y-48 sm:space-y-[15rem] relative z-20">
          {/* Main Player Section - Cinematic Masterpiece */}
          <section className="relative group px-6 sm:px-0">
            <Card className="p-20 sm:p-64 flex flex-col items-center gap-32 sm:gap-[12rem] overflow-hidden border-4 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] backdrop-blur-[150px] shadow-inner rounded-[9rem] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.08] via-transparent to-purple-500/[0.08] opacity-60 pointer-events-none" />
              <div className="absolute top-[-40%] right-[-40%] w-[150%] h-[150%] bg-rose-500/[0.12] blur-[250px] rounded-full pointer-events-none group-hover:bg-rose-500/15 transition-all duration-[10000ms] animate-pulse" />
              
              <div className="flex flex-col lg:flex-row items-center gap-32 sm:gap-[20rem] w-full max-w-[1920px] relative z-10">
                {/* Vinyl Record - Premium High-Fidelity */}
                <div className="relative shrink-0 perspective-[3000px] group/vinyl scale-[0.5] sm:scale-100">
                  <motion.div 
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="w-[700px] h-[700px] sm:w-[1000px] sm:h-[1000px] rounded-full bg-[#050506] border-[100px] border-[#0a0a0c] shadow-[0_250px_600px_rgba(0,0,0,1)] flex items-center justify-center relative z-20 group-hover:scale-105 transition-all duration-[8000ms] group-hover:shadow-rose-500/50 shadow-inner"
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-white/10 opacity-60" />
                    {/* Vinyl Grooves - High Detail */}
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute rounded-full border border-white/[0.08] shadow-inner" 
                        style={{ inset: `${(i + 1) * 1.2}%` }} 
                      />
                    ))}
                    
                    <div className="w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full overflow-hidden opacity-98 scale-[0.99] border-[16px] border-black shadow-[0_0_150px_rgba(0,0,0,1)] relative group/cover">
                      <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover grayscale-[0.7] group-hover/cover:grayscale-0 transition-all duration-[15000ms] group-hover/cover:scale-150 brightness-[0.7] group-hover/cover:brightness-[1]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
                    </div>
                    
                    <div className="absolute w-[20rem] h-[20rem] sm:w-[30rem] sm:h-[30rem] bg-[#050506] rounded-full border-[60px] border-[#0a0a0c] flex items-center justify-center shadow-[0_0_200px_rgba(0,0,0,1)] overflow-hidden">
                       <div className="w-[8rem] h-[8rem] bg-rose-500 rounded-full animate-pulse shadow-[0_0_150px_rgba(244,63,94,1)] relative z-10" />
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-60" />
                    </div>
                  </motion.div>
                  
                  {/* Atmospheric Glows & Rings */}
                  <div className="absolute -inset-[10rem] border-8 border-white/[0.05] rounded-full animate-[spin_250s_linear_infinite] opacity-40 shadow-3xl" />
                  <div className="absolute -inset-[40rem] border-4 border-white/[0.02] rounded-full animate-[spin_220s_linear_infinite_reverse] opacity-20" />
                  
                  {/* Playback Indicator */}
                  <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 flex items-center gap-16 bg-rose-900 px-32 py-12 rounded-full shadow-[0_120px_250px_rgba(244,63,94,1)] z-30 shadow-inner">
                    <div className="flex gap-4 h-16 items-end">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: isPlaying ? [15, 60, 15] : 15 }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-4 bg-white rounded-full shadow-[0_0_40px_white]" 
                        />
                      ))}
                    </div>
                    <span className="text-[24px] font-black uppercase tracking-[1em] text-white italic drop-shadow-2xl">Resonating</span>
                  </div>
                </div>

                {/* Info & Controls - Sanctuary Aesthetics */}
                <div className="flex-1 space-y-48 text-center lg:text-left w-full relative">
                  <div className="space-y-24">
                    <div className="flex items-center justify-center lg:justify-start gap-12 text-rose-500 font-black uppercase tracking-[1.5em] text-[22px] mb-12 italic">
                      <Zap size={96} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
                      Primary Signal Active
                    </div>
                    <h2 className="text-8xl sm:text-[18rem] font-serif text-white group-hover:text-rose-400 transition-all duration-[4000ms] leading-[0.85] tracking-tighter italic selection:bg-rose-500/40 drop-shadow-3xl">{currentSong.title}</h2>
                    <div className="flex items-center justify-center lg:justify-start gap-24 opacity-30">
                      <Mic2 size={192} strokeWidth={0.05} className="text-gray-950" />
                      <p className="text-7xl sm:text-[12rem] font-handwritten text-gray-950 italic tracking-tighter selection:bg-rose-500/40 leading-none">{currentSong.artist}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.01] backdrop-blur-[150px] rounded-[9rem] p-48 border-4 border-white/5 relative group/note overflow-hidden shadow-inner max-w-7xl mx-auto lg:mx-0 shadow-3xl group">
                    <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-b from-rose-950 to-purple-950 opacity-90 shadow-2xl" />
                    <p className="text-[8rem] sm:text-[10rem] text-gray-800 font-medium italic leading-none font-handwritten opacity-70 group-hover:opacity-100 transition-all duration-[2000ms] selection:bg-rose-500/40 drop-shadow-2xl">
                      "{currentSong.note}"
                    </p>
                  </div>

                  <div className="space-y-64 max-w-7xl mx-auto lg:mx-0">
                    <div className="flex items-center justify-center lg:justify-start gap-32 sm:gap-[20rem]">
                      <button className="p-20 text-gray-950 hover:text-white transition-all duration-[1500ms] active:scale-[2.5] hover:scale-150 hover:rotate-[-45deg] shadow-3xl rounded-full group">
                         <SkipBack size={288} strokeWidth={0.01} fill="currentColor" className="drop-shadow-3xl group-hover:text-rose-500 transition-all" />
                      </button>
                      <motion.button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        whileHover={{ scale: 1.15, y: -40, rotate: isPlaying ? 0 : 12 }}
                        whileTap={{ scale: 0.8 }}
                        className="w-[20rem] h-[20rem] sm:w-[28rem] sm:h-[28rem] rounded-[10rem] bg-white text-black flex items-center justify-center shadow-[0_200px_500px_rgba(255,255,255,0.5)] hover:shadow-white/80 transition-all duration-[2000ms] relative overflow-hidden group/play border-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.3] to-transparent opacity-0 group-hover/play:opacity-100 transition-all duration-[2000ms]" />
                        {isPlaying ? (
                          <Pause size={240} strokeWidth={1} fill="currentColor" className="relative z-10 transition-all duration-[2000ms] drop-shadow-3xl" />
                        ) : (
                          <Play size={240} strokeWidth={1} fill="currentColor" className="ml-24 relative z-10 transition-all duration-[2000ms] group-hover/play:scale-125 group-hover/play:rotate-[20deg] drop-shadow-3xl" />
                        )}
                      </motion.button>
                      <button className="p-20 text-gray-950 hover:text-white transition-all duration-[1500ms] active:scale-[2.5] hover:scale-150 hover:rotate-[45deg] shadow-3xl rounded-full group">
                        <SkipForward size={288} strokeWidth={0.01} fill="currentColor" className="drop-shadow-3xl group-hover:text-rose-500 transition-all" />
                      </button>
                    </div>

                    {/* Progress Bar - Cinematic High-Fidelity */}
                    <div className="space-y-24">
                      <div className="w-full h-12 bg-white/[0.01] rounded-full overflow-hidden border-4 border-white/5 relative group/progress cursor-pointer shadow-inner shadow-3xl">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-rose-950 via-purple-900 to-rose-950 shadow-[0_0_150px_rgba(244,63,94,1)] relative z-10 shadow-2xl" 
                          animate={{ width: isPlaying ? ['10%', '99%', '10%'] : '45%' }} 
                          transition={{ duration: isPlaying ? 300 : 1, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3rem] h-[3rem] bg-white rounded-full shadow-[0_0_80px_white] scale-0 group-hover/progress:scale-100 transition-all duration-[2000ms] shadow-3xl" />
                        </motion.div>
                        <div className="absolute inset-0 bg-white/[0.12] opacity-0 group-hover/progress:opacity-100 transition-all duration-[2000ms]" />
                      </div>
                      <div className="flex justify-between text-[26px] font-black uppercase tracking-[1.5em] text-gray-950 italic drop-shadow-2xl">
                        <span className="text-rose-500 drop-shadow-2xl">02:14</span>
                        <div className="flex items-center gap-12 opacity-30 group-hover:opacity-100 transition-all duration-1000">
                           <Fingerprint size={64} strokeWidth={1} className="drop-shadow-3xl" />
                           <span>Sync Active</span>
                        </div>
                        <span>05:42</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center lg:justify-start gap-[15rem] pt-24 opacity-30 group-hover:opacity-100 transition-all duration-2000">
                       <Shuffle size={112} strokeWidth={0.1} className="hover:text-rose-500 cursor-pointer transition-all duration-[2000ms] hover:scale-150 hover:rotate-[30deg] drop-shadow-3xl" />
                       <Repeat size={112} strokeWidth={0.1} className="hover:text-rose-500 cursor-pointer transition-all duration-[2000ms] hover:scale-150 hover:rotate-[30deg] drop-shadow-3xl" />
                       <div className="flex items-center gap-24 group/vol w-full max-w-[45rem]">
                         <Volume2 size={112} strokeWidth={0.1} className="group-hover/vol:text-rose-500 transition-all duration-[2000ms] group-hover/vol:scale-125 drop-shadow-3xl" />
                         <div className="w-full h-6 bg-white/[0.01] rounded-full shadow-inner overflow-hidden border-4 border-white/5 relative group/vol-bar cursor-pointer">
                           <div className="w-2/3 h-full bg-gradient-to-r from-white/20 to-rose-500/40 rounded-full shadow-inner" />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Archive List - Standardized Sanctuary Cards */}
          <section className="space-y-[6rem] px-6 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-48">
              <div className="flex items-center gap-24">
                <div className="p-20 rounded-[7rem] bg-white/[0.01] text-rose-500 border-4 border-white/5 shadow-inner relative overflow-hidden group shadow-[0_120px_250px_rgba(0,0,0,1)]">
                  <div className="absolute inset-0 bg-rose-500/25 opacity-0 group-hover:opacity-100 transition-all duration-[2500ms]" />
                  <History size={192} strokeWidth={0.05} className="animate-spin-slow relative z-10 drop-shadow-3xl" />
                </div>
                <div className="space-y-12">
                  <h2 className="text-8xl sm:text-[11rem] font-serif text-white tracking-tighter leading-none italic drop-shadow-3xl">The Sonic Archive</h2>
                  <p className="text-[24px] text-gray-950 font-black uppercase tracking-[1.2em] italic opacity-40">Historical Resonance Frequencies</p>
                </div>
              </div>
              <div className="flex items-center gap-32 text-[22px] text-gray-950 font-black uppercase tracking-[1.5em] bg-white/[0.01] px-48 py-20 rounded-[5rem] border-4 border-white/5 backdrop-blur-[150px] shadow-[0_100px_200px_rgba(0,0,0,1)] shadow-inner italic shadow-3xl">
                <span className="flex items-center gap-12 text-rose-500 drop-shadow-2xl"><Zap size={64} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" /> Linked Archive</span>
                <span className="w-8 h-8 rounded-full bg-gray-950 shadow-inner" />
                <span className="text-gray-950 opacity-40 group-hover:opacity-100 transition-all">{songs.length} Transmissions</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[5rem]">
              {songs.length <= 1 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(80px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  className="col-span-full"
                >
                  <Card className="py-[35rem] text-center space-y-48 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] shadow-[0_250px_600px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner rounded-[10rem] max-w-7xl mx-auto">
                    <div className="relative">
                      <div className="p-64 bg-rose-500/[0.05] rounded-[12rem] text-rose-500/10 border-4 border-rose-500/15 shadow-inner group-hover:scale-125 transition-all duration-[10s]">
                        <Music size={640} strokeWidth={0.01} className="drop-shadow-3xl" />
                      </div>
                      <div className="absolute -top-32 -right-32 p-32 rounded-[7rem] bg-[#050506] border-8 border-white/10 shadow-[0_120px_250px_rgba(0,0,0,1)]">
                        <Sparkles size={192} strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
                      </div>
                    </div>
                    <div className="space-y-24 px-32">
                      <h2 className="text-9xl sm:text-[15rem] font-serif text-white/90 tracking-tighter italic leading-none drop-shadow-3xl">The archive is silent</h2>
                      <p className="text-gray-800 italic max-w-[100rem] mx-auto text-[8rem] sm:text-[11rem] leading-none font-handwritten opacity-60 selection:bg-rose-500/40 drop-shadow-2xl">
                        "Every shared rhythm deserves to be eternalized. Seal a song that defines our frequency..."
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsModalOpen(true)} 
                      className="rounded-[8rem] px-[8rem] py-24 text-[8rem] h-auto group border-none shadow-[0_150px_350px_rgba(244,63,94,0.7)]"
                    >
                      Initialize Archive <Plus size={160} strokeWidth={0.01} className="ml-24 group-hover:rotate-[180deg] transition-all duration-[2000ms]" />
                    </Button>
                  </Card>
                </motion.div>
              ) : (
                songs.slice(1).map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 150, filter: 'blur(80px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ delay: i * 0.1, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card 
                      className="p-32 flex items-center gap-48 group cursor-pointer active:scale-[0.96] transition-all duration-[2500ms] border-4 border-white/5 hover:border-rose-500/60 bg-white/[0.01] hover:bg-white/[0.08] shadow-[0_200px_450px_rgba(0,0,0,1)] relative overflow-hidden backdrop-blur-[120px] shadow-inner rounded-[9rem]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.12] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2500ms]" />
                      <div className="w-[25rem] h-[25rem] rounded-[7rem] overflow-hidden bg-[#050506] border-8 border-white/10 relative shrink-0 shadow-[0_80px_200px_rgba(0,0,0,1)] group-hover:rotate-[20deg] group-hover:scale-125 transition-all duration-[2500ms] shadow-inner relative group/list-cover">
                         <div className="absolute inset-0 bg-white/15 blur-[40px] opacity-0 group-hover/list-cover:opacity-100 transition-all duration-[2000ms]" />
                        <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-150 transition-all duration-[12000ms] grayscale-[0.7] group-hover:grayscale-0 brightness-[0.7] group-hover:brightness-[1]" />
                        <div className="absolute inset-0 bg-rose-950/95 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms] flex items-center justify-center backdrop-blur-[60px]">
                          <Play size={192} fill="currentColor" className="text-white scale-[0.3] group-hover:scale-100 transition-all duration-[2000ms] drop-shadow-3xl" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-16 relative z-10">
                        <p className="font-serif text-[10rem] text-white truncate group-hover:text-rose-400 transition-all duration-[2000ms] leading-none tracking-tighter italic selection:bg-rose-500/40 drop-shadow-3xl">{song.title}</p>
                        <div className="flex items-center gap-16 opacity-30 italic leading-none">
                          <Mic2 size={96} strokeWidth={0.05} className="text-gray-950" />
                          <p className="text-[8rem] text-gray-950 font-handwritten truncate selection:bg-rose-500/40 leading-none drop-shadow-2xl">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-16 shrink-0 relative z-10">
                        <button className="p-20 rounded-[5rem] bg-white/[0.01] text-gray-950 hover:text-rose-500 hover:bg-rose-500/30 transition-all duration-[2000ms] border-4 border-white/5 active:scale-[5] group/heart shadow-inner shadow-[0_60px_120px_rgba(0,0,0,1)]">
                          <Heart size={112} strokeWidth={0.1} className="group-hover/heart:fill-current transition-all duration-[2000ms] drop-shadow-3xl" />
                        </button>
                        <button className="p-20 rounded-[5rem] bg-white/[0.01] text-gray-950 hover:text-blue-500 hover:bg-blue-500/30 transition-all duration-[2000ms] border-4 border-white/5 active:scale-[5] shadow-inner shadow-[0_60px_120px_rgba(0,0,0,1)]">
                          <Share2 size={112} strokeWidth={0.1} className="drop-shadow-3xl" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* Add Song Modal - Sanctuary Standard */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/99 backdrop-blur-[150px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(80px)' }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[2010] w-full max-w-7xl m-auto"
            >
              <Card className="w-full p-20 sm:p-64 space-y-48 relative overflow-hidden border-4 border-white/5 bg-white/[0.01] shadow-[0_200px_500px_rgba(0,0,0,1)] backdrop-blur-[150px] shadow-inner rounded-[8rem]">
                <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.15] blur-[250px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-16">
                    <div className="flex items-center gap-12 text-rose-500 font-black uppercase tracking-[1.5em] text-[18px] mb-10 italic">
                      <Zap size={80} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-2xl" />
                      Seal an Anthem
                    </div>
                    <h2 className="text-8xl sm:text-[14rem] font-serif text-white tracking-tighter leading-none italic">Link a Rhythm</h2>
                    <p className="text-gray-800 font-handwritten text-[9rem] sm:text-[11rem] italic opacity-80 leading-none">"Tether our hearts to this specific sonic vibration..."</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-16 text-gray-800 hover:text-white hover:bg-white/15 rounded-[5rem] transition-all duration-[1500ms] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-inner shadow-[0_60px_120px_rgba(0,0,0,1)]"
                  >
                    <X size={160} strokeWidth={0.1} className="group-hover:rotate-[180deg] transition-all duration-[1500ms]" />
                  </button>
                </div>

                <div className="space-y-64 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-48">
                    <div className="space-y-16">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-16 italic">Song Title</label>
                      <div className="relative group/song">
                        <Music className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/10 group-focus-within/song:text-rose-500 transition-all duration-[1500ms]" size={128} strokeWidth={0.05} />
                        <input
                          placeholder="e.g. Perfect, Yellow..."
                          value={newSong.title}
                          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                          className="input-field py-24 pl-[12rem] text-[9rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[6rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-16">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-16 italic">Vocal Artist</label>
                      <div className="relative group/art">
                        <Mic2 className="absolute left-24 top-1/2 -translate-y-1/2 text-blue-500/10 group-focus-within/art:text-blue-500 transition-all duration-[1500ms]" size={128} strokeWidth={0.05} />
                        <input
                          placeholder="e.g. Coldplay..."
                          value={newSong.artist}
                          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                          className="input-field py-24 pl-[12rem] text-[9rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[1500ms] shadow-inner rounded-[6rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-16">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[1.5em] px-16 italic">The Resonance Note</label>
                    <textarea
                      placeholder="Capture the frequency of this melody in words... Why does it echo in your soul?"
                      value={newSong.note}
                      onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                      className="input-field min-h-[600px] resize-none leading-[1.6] py-24 px-24 text-[8rem] font-handwritten italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.05] focus:border-rose-500/60 transition-all duration-[2000ms] shadow-inner rounded-[8rem] no-scrollbar text-white placeholder:text-gray-950 selection:bg-rose-500/40"
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddSong}
                    isLoading={isSaving}
                    disabled={!newSong.title}
                    className="w-full gap-[4rem] py-[4rem] text-[9rem] tracking-tighter shadow-[0_150px_450px_rgba(244,63,94,0.7)] relative overflow-hidden group/submit border-none rounded-[8rem] leading-none"
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-[4rem] italic">
                      <Send size={192} strokeWidth={0.1} className="rotate-[-30deg] group-hover/submit:translate-x-12 group-hover/submit:-translate-y-12 transition-all duration-[2500ms] drop-shadow-3xl" />
                      Transmit to Archive
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
