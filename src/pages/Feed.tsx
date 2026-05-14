import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, X, Upload, Loader2, Sparkles, Camera, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import { twMerge } from 'tailwind-merge';

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

    const channel: any = supabase
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
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <ImageIcon size={12} />
            Shared Sanctuary
          </div>
          <h1 className="text-4xl font-serif glow-text leading-tight">Our Gallery</h1>
          <p className="text-gray-400 text-sm font-handwritten italic">Moments frozen in time...</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center"
        >
          <Camera size={28} />
        </motion.button>
      </header>

      <div className="space-y-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={40} />
            <p className="text-sm text-gray-500 font-medium animate-pulse">Developing our memories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 glass-panel rounded-[4rem] space-y-6 mx-2 border-dashed border-2 border-white/5">
            <div className="p-6 bg-rose-500/5 rounded-full w-fit mx-auto text-rose-400/50">
              <ImageIcon size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif text-white/80">No memories shared yet</p>
              <p className="text-gray-500 italic max-w-[200px] mx-auto text-sm">Every story begins with a single frame. Start ours!</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-rose-400 font-bold text-xs uppercase tracking-widest hover:bg-rose-500/10 transition-all"
            >
              Post First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-panel rounded-[3rem] w-full max-w-md p-8 space-y-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 bg-rose-500/10 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-serif text-rose-400">Share Memory</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">New Sanctuary Post</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div 
                  className={twMerge(
                    "aspect-square rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer",
                    previewUrl ? "border-rose-500/50" : "border-white/10 hover:border-rose-500/30 hover:bg-white/5"
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-5 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-gray-500 group-hover:text-rose-400" size={32} />
                      </div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tap to select photo</p>
                    </>
                  )}
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Caption</label>
                  <textarea
                    placeholder="Capture the vibe of this moment..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="input-field min-h-[120px] resize-none"
                  />
                </div>

                <button
                  disabled={!selectedImage || isUploading}
                  onClick={handleCreatePost}
                  className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Developing...</span>
                    </>
                  ) : (
                    <>
                      <Heart size={20} fill="currentColor" />
                      <span>Post to Sanctuary</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


