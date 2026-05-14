import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Heart, MessageCircle, Plus, X, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  image_url: string;
  caption: string;
  user_name: string;
  created_at: string;
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
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setPosts(data);
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
      // 1. Upload image to Supabase Storage
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // 3. Create database entry
      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbError } = await supabase.from('posts').insert([
        {
          image_url: publicUrl,
          caption,
          user_name: user?.email?.split('@')[0] || 'Anonymous',
          user_id: user?.id
        }
      ]);

      if (dbError) throw dbError;

      // Reset and refresh
      setIsModalOpen(false);
      setCaption("");
      setSelectedImage(null);
      setPreviewUrl(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Check your storage bucket and policies.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-serif glow-text">Shared Feed</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-full bg-primary text-background shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden p-3"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-white/5">
                <img 
                  src={post.image_url} 
                  alt="Feed item" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{post.user_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors">
                      <Heart size={18} />
                    </button>
                    <button className="text-white/80 hover:text-secondary transition-colors">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-3 pb-4 space-y-2">
                <p className="text-lg font-handwritten leading-relaxed italic">
                  "{post.caption}"
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card rounded-[3rem] w-full max-w-md p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">New Memory</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div 
                  className="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Upload className="text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
                      <p className="text-xs text-gray-500">Choose a beautiful moment</p>
                    </>
                  )}
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                <textarea
                  placeholder="Tell the story behind this photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none"
                />

                <button
                  disabled={!selectedImage || isUploading}
                  onClick={handleCreatePost}
                  className="w-full py-4 rounded-2xl bg-primary text-background font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={20} /> : "Share Memory"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

