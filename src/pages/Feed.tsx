import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Loader2, Sparkles, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/feed/PostCard';
import Stories from '../components/Stories';
import UploadModal from '../components/UploadModal';

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

  return (
    <div className="max-w-2xl mx-auto space-y-10 sm:space-y-12">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Feed Header */}
      <header className="flex justify-between items-end px-2 sm:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Sparkles size={12} className="animate-pulse" />
            Our Shared Universe
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Sanctuary Feed</h1>
          <p className="text-gray-400 text-sm font-handwritten italic opacity-80">A collection of us, frame by frame...</p>
        </div>
      </header>

      {/* Posts List */}
      <div className="space-y-8 sm:space-y-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
              <Heart size={20} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] animate-pulse">Reliving moments...</p>
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 premium-card space-y-8 border-dashed border-2"
          >
            <div className="p-8 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/30">
              <ImageIcon size={64} strokeWidth={1} />
            </div>
            <div className="space-y-3 px-6">
              <h2 className="text-2xl font-serif text-white/90">The canvas is blank</h2>
              <p className="text-gray-500 italic max-w-xs mx-auto text-sm leading-relaxed">
                Every epic love story needs its first photo. Why not share one now?
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10 sm:space-y-16">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
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



