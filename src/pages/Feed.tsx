import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Sparkles, Heart, Zap, Camera, Plus, History } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-[80vh] gap-8">
      <div className="relative">
        <div className="w-20 h-20 rounded-[2.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
        <Zap size={24} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
      </div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Memories...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-20 pb-32">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0 relative z-20">
        <Stories />
      </section>

      {/* Feed Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 px-4 sm:px-0 relative z-10">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
            <Sparkles size={12} className="animate-pulse" />
            Shared Frequency
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Archives of Us</h1>
          <p className="text-gray-400 text-xl font-handwritten italic opacity-80 max-w-lg leading-relaxed">
            "Every frame is a whisper, every pixel a shared breath in our private universe..."
          </p>
        </div>
        
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <Button 
            variant="glass"
            size="lg"
            className="rounded-[2rem] px-8 h-auto py-5 border-white/5"
          >
            <History size={20} className="mr-3" />
            Timeline
          </Button>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="rounded-[2rem] px-8 h-auto py-5 shadow-[0_15px_40px_rgba(244,63,94,0.25)] relative overflow-hidden group"
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="relative z-10 flex items-center gap-3">
              Capture Moment <Camera size={20} />
            </span>
          </Button>
        </div>
      </header>

      {/* Posts List */}
      <div className="space-y-16 sm:space-y-24 px-2 sm:px-0">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div 
              key="empty-feed"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full"
            >
              <Card className="py-48 text-center space-y-12 border-dashed border-2 flex flex-col items-center border-white/5 bg-white/[0.01]">
                <div className="relative">
                  <div className="p-14 bg-rose-500/5 rounded-[4rem] text-rose-400/20 border border-rose-500/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                    <ImageIcon size={96} strokeWidth={1} />
                  </div>
                  <div className="absolute -top-4 -right-4 p-4 rounded-3xl bg-[#050506] border border-white/5 shadow-2xl">
                    <Sparkles size={24} className="text-rose-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-6 px-10">
                  <h2 className="text-4xl font-serif text-white/90 tracking-tight">The canvas is silent</h2>
                  <p className="text-gray-500 italic max-w-md mx-auto text-xl leading-relaxed font-handwritten opacity-70">
                    "Our saga is written in light and shadows. Be the one to start the next beautiful chapter..."
                  </p>
                </div>
                <Button 
                  onClick={() => setIsUploadOpen(true)} 
                  className="rounded-[2rem] px-10 py-6 text-lg group h-auto"
                >
                  Initiate Sync <Plus size={20} className="ml-2 group-hover:rotate-90 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-16 sm:space-y-24">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
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



