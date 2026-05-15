import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Heart, Image as ImageIcon, Zap, Sparkles, SendHorizontal, Fingerprint, Star, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

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
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, selectedImage);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);

      if (type === 'post') {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .insert([{ caption, user_id: user.id }])
          .select()
          .single();

        if (postError) throw postError;

        await supabase.from('post_photos').insert([{ post_id: postData.id, image_url: publicUrl }]);
      } else {
        await supabase.from('stories').insert([{ 
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
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-[6010] w-full max-w-xl m-auto overflow-y-auto max-h-[90vh]"
          >
            <Card className="w-full p-8 space-y-8 bg-white shadow-premium">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
                    <Zap size={16} />
                    {type === 'post' ? 'Capture Archive' : 'Broadcast Frequency'}
                  </div>
                  <h2 className="text-3xl font-outfit font-bold text-charcoal tracking-tight">
                    {type === 'post' ? 'New Moment' : 'Create Story'}
                  </h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 text-warm-400 hover:text-charcoal hover:bg-warm-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div 
                  className={twMerge(
                    "aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer",
                    previewUrl ? "border-rose-200 bg-warm-50" : "border-warm-200 bg-warm-50/50 hover:border-rose-300 hover:bg-rose-50/10"
                  )}
                  onClick={() => document.getElementById('modal-file-upload')?.click()}
                >
                  {previewUrl ? (
                    <div className="w-full h-full relative">
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="p-3 rounded-xl bg-white border border-warm-100 shadow-sm mb-2">
                          <Camera className="text-rose-600" size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-warm-300">
                      <div className="p-4 rounded-2xl bg-white border border-warm-100 shadow-sm group-hover:text-rose-500 group-hover:border-rose-200 transition-all">
                        <Upload size={32} />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest">Select Image</p>
                        <p className="text-[10px] font-medium italic">Max size: 10MB</p>
                      </div>
                    </div>
                  )}
                  <input id="modal-file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                {type === 'post' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">The Whisper (Caption)</label>
                    <textarea
                      placeholder="Capture the vibe, the feeling, the shared frequency of this moment..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl p-4 text-sm font-medium text-charcoal min-h-[120px] outline-none focus:bg-white focus:border-rose-200 transition-all resize-none"
                    />
                  </div>
                )}

                <Button
                  isLoading={isUploading}
                  disabled={!selectedImage}
                  onClick={handleUpload}
                  className="w-full"
                >
                  <Heart size={18} className={twMerge("mr-2 transition-all", selectedImage ? "fill-white" : "fill-transparent")} />
                  {type === 'post' ? 'Archive Memory' : 'Ignite Story'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
