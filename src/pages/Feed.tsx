import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Heart, Zap, Camera, Plus, History, Shield, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/feed/PostCard';
import Stories from '../components/Stories';
import UploadModal from '../components/UploadModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Post {
  id: string;
  caption: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
    display_name: string;
  };
  post_photos: { image_url: string }[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('feed_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username, avatar_url, display_name),
        post_photos (image_url)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) setPosts(data as any);
    setIsLoading(false);
  };

  if (isLoading && posts.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-16">
      <div className="relative">
        <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1em] animate-pulse italic">Synchronizing Memories...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      {/* Stories Section */}
      <section className="-mx-6 sm:mx-0 relative z-30">
        <Stories />
      </section>

      {/* Feed Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-16 px-6 sm:px-0 relative z-40">
        <div className="space-y-12 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-center sm:justify-start gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-6 italic">
            <Sparkles size={64} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
            Shared Frequency
          </div>
          <h1 className="text-7xl sm:text-[13rem] font-serif glow-text leading-[0.85] tracking-tighter italic drop-shadow-3xl">Archives of Us</h1>
          <p className="text-gray-500 text-4xl sm:text-[11rem] font-handwritten italic opacity-80 max-w-7xl leading-none selection:bg-rose-500/40 drop-shadow-2xl">
            "Every frame is a whisper, every pixel a shared breath in our private universe..."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-16 w-full sm:w-auto">
          <Button 
            variant="glass"
            size="xl"
            className="rounded-[6rem] px-[5rem] h-auto py-20 border-4 border-white/5 text-[6rem] italic tracking-tighter w-full sm:w-auto shadow-inner shadow-[0_120px_300px_rgba(0,0,0,1)] group/timeline transition-all duration-[1500ms] active:scale-[0.5]"
          >
            <History size={128} strokeWidth={0.01} className="mr-16 drop-shadow-3xl group-hover/timeline:rotate-[-25deg] transition-all duration-[1500ms]" />
            Timeline
          </Button>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="rounded-[6rem] px-[6rem] h-auto py-20 shadow-[0_150px_450px_rgba(244,63,94,0.7)] relative overflow-hidden group w-full sm:w-auto border-none shadow-inner leading-none transition-all duration-[1500ms] active:scale-[0.5]"
            size="xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
            <span className="relative z-10 flex items-center justify-center gap-16 text-[6rem] italic tracking-tighter">
              Capture Moment <Camera size={128} strokeWidth={0.01} className="group-hover:scale-150 group-hover:rotate-[25deg] transition-all duration-[2000ms] fill-current drop-shadow-3xl shadow-[0_0_150px_white]" />
            </span>
          </Button>
        </div>
      </header>

      {/* Posts List */}
      <div className="space-y-48 sm:space-y-[10rem] px-6 sm:px-0 relative z-20">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div 
              key="empty-feed"
              initial={{ opacity: 0, scale: 0.95, y: 150, filter: 'blur(100px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              className="w-full"
            >
              <Card className="py-72 text-center space-y-48 border-dashed border-8 flex flex-col items-center border-white/5 bg-white/[0.01] rounded-[11rem] shadow-[0_300px_650px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner max-w-7xl mx-auto">
                <div className="relative">
                  <div className="p-48 bg-rose-500/[0.03] rounded-[13rem] text-rose-500/5 border-4 border-rose-500/15 shadow-inner group-hover:scale-125 transition-all duration-[10s]">
                    <ImageIcon size={640} strokeWidth={0.01} className="drop-shadow-3xl" />
                  </div>
                  <div className="absolute -top-32 -right-32 p-32 rounded-[7rem] bg-[#050506] border-8 border-white/10 shadow-[0_150px_350px_rgba(0,0,0,1)]">
                    <Sparkles size={240} strokeWidth={0.01} className="text-rose-500 animate-pulse fill-rose-500 drop-shadow-3xl" />
                  </div>
                </div>
                <div className="space-y-24 px-32">
                  <h2 className="text-9xl sm:text-[16rem] font-serif text-white/90 tracking-tighter italic leading-none drop-shadow-3xl">The canvas is silent</h2>
                  <p className="text-gray-950 italic max-w-[120rem] mx-auto text-[10rem] sm:text-[13rem] leading-none font-handwritten opacity-60 selection:bg-rose-500/40 drop-shadow-2xl">
                    "Our saga is written in light and shadows. Be the one to start the next beautiful chapter..."
                  </p>
                </div>
                <Button 
                  onClick={() => setIsUploadOpen(true)} 
                  className="rounded-[8rem] px-[8rem] py-24 text-[9rem] italic tracking-tighter group h-auto border-none shadow-[0_150px_450px_rgba(244,63,94,0.7)] leading-none"
                >
                  Initiate Sync <Plus size={192} strokeWidth={0.01} className="ml-24 group-hover:rotate-[180deg] transition-all duration-[2000ms] drop-shadow-3xl" />
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-48 sm:gap-[15rem] max-w-7xl mx-auto">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 200, filter: 'blur(100px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ delay: idx * 0.1, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={fetchPosts}
        type="post"
      />
    </div>
  );
}
