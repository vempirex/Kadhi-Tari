import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Heart, Image as ImageIcon, Zap, Sparkles, SendHorizontal, Fingerprint, Star } from 'lucide-react';
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
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/99 backdrop-blur-[200px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(100px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(100px)' }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[6010] w-full max-w-7xl m-auto"
          >
            <Card className="w-full p-24 sm:p-[6rem] space-y-[6rem] relative overflow-hidden border-[6px] border-white/5 bg-white/[0.01] shadow-[0_300px_600px_rgba(0,0,0,1)] rounded-[10rem] shadow-inner backdrop-blur-[150px]">
              <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.15] blur-[250px] rounded-full pointer-events-none animate-pulse" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-16">
                  <div className="flex items-center gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-6 italic leading-none drop-shadow-3xl">
                    <Zap size={80} strokeWidth={1} className="animate-pulse fill-rose-500 shadow-[0_0_80px_rgba(244,63,94,1)]" />
                    {type === 'post' ? 'Capture Archive' : 'Broadcast Frequency'}
                  </div>
                  <h2 className="text-8xl sm:text-[14rem] font-serif text-white tracking-tighter leading-none italic drop-shadow-3xl">
                    {type === 'post' ? 'New Moment' : 'Create Story'}
                  </h2>
                  <p className="text-gray-950 font-handwritten text-[8rem] sm:text-[11rem] italic opacity-60 leading-none drop-shadow-2xl">
                    {type === 'post' ? '"Eternalize this specific shared breath..."' : '"A whisper that fades, but resonates forever..."'}
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-24 text-gray-950 hover:text-white hover:bg-white/15 rounded-[6rem] transition-all duration-[1500ms] active:scale-[0.5] border-[6px] border-transparent hover:border-white/20 shadow-inner shadow-[0_100px_250px_rgba(0,0,0,1)] group"
                >
                  <X size={160} strokeWidth={0.01} className="group-hover:rotate-180 transition-transform duration-[1500ms] drop-shadow-3xl" />
                </button>
              </div>

              <div className="space-y-[6rem] relative z-10">
                <div 
                  className={twMerge(
                    "aspect-[4/5] sm:aspect-video rounded-[10rem] border-[12px] border-dashed transition-all duration-[2000ms] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-inner",
                    previewUrl ? "border-rose-500/80 bg-black shadow-[0_150px_450px_rgba(0,0,0,1)]" : "border-white/5 bg-white/[0.01] hover:border-rose-500/60 hover:bg-white/[0.05]"
                  )}
                  onClick={() => document.getElementById('modal-file-upload')?.click()}
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2000ms]" />
                  {previewUrl ? (
                    <motion.div 
                      initial={{ scale: 1.2, opacity: 0, filter: 'blur(80px)' }}
                      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                      className="w-full h-full relative"
                    >
                      <img src={previewUrl} className="w-full h-full object-cover transition-all duration-[10000ms] group-hover:scale-125 grayscale-[0.6] group-hover:grayscale-0 brightness-[0.6] group-hover:brightness-100" alt="Preview" />
                      <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-[1500ms] flex flex-col items-center justify-center backdrop-blur-[100px] z-20">
                        <div className="p-32 rounded-[8rem] bg-white/15 border-[6px] border-white/30 mb-24 scale-90 group-hover:scale-125 group-hover:rotate-[20deg] transition-all duration-[1500ms] shadow-[0_100px_250px_rgba(0,0,0,1)] shadow-inner overflow-hidden relative">
                           <div className="absolute inset-0 bg-white/20 blur-[50px]" />
                          <Camera className="text-white drop-shadow-3xl relative z-10" size={240} strokeWidth={0.01} />
                        </div>
                        <span className="text-[28px] font-black uppercase tracking-[2em] text-white drop-shadow-3xl italic">Switch Reflection</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-32 relative z-10">
                      <div className="p-48 rounded-[10rem] bg-white/[0.01] border-4 border-white/5 group-hover:scale-125 group-hover:bg-rose-500/30 group-hover:border-rose-500/60 transition-all duration-[2000ms] shadow-[0_150px_450px_rgba(0,0,0,1)] shadow-inner overflow-hidden relative">
                          <div className="absolute inset-0 bg-rose-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-all" />
                        <Upload className="text-gray-950 group-hover:text-rose-500 group-hover:rotate-[15deg] transition-all duration-[2000ms] drop-shadow-3xl relative z-10" size={320} strokeWidth={0.01} />
                      </div>
                      <div className="space-y-16 text-center">
                        <p className="text-[28px] text-gray-950 font-black uppercase tracking-[1.5em] group-hover:text-rose-500 transition-all duration-[2000ms] italic leading-none drop-shadow-3xl">Drop Reflection</p>
                        <p className="text-[9rem] text-gray-950 font-medium italic opacity-30 group-hover:opacity-100 transition-all duration-[1500ms] font-handwritten">Max size: 10MB</p>
                      </div>
                    </div>
                  )}
                  <input id="modal-file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                {type === 'post' && (
                  <div className="space-y-24 group">
                    <div className="flex items-center justify-between px-[4rem]">
                      <label className="text-[22px] font-black text-gray-950 uppercase tracking-[1.5em] italic leading-none group-focus-within:text-rose-500 transition-all duration-[2000ms] drop-shadow-2xl">The Whisper (Caption)</label>
                      <div className="flex items-center gap-12 opacity-20 group-focus-within:opacity-100 transition-all duration-[2000ms]">
                        <Sparkles size={48} className="text-rose-500 animate-pulse drop-shadow-2xl" strokeWidth={1} />
                        <span className="text-[14px] font-black uppercase tracking-[1em] text-white italic">Soul Script</span>
                      </div>
                    </div>
                    <div className="relative">
                       <div className="absolute top-32 left-32 text-gray-950 group-focus-within:text-rose-500/30 transition-all duration-[2000ms] pointer-events-none drop-shadow-3xl">
                          <Star size={160} strokeWidth={0.01} className="fill-current" />
                       </div>
                      <textarea
                        placeholder="Capture the vibe, the feeling, the shared frequency of this moment..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="input-field min-h-[500px] resize-none pl-[15rem] py-32 pr-32 leading-[1.4] text-[9rem] sm:text-[12rem] font-handwritten italic bg-white/[0.01] border-[6px] border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2500ms] shadow-inner rounded-[10rem] text-white no-scrollbar placeholder:text-gray-950 selection:bg-rose-500/40 drop-shadow-3xl"
                      />
                    </div>
                  </div>
                )}

                <Button
                  isLoading={isUploading}
                  disabled={!selectedImage}
                  onClick={handleUpload}
                  className="w-full gap-[4rem] py-[4rem] text-[10rem] italic tracking-tighter shadow-[0_200px_450px_rgba(244,63,94,1)] relative overflow-hidden group/submit border-none rounded-[10rem] shadow-inner leading-none transition-all duration-[1500ms] active:scale-[0.5]"
                  size="xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2500ms]" />
                  <span className="relative z-10 flex items-center justify-center gap-32">
                    <Heart size={160} strokeWidth={0.01} className={twMerge("transition-all duration-[1500ms] drop-shadow-3xl", selectedImage ? "fill-white scale-125 shadow-[0_0_100px_white]" : "fill-transparent")} />
                    <span className="drop-shadow-3xl">{type === 'post' ? 'Archive Memory' : 'Ignite Story'}</span>
                    <SendHorizontal size={160} strokeWidth={0.01} className="group-hover/submit:translate-x-12 group-hover/submit:-translate-y-6 transition-all duration-[2000ms] drop-shadow-3xl" />
                  </span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
