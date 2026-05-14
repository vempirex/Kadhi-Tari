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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    if (val.length < 3) {
      setUsernameStatus('none');
      return;
    }
    setIsCheckingUsername(true);
    try {
      const available = await isUsernameAvailable(val);
      setUsernameStatus(available ? 'available' : 'taken');
    } catch (err: any) {
      console.error("Username check error:", err);
      setUsernameStatus('none');
      setError("Unable to verify handle availability. Please check your connection.");
    } finally {
      setIsCheckingUsername(false);
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
    if (!formData.username || !formData.full_name || isLoading) return;
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (formData.password) {
          const { error: pwdError } = await supabase.auth.updateUser({ password: formData.password });
          if (pwdError) throw pwdError;
        }

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
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
          });

        if (error) throw error;
        
        // Force a full refresh to clear any cached AuthGuard states
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-100/40 rounded-full blur-[120px]" />
      </div>

      <motion.div layout className="w-full max-w-2xl relative z-10">
        <Card className="p-6 sm:p-10 shadow-premium">
          <div className="flex gap-2 mb-8 px-2">
            {(['identity', 'essence', 'visuals', 'chronos'] as Step[]).map((s, i) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-warm-100">
                <motion.div 
                  className="h-full bg-rose-500"
                  initial={false}
                  animate={{ width: (['identity', 'essence', 'visuals', 'chronos'] as Step[]).indexOf(step) >= i ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'identity' && (
              <motion.div 
                key="identity" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
                    <Shield size={16} />
                    Identity Setup
                  </div>
                  <h1 className="text-3xl font-outfit font-bold text-charcoal">Secure Your Account</h1>
                  <p className="text-warm-500 text-sm font-medium">Create your unique access frequency</p>
                </header>

                <div className="space-y-4 py-2">
                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Unique Handle</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        value={formData.username}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          setFormData({...formData, username: val});
                          checkUsername(val);
                        }}
                        placeholder="e.g. starlight_echo"
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isCheckingUsername && <Loader2 size={16} className="animate-spin text-warm-300" />}
                        {usernameStatus === 'available' && <Check size={16} className="text-emerald-500" />}
                        {usernameStatus === 'taken' && <X size={16} className="text-rose-500" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Your secret code"
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-12 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-300 hover:text-charcoal transition-all"
                      >
                        {showPassword ? <X size={16} /> : <Smile size={16} />}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                      {formData.password && formData.password.length < 6 && (
                        <p className="text-rose-500 text-[10px] font-semibold">Passphrase must be at least 6 characters</p>
                      )}
                      {formData.username.length > 0 && formData.username.length < 3 && (
                        <p className="text-amber-600 text-[10px] font-semibold">Username must be at least 3 characters</p>
                      )}
                      {usernameStatus === 'taken' && (
                        <p className="text-rose-500 text-[10px] font-semibold">This handle is already claimed</p>
                      )}
                      {usernameStatus === 'available' && formData.password.length >= 6 && (
                        <p className="text-emerald-500 text-[10px] font-semibold">Identity looks perfect</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => setStep('essence')}
                    disabled={!formData.username || formData.username.length < 3 || !formData.password || formData.password.length < 6 || usernameStatus !== 'available' || isCheckingUsername}
                    className="w-full"
                  >
                    {isCheckingUsername ? "Checking Handle..." : "Establish Identity"}
                  </Button>
                  
                  {(!formData.username || formData.username.length < 3 || !formData.password || formData.password.length < 6 || usernameStatus !== 'available') && (
                    <p className="text-center text-[9px] text-warm-400 font-bold uppercase tracking-widest">
                      Requirements: 3+ character handle & 6+ character passphrase
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'essence' && (
              <motion.div 
                key="essence" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 uppercase tracking-widest text-[10px] font-bold">
                    <Sparkles size={16} />
                    Essence Definition
                  </div>
                  <h1 className="text-3xl font-outfit font-bold text-charcoal">Define Your Presence</h1>
                </header>

                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Your full name"
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Nickname</label>
                      <input 
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        placeholder="How you want to be called"
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Share a little bit about yourself..."
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep('identity')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep('visuals')} disabled={!formData.full_name} className="flex-[2]">
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'visuals' && (
              <motion.div 
                key="visuals" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-600 uppercase tracking-widest text-[10px] font-bold">
                    <ImageIcon size={16} />
                    Visual Pulse
                  </div>
                  <h1 className="text-3xl font-outfit font-bold text-charcoal">Visual Resonance</h1>
                </header>

                <div className="space-y-4 py-2 relative">
                  <div className="relative h-40 rounded-2xl bg-warm-50 border border-dashed border-warm-200 overflow-hidden group/cover">
                    {previews.cover && <img src={previews.cover} className="w-full h-full object-cover" alt="Cover" />}
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/cover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera size={24} className="text-white mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Change Banner</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                    </label>
                  </div>

                  <div className="flex justify-center -mt-20 relative z-10">
                    <div className="relative group/avatar">
                      <div className="w-36 h-36 rounded-full bg-white p-1 shadow-premium relative overflow-hidden">
                        <div className="w-full h-full rounded-full bg-warm-50 overflow-hidden flex items-center justify-center border border-warm-100">
                          {previews.avatar ? <img src={previews.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <User size={48} className="text-warm-200" />}
                        </div>
                      </div>
                      <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                        <Camera size={20} className="text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep('essence')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep('chronos')} className="flex-[2]">
                    Almost there
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'chronos' && (
              <motion.div 
                key="chronos" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <header className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
                    <Calendar size={16} />
                    Journey Rhythm
                  </div>
                  <h1 className="text-3xl font-outfit font-bold text-charcoal">The Sacred Rhythm</h1>
                </header>

                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Anniversary</label>
                      <input type="date" value={formData.anniversary} onChange={(e) => setFormData({...formData, anniversary: e.target.value})} className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Birthday</label>
                      <input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Location</label>
                    <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Where you reside..." className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep('visuals')} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    isLoading={isLoading}
                    className="flex-[2]"
                  >
                    Enter Sanctuary
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
