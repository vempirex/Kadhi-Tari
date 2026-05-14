import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Heart, Image as ImageIcon, Zap, Sparkles, SendHorizonal } from 'lucide-react';
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
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/98 backdrop-blur-[30px]"
          />
          <Card className="w-full max-w-xl p-10 sm:p-16 space-y-12 relative overflow-hidden border-white/5 bg-white/[0.01] shadow-[0_50px_150px_rgba(0,0,0,0.8)] m-auto">
            <div className="absolute top-[-15%] right-[-15%] w-[60%] h-[60%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
                  <Zap size={14} className="animate-pulse" />
                  {type === 'post' ? 'Capture Archive' : 'Broadcast Frequency'}
                </div>
                <h2 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-tight">
                  {type === 'post' ? 'New Moment' : 'Create Story'}
                </h2>
                <p className="text-gray-500 font-handwritten text-2xl italic opacity-80">
                  {type === 'post' ? '"Eternalize this specific shared breath..."' : '"A whisper that fades, but resonates forever..."'}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-5 text-gray-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-white/5"
              >
                <X size={32} />
              </button>
            </div>

            <div className="space-y-10 relative z-10">
              <div 
                className={twMerge(
                  "aspect-[4/5] rounded-[3.5rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-inner",
                  previewUrl ? "border-rose-500/40 bg-black" : "border-white/5 bg-white/[0.02] hover:border-rose-500/20 hover:bg-white/[0.04]"
                )}
                onClick={() => document.getElementById('modal-file-upload')?.click()}
              >
                {previewUrl ? (
                  <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full relative"
                  >
                    <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="p-6 rounded-[2rem] bg-white/10 border border-white/20 mb-4 scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Camera className="text-white" size={40} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Switch Reflection</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 group-hover:scale-110 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 transition-all duration-700 shadow-2xl">
                      <Upload className="text-gray-600 group-hover:text-rose-400 group-hover:rotate-12 transition-all duration-700" size={48} strokeWidth={1} />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.5em] group-hover:text-rose-400 transition-colors">Drop Reflection</p>
                      <p className="text-xs text-gray-700 font-medium italic">Max size: 10MB</p>
                    </div>
                  </div>
                )}
                <input id="modal-file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              {type === 'post' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">The Whisper (Caption)</label>
                    <div className="flex items-center gap-1.5 opacity-30">
                      <Sparkles size={10} className="text-rose-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white">Soul Script</span>
                    </div>
                  </div>
                  <textarea
                    placeholder="Capture the vibe, the feeling, the shared frequency of this moment..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="input-field min-h-[160px] resize-none py-8 px-10 leading-relaxed text-xl font-medium bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-700 shadow-inner font-handwritten italic placeholder:opacity-20"
                  />
                </div>
              )}

              <Button
                isLoading={isUploading}
                disabled={!selectedImage}
                onClick={handleUpload}
                className="w-full gap-6 py-8 text-2xl tracking-tight shadow-[0_25px_80px_rgba(244,63,94,0.3)] relative overflow-hidden group"
                size="xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative z-10 flex items-center justify-center gap-5">
                  <Heart size={28} className={twMerge("transition-all duration-500", selectedImage ? "fill-white scale-110" : "fill-transparent")} />
                  <span>{type === 'post' ? 'Archive Memory' : 'Ignite Story'}</span>
                  <SendHorizonal size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AnimatePresence>
  );
}
