import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ArrowRight, Heart, Sparkles, User, Calendar, Loader2, Image as ImageIcon, CheckCircle2, Zap, ArrowLeft, Globe, Shield, Sparkle, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
      const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
      if (data?.username) navigate('/');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    reader.readAsDataURL(file);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${type}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('profiles').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);
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

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 sm:p-[4rem] relative overflow-hidden">
      {/* Background Decor - Enhanced Sanctuary Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-40%] left-[-20%] w-[120%] h-[120%] bg-rose-500/[0.15] rounded-full blur-[250px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-40%] right-[-20%] w-[120%] h-[120%] bg-orange-500/[0.12] rounded-full blur-[250px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,6,1)_100%)]" />
      </div>

      <motion.div layout className="w-full max-w-7xl relative z-10">
        <Card className="p-24 sm:p-[6rem] overflow-hidden border-4 border-white/5 relative bg-white/[0.01] shadow-[0_250px_600px_rgba(0,0,0,1)] backdrop-blur-[200px] rounded-[10rem] shadow-inner">
           <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          
          {/* Progress Bar - Cinematic Reimagining */}
          <div className="absolute top-0 left-0 w-full h-8 bg-white/[0.01] shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-rose-950 via-rose-500 to-rose-950 shadow-[0_0_150px_rgba(244,63,94,1)] relative"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
               <div className="absolute top-0 left-0 w-full h-full bg-white/20 blur-[10px]" />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(100px)' }} 
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, scale: 0.9, y: -150, filter: 'blur(100px)' }} 
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-[6rem]"
              >
                <header className="space-y-16 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-10 italic">
                    <Zap size-[5rem] strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
                    Genesis Initiation
                  </div>
                  <h1 className="text-9xl sm:text-[15rem] font-serif glow-text leading-none tracking-tighter italic drop-shadow-3xl">Welcome, Soulmate</h1>
                  <p className="text-gray-800 font-handwritten text-[8rem] sm:text-[11rem] italic opacity-80 leading-none max-w-6xl drop-shadow-2xl">
                    "Every shared frequency needs a name. Let's define your essence in this beautiful shared void..."
                  </p>
                </header>

                <div className="space-y-[4rem]">
                  <div className="space-y-16 group">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic group-focus-within:text-rose-500 transition-all duration-[1500ms] leading-none">Sanctuary Handle</label>
                    <div className="relative">
                      <Sparkles className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/15 group-focus-within:text-rose-500 transition-all duration-[1500ms] drop-shadow-3xl" size-[10rem] strokeWidth={0.01} />
                      <input 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="e.g. starlight_echo"
                        className="input-field py-24 pl-[12rem] text-[9rem] sm:text-[12rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[7rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none shadow-3xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-16 group">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic group-focus-within:text-rose-500 transition-all duration-[1500ms] leading-none">Display Identity</label>
                    <div className="relative">
                      <User className="absolute left-24 top-1/2 -translate-y-1/2 text-blue-500/15 group-focus-within:text-blue-500 transition-all duration-[1500ms] drop-shadow-3xl" size-[10rem] strokeWidth={0.01} />
                      <input 
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        placeholder="e.g. My Infinite"
                        className="input-field py-24 pl-[12rem] text-[9rem] sm:text-[12rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[7rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none shadow-3xl"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.username || !formData.display_name}
                  className="w-full gap-[3rem] py-[4rem] text-[10rem] italic tracking-tighter shadow-[0_150px_350px_rgba(244,63,94,0.7)] relative overflow-hidden group/btn border-none rounded-[10rem] leading-none"
                  size="xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/btn:opacity-100 transition-all duration-[2000ms]" />
                  <span className="relative z-10 flex items-center justify-center gap-24">
                    <span>Forge Identity</span>
                    <ArrowRight size-[10rem] strokeWidth={0.01} className="group-hover/btn:translate-x-12 transition-all duration-[2000ms] drop-shadow-3xl" />
                  </span>
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(100px)' }} 
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, scale: 0.9, y: -150, filter: 'blur(100px)' }} 
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-[6rem]"
              >
                <header className="space-y-16 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-10 italic">
                    <ImageIcon size-[5rem] strokeWidth={1} className="drop-shadow-3xl" />
                    Visual Resonance
                  </div>
                  <h1 className="text-9xl sm:text-[15rem] font-serif glow-text leading-none tracking-tighter italic drop-shadow-3xl">Visual Presence</h1>
                  <p className="text-gray-800 font-handwritten text-[8rem] sm:text-[11rem] italic opacity-80 leading-none max-w-6xl drop-shadow-2xl">
                    "A visual anchor for our shared world. Choose memories that speak when words fail..."
                  </p>
                </header>

                <div className="space-y-[4rem] relative pt-24">
                  {/* Cover Upload - Sanctuary Aesthetics */}
                  <div className="relative h-[45rem] sm:h-[65rem] rounded-[8rem] bg-white/[0.01] border-8 border-dashed border-white/5 overflow-hidden group/cover shadow-[0_200px_500px_rgba(0,0,0,1)] shadow-inner backdrop-blur-[200px]">
                    {previews.cover ? (
                      <img src={previews.cover} className="w-full h-full object-cover group-hover/cover:scale-150 transition-all duration-[12000ms] grayscale-[0.6] group-hover/cover:grayscale-0" alt="Cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-950 opacity-10">
                        <ImageIcon size-[40rem] strokeWidth={0.01} className="drop-shadow-3xl" />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/80 opacity-0 group-hover/cover:opacity-100 transition-all duration-[2000ms] flex flex-col items-center justify-center cursor-pointer backdrop-blur-[150px]">
                      <div className="p-24 rounded-[7rem] bg-white/15 border-4 border-white/30 mb-24 scale-90 group-hover/cover:scale-125 transition-all duration-[2000ms] shadow-[0_80px_150px_rgba(0,0,0,1)] shadow-inner">
                        <Camera size-[12rem] strokeWidth={0.05} className="text-white drop-shadow-3xl" />
                      </div>
                      <span className="text-[24px] font-black uppercase tracking-[2em] text-white italic drop-shadow-3xl">Morph Banner</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                    </label>
                    {isUploading.cover && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-[200px] flex items-center justify-center">
                        <Loader2 size-[15rem] strokeWidth={0.01} className="text-rose-500 animate-spin drop-shadow-3xl" />
                      </div>
                    )}
                  </div>

                  {/* Avatar Upload - Sanctuary Aesthetics */}
                  <div className="flex justify-center -mt-[15rem] sm:-mt-[25rem] relative z-20">
                    <div className="relative group/avatar">
                      <div className="w-[30rem] h-[30rem] sm:w-[50rem] sm:h-[50rem] rounded-[10rem] p-5 bg-gradient-to-tr from-rose-950 via-rose-500 to-orange-950 shadow-[0_200px_450px_rgba(0,0,0,1)] relative shadow-inner overflow-hidden">
                         <div className="absolute inset-0 bg-white/20 blur-[50px] opacity-0 group-hover/avatar:opacity-100 transition-all duration-[2000ms]" />
                        <div className="w-full h-full rounded-[9.5rem] border-[25px] border-[#050506] overflow-hidden bg-[#050506] relative z-10">
                          {previews.avatar ? (
                            <img src={previews.avatar} className="w-full h-full object-cover transition-all duration-[8000ms] group-hover/avatar:scale-150 grayscale-[0.6] group-hover/avatar:grayscale-0" alt="Avatar" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-950 bg-[#050506]">
                              <User size-[35rem] strokeWidth={0.01} className="drop-shadow-3xl" />
                            </div>
                          )}
                        </div>
                        {isUploading.avatar && (
                          <div className="absolute inset-0 bg-black/90 rounded-[10rem] backdrop-blur-[150px] flex items-center justify-center z-20">
                            <Loader2 size-[10rem] strokeWidth={0.01} className="text-rose-500 animate-spin drop-shadow-3xl" />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/85 rounded-[10rem] opacity-0 group-hover/avatar:opacity-100 transition-all duration-[2000ms] flex flex-col items-center justify-center cursor-pointer backdrop-blur-[100px] z-30">
                        <Camera size-[12rem] strokeWidth={0.05} className="text-white drop-shadow-3xl" />
                        <span className="text-[20px] text-white font-black uppercase tracking-[1.5em] mt-16 italic drop-shadow-3xl">Portrait</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-32">
                  <Button onClick={() => setStep(1)} className="flex-1 py-24 rounded-[7rem] border-4 border-white/5 bg-white/[0.01] hover:bg-white/[0.08] text-7xl italic tracking-tighter shadow-inner transition-all duration-[1500ms] active:scale-[0.5]">
                    <ArrowLeft size-[8rem] strokeWidth={0.01} className="mr-12 drop-shadow-3xl" />
                    Back
                  </Button>
                  <Button className="flex-[2] py-24 rounded-[7rem] text-[8rem] italic tracking-tighter shadow-[0_150px_350px_rgba(244,63,94,0.7)] relative overflow-hidden group/next border-none leading-none shadow-inner" onClick={() => setStep(3)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/next:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-24">
                      Continue the Sync
                      <ArrowRight size-[8rem] strokeWidth={0.01} className="group-hover/next:translate-x-12 transition-all duration-[2000ms] drop-shadow-3xl" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, scale: 0.9, y: 150, filter: 'blur(100px)' }} 
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, scale: 0.9, y: -150, filter: 'blur(100px)' }} 
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-[6rem]"
              >
                <header className="space-y-16 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] mb-10 italic">
                    <Heart size-[5rem] strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
                    Emotional Anchoring
                  </div>
                  <h1 className="text-9xl sm:text-[15rem] font-serif glow-text leading-none tracking-tighter italic drop-shadow-3xl">Final Frequency</h1>
                  <p className="text-gray-800 font-handwritten text-[8rem] sm:text-[11rem] italic opacity-80 leading-none max-w-6xl drop-shadow-2xl">
                    "The finishing strokes on our shared masterpiece. Define the depth of our connection..."
                  </p>
                </header>

                <div className="space-y-[4rem]">
                  <div className="space-y-16 group">
                    <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 group-focus-within:text-rose-500 transition-all duration-[1500ms] italic leading-none">Our Collective Saga (Bio)</label>
                    <textarea 
                      className="input-field min-h-[500px] py-32 px-32 resize-none text-[8rem] sm:text-[10rem] font-handwritten italic bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] leading-[1.4] shadow-inner text-white no-scrollbar placeholder:text-gray-950 selection:bg-rose-500/40 rounded-[8rem] drop-shadow-3xl" 
                      placeholder="Whisper the essence of our journey... Why does this frequency exist?"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-32">
                    <div className="space-y-16 group">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic group-focus-within:text-rose-500 transition-all duration-[1500ms] leading-none">Resonance Status</label>
                      <div className="relative">
                        <Heart className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/15 group-focus-within:text-rose-500 transition-all duration-[1500ms] drop-shadow-3xl" size-[10rem] strokeWidth={0.01} />
                        <input value={formData.relationship_status} onChange={(e) => setFormData({...formData, relationship_status: e.target.value})} className="input-field py-24 pl-[12rem] text-[8rem] sm:text-[10rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[7rem] italic text-white placeholder:text-gray-950 selection:bg-rose-500/40 leading-none shadow-3xl" />
                      </div>
                    </div>
                    <div className="space-y-16 group">
                      <label className="text-[20px] font-black text-gray-950 uppercase tracking-[2em] px-16 italic group-focus-within:text-rose-500 transition-all duration-[1500ms] leading-none">Genesis Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-24 top-1/2 -translate-y-1/2 text-blue-500/15 group-focus-within:text-blue-500 transition-all duration-[1500ms] drop-shadow-3xl" size-[10rem] strokeWidth={0.01} />
                        <input type="date" value={formData.anniversary} onChange={(e) => setFormData({...formData, anniversary: e.target.value})} className="input-field py-24 pl-[12rem] text-[7rem] sm:text-[9rem] font-serif bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[7rem] italic text-white selection:bg-rose-500/40 leading-none shadow-3xl" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-32 pt-24">
                  <Button onClick={() => setStep(2)} className="flex-1 py-24 rounded-[7rem] border-4 border-white/5 bg-white/[0.01] hover:bg-white/[0.08] text-[7rem] italic tracking-tighter shadow-inner transition-all duration-[1500ms] active:scale-[0.5]">
                    <ArrowLeft size-[8rem] strokeWidth={0.01} className="mr-12 drop-shadow-3xl" />
                    Back
                  </Button>
                  <Button 
                    className="flex-[2] py-24 rounded-[7rem] text-[10rem] italic tracking-tighter shadow-[0_200px_450px_rgba(244,63,94,0.7)] relative overflow-hidden group/finish border-none leading-none shadow-inner" 
                    isLoading={isLoading} 
                    onClick={handleComplete}
                    size="xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/finish:opacity-100 transition-all duration-[2000ms]" />
                    <span className="relative z-10 flex items-center justify-center gap-24">
                      <span>Initialize Sanctuary</span>
                      <CheckCircle2 size-[12rem] strokeWidth={0.01} className="group-hover/finish:scale-125 transition-all duration-[2000ms] shadow-[0_0_150px_white] drop-shadow-3xl" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
