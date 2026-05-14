import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, X, Upload, Loader2, Sparkles, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';

interface Post {
  id: string;
  caption: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  post_photos: { image_url: string }[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('feed_updates')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        () => {
          fetchPosts();
        }
      )
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
        profiles (username, avatar_url),
        post_photos (image_url)
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) setPosts(data as Post[]);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage || isUploading) return;
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('feed')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('feed').getPublicUrl(fileName);

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{ caption, user_id: user.id }])
        .select()
        .single();

      if (postError) throw postError;

      const { error: photoError } = await supabase
        .from('post_photos')
        .insert([{ post_id: postData.id, image_url: publicUrl }]);

      if (photoError) throw photoError;

      setIsModalOpen(false);
      setCaption("");
      setSelectedImage(null);
      setPreviewUrl(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="flex justify-between items-center px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif glow-text leading-tight">Shared Memories</h1>
          <p className="text-xs text-rose-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <Sparkles size={12} />
            Our Private Timeline
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="p-4 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20"
        >
          <Camera size={24} />
        </motion.button>
      </header>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={32} />
            <p className="text-sm text-gray-500 font-medium">Gathering our moments...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-[3rem] space-y-4 mx-2">
            <div className="p-4 bg-rose-500/10 rounded-full w-fit mx-auto text-rose-400">
              <ImageIcon size={32} />
            </div>
            <p className="text-gray-400 italic">No memories shared yet. Start our journey!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-rose-400">Share Memory</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  className="aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Upload className="text-gray-500 mb-2 group-hover:text-rose-400 transition-colors" size={32} />
                      <p className="text-xs text-gray-500">Tap to choose photo</p>
                    </>
                  )}
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                <textarea
                  placeholder="Capture the vibe of this moment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-rose-500/50 transition-colors min-h-[100px] resize-none"
                />

                <button
                  disabled={!selectedImage || isUploading}
                  onClick={handleCreatePost}
                  className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={20} /> : "Post to Sanctuary"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


