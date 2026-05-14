import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Sparkles, Heart, Zap, Camera, 
  Plus, History, Shield, Fingerprint, Wind, Sun, Moon,
  LayoutGrid
} from 'lucide-react';
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
      <Loader2 size={48} className="animate-spin text-rose-500" />
      <p className="text-[12px] text-white/20 font-black uppercase tracking-[1em] italic">Syncing Memories...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 px-4">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Feed Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-rose-500 uppercase tracking-[0.5em] text-[10px] font-black italic">
            <Sparkles size={24} />
            Shared Frequency
          </div>
          <h1 className="text-6xl sm:text-8xl font-serif italic text-white leading-none">Archives of Us</h1>
          <p className="text-gray-400 text-3xl sm:text-4xl font-handwritten italic opacity-80 max-w-2xl">
            "Every frame is a whisper, every pixel a shared breath in our private universe..."
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="glass"
            onClick={() => setIsUploadOpen(true)}
            className="rounded-3xl px-8 py-3"
          >
            <Camera size={20} className="mr-3" /> Capture
          </Button>
        </div>
      </header>

      {/* Posts List */}
      <div className="space-y-12 pt-8">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <Card variant="glass" className="py-24 text-center space-y-8 border-dashed border-2 flex flex-col items-center">
                <div className="relative">
                  <div className="p-12 bg-rose-500/5 rounded-[4rem] text-rose-500/20 border border-rose-500/10">
                    <ImageIcon size={120} strokeWidth={0.5} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-5xl font-serif text-white italic">The canvas is silent</h2>
                  <p className="text-gray-400 italic max-w-lg mx-auto text-3xl font-handwritten opacity-60">
                    "Our saga is written in light and shadows. Be the one to start the next beautiful chapter..."
                  </p>
                </div>
                <Button 
                  onClick={() => setIsUploadOpen(true)} 
                  className="rounded-full px-12 py-4"
                >
                  Initiate Sync <Plus size={24} className="ml-3" />
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-12">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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

import { Loader2 } from 'lucide-react';
