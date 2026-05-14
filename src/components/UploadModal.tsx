import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Loader2, Heart, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'post' | 'story';
}

export default function UploadModal({ isOpen, onClose, onSuccess, type }: UploadModalProps) {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || isUploading) return;
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const bucket = type === 'post' ? 'feed' : 'stories';
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);

      if (type === 'post') {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .insert([{ caption, user_id: user.id }])
          .select()
          .single();

        if (postError) throw postError;

        await supabase
          .from('post_photos')
          .insert([{ post_id: postData.id, image_url: publicUrl }]);
      } else {
        await supabase
          .from('stories')
          .insert([{ 
            user_id: user.id, 
            image_url: publicUrl,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }]);
      }

      setCaption("");
      setSelectedImage(null);
      setPreviewUrl(null);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error uploading:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <h2 className="text-2xl font-serif text-rose-400">
                  {type === 'post' ? 'Share Memory' : 'Create Story'}
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  New Sanctuary {type}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div 
                className={twMerge(
                  "aspect-square rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer",
                  previewUrl ? "border-rose-500/50" : "border-white/10 hover:border-rose-500/30 hover:bg-white/5"
                )}
                onClick={() => document.getElementById('modal-file-upload')?.click()}
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
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tap to select {type === 'post' ? 'photo' : 'story'}</p>
                  </>
                )}
                <input id="modal-file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              {type === 'post' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Caption</label>
                  <textarea
                    placeholder="Capture the vibe of this moment..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>
              )}

              <button
                disabled={!selectedImage || isUploading}
                onClick={handleUpload}
                className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Heart size={20} fill="currentColor" />
                    <span>{type === 'post' ? 'Post to Sanctuary' : 'Share Story'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
