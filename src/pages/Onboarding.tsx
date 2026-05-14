import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ArrowRight, Heart, Sparkles, User, Calendar, Loader2, Image as ImageIcon, CheckCircle2, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-rose-500/10 rounded-full blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div layout className="w-full max-w-3xl relative z-10">
        <Card className="p-10 sm:p-16 overflow-hidden border-white/5 relative bg-white/[0.01] shadow-[0_50px_120px_rgba(0,0,0,0.5)]">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-white/[0.02]">
            <motion.div 
              className="h-full bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -20 }} 
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <header className="space-y-4 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
                    <Zap size={12} className="animate-pulse" />
                    Genesis Initiation
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Welcome, Soulmate</h1>
                  <p className="text-gray-400 font-handwritten text-2xl italic opacity-80 leading-relaxed max-w-xl">
                    "Every frequency needs a name. Let's define your essence in this shared void..."
                  </p>
                </header>

                <div className="space-y-8">
                  <Input 
                    label="Sanctuary Handle" 
                    icon={Sparkles} 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="e.g. starlight_echo"
                    className="py-6 text-lg"
                  />
                  <Input 
                    label="Display Identity" 
                    icon={User} 
                    value={formData.display_name}
                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                    placeholder="e.g. My Infinite"
                    className="py-6 text-lg"
                  />
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.username || !formData.display_name}
                  className="w-full gap-4 py-8 text-xl tracking-tight shadow-[0_20px_50px_rgba(244,63,94,0.3)]"
                  size="xl"
                >
                  <span>Forge Identity</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -20 }} 
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <header className="space-y-4 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
                    <ImageIcon size={12} />
                    Visual Resonance
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">Visual Presence</h1>
                </header>

                <div className="space-y-12 relative pt-8">
                  <div className="relative h-56 sm:h-64 rounded-[3.5rem] bg-white/[0.02] border-2 border-dashed border-white/5 overflow-hidden group shadow-2xl">
                    {previews.cover && <img src={previews.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Cover" />}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                      <div className="p-5 rounded-full bg-white/10 border border-white/20 mb-4 scale-90 group-hover:scale-100 transition-transform duration-500">
                        <Camera size={32} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Project Banner</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                    </label>
                  </div>

                  <div className="flex justify-center -mt-32 relative z-20">
                    <div className="relative group/avatar">
                      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-[4rem] p-1.5 bg-gradient-to-tr from-rose-500 to-orange-400 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                        <div className="w-full h-full rounded-[3.8rem] border-[8px] border-[#050506] overflow-hidden bg-[#0a0a0c]">
                          {previews.avatar ? (
                            <img src={previews.avatar} className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110" alt="Avatar" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-800 bg-[#050506]">
                              <User size={80} strokeWidth={1} />
                            </div>
                          )}
                        </div>
                      </div>
                      <label className="absolute inset-0 bg-black/60 rounded-[4rem] opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                        <Camera size={32} className="text-white" />
                        <span className="text-[8px] text-white font-black uppercase tracking-[0.4em] mt-2">Portrait</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <Button variant="glass" className="flex-1 py-7" onClick={() => setStep(1)}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                  </Button>
                  <Button className="flex-[2] py-7 text-lg tracking-tight shadow-[0_15px_40px_rgba(244,63,94,0.2)]" onClick={() => setStep(3)}>
                    Continue the Sync
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: -20 }} 
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <header className="space-y-4 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
                    <Heart size={12} className="animate-pulse" />
                    Emotional Anchoring
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">The Final Frequency</h1>
                </header>

                <div className="space-y-8">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-1 group-focus-within:text-rose-400 transition-colors">Our Collective Saga (Bio)</label>
                    <textarea 
                      className="input-field min-h-[160px] py-7 px-8 resize-none text-lg font-medium bg-white/[0.02] border-white/5 focus:bg-rose-500/[0.02] focus:border-rose-500/30 transition-all duration-500 leading-relaxed" 
                      placeholder="Whisper the essence of our journey..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Input label="Resonance Status" icon={Heart} value={formData.relationship_status} onChange={(e) => setFormData({...formData, relationship_status: e.target.value})} className="py-6" />
                    <Input label="Genesis Date" icon={Calendar} type="date" value={formData.anniversary} onChange={(e) => setFormData({...formData, anniversary: e.target.value})} className="py-6" />
                  </div>
                </div>

                <div className="flex gap-6 pt-4">
                  <Button variant="glass" className="flex-1 py-7" onClick={() => setStep(2)}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                  </Button>
                  <Button 
                    className="flex-[2] py-7 text-xl tracking-tight shadow-[0_25px_60px_rgba(244,63,94,0.3)] relative overflow-hidden group" 
                    isLoading={isLoading} 
                    onClick={handleComplete}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Initialize Sanctuary <CheckCircle2 size={24} />
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
