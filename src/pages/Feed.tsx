import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Sparkles, Heart, Zap, Camera, 
  Plus, History, Shield, Fingerprint, Wind, Sun, Moon,
  LayoutGrid, Loader2
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
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 size={32} className="animate-spin text-rose-500" />
      <p className="text-xs font-bold text-warm-400 uppercase tracking-widest italic">Syncing moments...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Stories Section */}
      <section className="-mx-4 sm:mx-0">
        <Stories />
      </section>

      {/* Feed Header */}
      <header className="flex items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
            <Sparkles size={16} />
            Shared Gallery
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight leading-tight">Archives of Us</h1>
          <p className="text-warm-500 font-medium text-lg max-w-xl">
            A curated timeline of our shared breath and beautiful moments.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            variant="primary"
            onClick={() => setIsUploadOpen(true)}
            size="md"
          >
            <Camera size={18} className="mr-2" /> Share
          </Button>
        </div>
      </header>

      {/* Posts List */}
      <div className="space-y-10 pt-4">
        <AnimatePresence mode="popLayout">
          {posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <Card className="py-24 text-center space-y-6 border-dashed border-2 flex flex-col items-center">
                <div className="p-10 bg-warm-50 rounded-3xl text-warm-200 border border-warm-100">
                  <ImageIcon size={64} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-charcoal">The gallery is waiting</h2>
                  <p className="text-warm-400 font-medium max-w-sm mx-auto">
                    Be the first to start the next beautiful chapter in our shared saga.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsUploadOpen(true)} 
                  variant="soft"
                >
                  Post First Memory <Plus size={18} className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-10">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
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
