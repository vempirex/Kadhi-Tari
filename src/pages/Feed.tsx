import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, X, Upload, Loader2, Sparkles, Camera, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import Stories from '../components/Stories';
import UploadModal from '../components/UploadModal';
import { twMerge } from 'tailwind-merge';

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
    <div className="space-y-8 pb-24">
      {/* Stories Bar */}
      <div className="-mx-4 mb-4">
        <Stories />
      </div>

      <header className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Sparkles size={12} />
            Shared Gallery
          </div>
          <h1 className="text-3xl font-serif glow-text leading-tight">Our Memories</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Every frame tells our story...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsUploadOpen(true)}
          className="w-14 h-14 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <Camera size={28} />
        </motion.button>
      </header>

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={32} />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Developing memories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-[3rem] space-y-6 mx-2 border-dashed border-2 border-white/5">
            <div className="p-6 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/50">
              <ImageIcon size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif text-white/80">No memories yet</p>
              <p className="text-gray-500 italic max-w-[200px] mx-auto text-sm">Every story begins with a single frame. Start ours!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, idx) => (
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



