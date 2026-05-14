import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Camera, ArrowRight, Heart, Sparkles, User, Calendar, 
  Loader2, Image as ImageIcon, CheckCircle2, Zap, 
  ArrowLeft, Globe, Shield, Fingerprint, Lock, 
  Check, X, MapPin, Quote, Smile 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { isUsernameAvailable } from '../lib/auth';

type Step = 'identity' | 'essence' | 'visuals' | 'chronos';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('identity');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'none'>('none');
  const [isUploading, setIsUploading] = useState<{avatar: boolean, cover: boolean}>({ avatar: false, cover: false });

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    display_name: '',
    full_name: '',
    bio: '',
    relationship_status: 'In Harmony',
    favorite_quote: '',
    avatar_url: '',
    cover_url: '',
    anniversary: '',
    birthday: '',
    location: '',
    interests: '',
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

  const checkUsername = async (val: string) => {
    if (val.length < 3) {
      setUsernameStatus('none');
      return;
    }
    setIsCheckingUsername(true);
    const available = await isUsernameAvailable(val);
    setUsernameStatus(available ? 'available' : 'taken');
    setIsCheckingUsername(false);
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
    if (!formData.username || !formData.full_name || isLoading) return;
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Update Password in Auth
        if (formData.password) {
          const { error: pwdError } = await supabase.auth.updateUser({ password: formData.password });
          if (pwdError) throw pwdError;
        }

        // 2. Save Profile Data
        const { error } = await supabase
          .from('profiles')
          .update({
            username: formData.username,
            display_name: formData.display_name || formData.full_name,
            full_name: formData.full_name,
            bio: formData.bio,
            relationship_status: formData.relationship_status,
            favorite_quote: formData.favorite_quote,
            avatar_url: formData.avatar_url,
            cover_url: formData.cover_url,
            anniversary: formData.anniversary,
            birthday: formData.birthday,
            location: formData.location,
            interests: formData.interests,
            email: user.email,
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

  const stepInfo = {
    identity: { title: 'Security & Identity', desc: 'Secure your sanctuary entry' },
    essence: { title: 'Profile Essence', desc: 'Define your shared identity' },
    visuals: { title: 'Visual Resonance', desc: 'The aesthetic of your soul' },
    chronos: { title: 'Chronos & Connection', desc: 'The rhythm of your journey' }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-40%] left-[-20%] w-[120%] h-[120%] bg-rose-500/[0.05] rounded-full blur-[250px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,1)_100%)]" />
      </div>

      <motion.div layout className="w-full max-w-5xl relative z-10">
        <Card variant="glass" className="p-12 sm:p-24 overflow-hidden border-white/5 bg-white/[0.01] backdrop-blur-[150px] rounded-[6rem] shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex gap-4 mb-16 px-4">
            {(['identity', 'essence', 'visuals', 'chronos'] as Step[]).map((s, i) => (
              <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
                <motion.div 
                  className="h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                  initial={false}
                  animate={{ width: (['identity', 'essence', 'visuals', 'chronos'] as Step[]).indexOf(step) >= i ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'identity' && (
              <motion.div 
                key="identity" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                <header className="space-y-4">
                  <div className="flex items-center gap-4 text-rose-500 uppercase tracking-[0.5em] text-[12px] font-black italic">
                    <Shield size={32} />
                    {stepInfo.identity.title}
                  </div>
                  <h1 className="text-7xl font-serif italic text-white leading-tight">Secure Your Presence</h1>
                  <p className="text-gray-400 text-3xl font-handwritten italic opacity-60">{stepInfo.identity.desc}</p>
                </header>

                <div className="space-y-12 py-8">
                  <div className="space-y-4 group">
                    <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Choose a unique handle</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-16 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-rose-500/40" size={48} strokeWidth={1} />
                      <input 
                        value={formData.username}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          setFormData({...formData, username: val});
                          checkUsername(val);
                        }}
                        placeholder="starlight_echo"
                        className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[4rem] py-16 pl-40 pr-16 text-5xl text-white placeholder:text-white/5 focus:border-rose-500/30 transition-all outline-none font-serif italic"
                      />
                      <div className="absolute right-16 top-1/2 -translate-y-1/2 flex items-center gap-4">
                        {isCheckingUsername && <Loader2 size={32} className="animate-spin text-rose-500/40" />}
                        {usernameStatus === 'available' && <Check size={32} className="text-emerald-500" />}
                        {usernameStatus === 'taken' && <X size={32} className="text-rose-500" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 group">
                    <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Establish a passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-16 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-rose-500/40" size={48} strokeWidth={1} />
                      <input 
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="The sacred words"
                        className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[4rem] py-16 pl-40 pr-16 text-5xl text-white placeholder:text-white/5 focus:border-rose-500/30 transition-all outline-none font-serif italic tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep('essence')}
                  disabled={!formData.username || !formData.password || usernameStatus !== 'available'}
                  className="w-full py-16 text-5xl rounded-[4rem]"
                  size="xl"
                >
                  Confirm Identity <ArrowRight className="ml-8" />
                </Button>
              </motion.div>
            )}

            {step === 'essence' && (
              <motion.div 
                key="essence" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                <header className="space-y-4">
                  <div className="flex items-center gap-4 text-blue-500 uppercase tracking-[0.5em] text-[12px] font-black italic">
                    <Sparkles size={32} />
                    {stepInfo.essence.title}
                  </div>
                  <h1 className="text-7xl font-serif italic text-white leading-tight">Define Your Essence</h1>
                  <p className="text-gray-400 text-3xl font-handwritten italic opacity-60">{stepInfo.essence.desc}</p>
                </header>

                <div className="space-y-12 py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-blue-500/60 transition-colors">Real Name</label>
                      <input 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Celestial Name"
                        className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 px-12 text-4xl text-white placeholder:text-white/5 focus:border-blue-500/30 transition-all outline-none italic"
                      />
                    </div>
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-blue-500/60 transition-colors">Sanctuary Nickname</label>
                      <input 
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        placeholder="How I call you"
                        className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 px-12 text-4xl text-white placeholder:text-white/5 focus:border-blue-500/30 transition-all outline-none italic"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 group">
                    <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-blue-500/60 transition-colors">Personal Saga (Bio)</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="The story of our shared rhythm..."
                      className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 px-12 text-4xl text-white placeholder:text-white/5 focus:border-blue-500/30 transition-all outline-none italic min-h-[150px] resize-none"
                    />
                  </div>

                  <div className="space-y-4 group">
                    <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-blue-500/60 transition-colors">Shared Frequency (Quote)</label>
                    <div className="relative">
                      <Quote className="absolute left-12 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                      <input 
                        value={formData.favorite_quote}
                        onChange={(e) => setFormData({...formData, favorite_quote: e.target.value})}
                        placeholder="A verse that resonates..."
                        className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 pl-24 pr-12 text-4xl text-white placeholder:text-white/5 focus:border-blue-500/30 transition-all outline-none italic"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-8">
                  <Button variant="glass" onClick={() => setStep('identity')} className="flex-1 py-12 text-4xl rounded-[3rem]">
                    <ArrowLeft size={32} />
                  </Button>
                  <Button onClick={() => setStep('visuals')} disabled={!formData.full_name} className="flex-[3] py-12 text-4xl rounded-[3rem]">
                    Continue Resonance <ArrowRight className="ml-8" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'visuals' && (
              <motion.div 
                key="visuals" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                <header className="space-y-4">
                  <div className="flex items-center gap-4 text-emerald-500 uppercase tracking-[0.5em] text-[12px] font-black italic">
                    <ImageIcon size={32} />
                    {stepInfo.visuals.title}
                  </div>
                  <h1 className="text-7xl font-serif italic text-white leading-tight">Visual Resonance</h1>
                  <p className="text-gray-400 text-3xl font-handwritten italic opacity-60">{stepInfo.visuals.desc}</p>
                </header>

                <div className="space-y-12 py-8 relative">
                  <div className="relative h-64 rounded-[4rem] bg-white/[0.02] border-4 border-dashed border-white/5 overflow-hidden group/cover">
                    {previews.cover ? (
                      <img src={previews.cover} className="w-full h-full object-cover grayscale-[0.5] group-hover/cover:grayscale-0 transition-all duration-[3000ms]" alt="Cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/5">
                        <ImageIcon size={128} strokeWidth={0.05} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                      <Camera size={64} className="text-white/60 mb-4" />
                      <span className="text-[12px] font-black uppercase tracking-widest italic text-white/60">Choose Banner</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                    </label>
                    {isUploading.cover && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 size={48} className="animate-spin text-emerald-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center -mt-32 relative z-10">
                    <div className="relative group/avatar">
                      <div className="w-64 h-64 rounded-[4rem] bg-gradient-to-tr from-rose-500 to-emerald-500 p-1 shadow-2xl relative overflow-hidden">
                        <div className="w-full h-full rounded-[3.8rem] bg-black overflow-hidden flex items-center justify-center">
                          {previews.avatar ? (
                            <img src={previews.avatar} className="w-full h-full object-cover grayscale-[0.5] group-hover/avatar:grayscale-0 transition-all duration-[2000ms]" alt="Avatar" />
                          ) : (
                            <User size={128} strokeWidth={0.05} className="text-white/5" />
                          )}
                        </div>
                        {isUploading.avatar && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 size={48} className="animate-spin text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/60 rounded-[4rem] opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                        <Camera size={48} className="text-white/60" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8">
                  <Button variant="glass" onClick={() => setStep('essence')} className="flex-1 py-12 text-4xl rounded-[3rem]">
                    <ArrowLeft size={32} />
                  </Button>
                  <Button onClick={() => setStep('chronos')} className="flex-[3] py-12 text-4xl rounded-[3rem]">
                    The Rhythm of Time <ArrowRight className="ml-8" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'chronos' && (
              <motion.div 
                key="chronos" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                <header className="space-y-4">
                  <div className="flex items-center gap-4 text-rose-500 uppercase tracking-[0.5em] text-[12px] font-black italic">
                    <Calendar size={32} />
                    {stepInfo.chronos.title}
                  </div>
                  <h1 className="text-7xl font-serif italic text-white leading-tight">The Rhythm of Time</h1>
                  <p className="text-gray-400 text-3xl font-handwritten italic opacity-60">{stepInfo.chronos.desc}</p>
                </header>

                <div className="space-y-12 py-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Our Genesis (Anniversary)</label>
                      <div className="relative">
                        <Heart className="absolute left-12 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                        <input 
                          type="date"
                          value={formData.anniversary}
                          onChange={(e) => setFormData({...formData, anniversary: e.target.value})}
                          className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 pl-24 pr-12 text-4xl text-white focus:border-rose-500/30 transition-all outline-none italic"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Your Solar Genesis (Birthday)</label>
                      <div className="relative">
                        <Smile className="absolute left-12 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                        <input 
                          type="date"
                          value={formData.birthday}
                          onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                          className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 pl-24 pr-12 text-4xl text-white focus:border-rose-500/30 transition-all outline-none italic"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Physical Coordinates (Location)</label>
                      <div className="relative">
                        <MapPin className="absolute left-12 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                        <input 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Where you breathe..."
                          className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 pl-24 pr-12 text-4xl text-white placeholder:text-white/5 focus:border-rose-500/30 transition-all outline-none italic"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 group">
                      <label className="text-[14px] font-black text-white/20 uppercase tracking-widest italic group-focus-within:text-rose-500/60 transition-colors">Spiritual Echoes (Interests)</label>
                      <div className="relative">
                        <Globe className="absolute left-12 top-1/2 -translate-y-1/2 text-white/10" size={32} />
                        <input 
                          value={formData.interests}
                          onChange={(e) => setFormData({...formData, interests: e.target.value})}
                          placeholder="Art, Music, Souls..."
                          className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[3rem] py-12 pl-24 pr-12 text-4xl text-white placeholder:text-white/5 focus:border-rose-500/30 transition-all outline-none italic"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8">
                  <Button variant="glass" onClick={() => setStep('visuals')} className="flex-1 py-12 text-4xl rounded-[3rem]">
                    <ArrowLeft size={32} />
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    isLoading={isLoading}
                    className="flex-[3] py-12 text-4xl rounded-[3rem] shadow-[0_20px_50px_rgba(244,63,94,0.3)]"
                  >
                    Initialize Sanctuary <CheckCircle2 className="ml-8" />
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
