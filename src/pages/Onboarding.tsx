import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ArrowRight, Heart, Sparkles, User, Quote, Calendar, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<{avatar: boolean, cover: boolean}>({ avatar: false, cover: false });
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    relationship_status: 'In Love',
    favorite_quote: '',
    avatar_url: '',
    cover_url: '',
    anniversary: '',
  });

  const [previews, setPreviews] = useState({
    avatar: '',
    cover: '',
  });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && data.username) {
        navigate('/');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleComplete = async () => {
    if (!formData.username || !formData.display_name || isLoading) return;
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03]" />
      </div>

      <motion.div 
        layout
        className="w-full max-w-xl glass-panel rounded-[3.5rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(244,63,94,0.1)] relative z-10 overflow-hidden border-white/10"
      >
        {/* Progress Tracker */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-500 to-orange-400"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-black uppercase tracking-[0.3em] text-[10px]">
                  <Sparkles size={12} className="animate-pulse" />
                  Genesis
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">Welcome, Soulmate</h1>
                <p className="text-gray-400 font-handwritten text-xl italic opacity-80">Let's craft your identity in our sanctuary...</p>
              </div>

              <div className="space-y-6">
                <OnboardingInput 
                  label="Unique Handle" 
                  icon={Sparkles} 
                  value={formData.username}
                  onChange={(v) => setFormData({...formData, username: v})}
                  placeholder="e.g. moonlight_soul"
                  description="A unique name for the universe to know you."
                />
                <OnboardingInput 
                  label="Display Name" 
                  icon={User} 
                  value={formData.display_name}
                  onChange={(v) => setFormData({...formData, display_name: v})}
                  placeholder="How should I call you?"
                  description="This is how you'll appear to your partner."
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!formData.username || !formData.display_name}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:grayscale transition-all shadow-rose-500/20"
              >
                <span>Continue the Journey</span>
                <ArrowRight size={20} strokeWidth={3} />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-black uppercase tracking-[0.3em] text-[10px]">
                  <ImageIcon size={12} />
                  Visual Soul
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">Your Reflection</h1>
                <p className="text-gray-400 font-handwritten text-xl italic opacity-80">Add colors to your presence...</p>
              </div>

              <div className="space-y-12">
                {/* Cover Upload */}
                <div className="relative h-44 sm:h-52 rounded-[2.5rem] bg-white/[0.03] border-2 border-dashed border-white/10 overflow-hidden group transition-all hover:border-rose-500/30">
                  {previews.cover ? (
                    <img src={previews.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500">
                      <div className="p-4 rounded-full bg-white/5">
                        <ImageIcon size={32} />
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-[0.2em]">Sanctuary Banner</span>
                    </div>
                  )}
                  {isUploading.cover && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 size={32} className="animate-spin text-rose-500" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-[2px]">
                    <div className="p-4 rounded-full bg-white/10 border border-white/20 mb-2">
                      <Camera size={28} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Banner</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                  </label>
                </div>

                {/* Avatar Upload */}
                <div className="flex justify-center -mt-24 sm:-mt-28 relative z-20">
                  <div className="relative group">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[3.5rem] p-1.5 bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="w-full h-full rounded-[3.2rem] border-[6px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                        {previews.avatar ? (
                          <img src={previews.avatar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Avatar" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <User size={64} strokeWidth={1.5} />
                          </div>
                        )}
                        {isUploading.avatar && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 size={32} className="animate-spin text-rose-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="absolute inset-0 bg-black/40 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Camera size={28} className="text-white" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white mt-1">Portrait</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                    </label>
                    <div className="absolute -bottom-2 -right-2 p-3 bg-rose-500 rounded-2xl shadow-xl border-4 border-[#050506] text-white">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 pt-4">
                <button 
                  onClick={prevStep} 
                  className="flex-1 py-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep} 
                  className="btn-primary flex-[2] py-5 text-lg"
                >
                  Almost Home
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-black uppercase tracking-[0.3em] text-[10px]">
                  <Heart size={12} className="animate-pulse" />
                  Eternal Spark
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif glow-text leading-tight">The Final Touch</h1>
                <p className="text-gray-400 font-handwritten text-xl italic opacity-80">Share the essence of your bond...</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Our Narrative (Bio)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="In a few whispers, tell our story..."
                    className="input-field min-h-[120px] resize-none leading-relaxed py-5 text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <OnboardingInput 
                    label="Status" 
                    icon={Heart} 
                    value={formData.relationship_status}
                    onChange={(v) => setFormData({...formData, relationship_status: v})}
                    placeholder="e.g. In Love"
                  />
                  <OnboardingInput 
                    label="Anniversary" 
                    icon={Calendar} 
                    type="date"
                    value={formData.anniversary}
                    onChange={(v) => setFormData({...formData, anniversary: v})}
                  />
                </div>
                <OnboardingInput 
                  label="Our Eternal Quote" 
                  icon={Quote} 
                  value={formData.favorite_quote}
                  onChange={(v) => setFormData({...formData, favorite_quote: v})}
                  placeholder="Words we live by..."
                />
              </div>

              <div className="flex gap-4 sm:gap-6">
                <button 
                  onClick={prevStep} 
                  className="flex-1 py-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete} 
                  disabled={isLoading}
                  className="btn-primary flex-[2] flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
                    <>
                      <span>Enter Sanctuary</span>
                      <Sparkles size={20} fill="white" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function OnboardingInput({ label, icon: Icon, value, onChange, placeholder, type = "text", description }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1 group-focus-within:text-rose-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-600 group-focus-within:text-rose-500 transition-colors">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-14 py-5 text-base sm:text-lg font-medium"
          placeholder={placeholder}
        />
      </div>
      {description && <p className="text-[10px] text-gray-600 italic px-1 opacity-80">{description}</p>}
    </div>
  );
}
