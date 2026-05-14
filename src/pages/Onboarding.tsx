import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ArrowRight, Heart, Sparkles, User, MapPin, Quote, Calendar, Loader2, Image as ImageIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
        // If profile already exists and has a username, skip onboarding
        navigate('/');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}_${Math.random()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        navigate('/');
      }
    }
    setIsLoading(false);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-300/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        layout
        className="w-full max-w-lg glass-panel rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-rose-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif glow-text">Welcome, Soulmate</h1>
                <p className="text-gray-400 font-handwritten text-xl italic">Let's set up our private universe...</p>
              </div>

              <div className="space-y-6">
                <OnboardingInput 
                  label="Unique Username" 
                  icon={Sparkles} 
                  value={formData.username}
                  onChange={(v) => setFormData({...formData, username: v})}
                  placeholder="e.g. moonlight_soul"
                />
                <OnboardingInput 
                  label="Display Name" 
                  icon={User} 
                  value={formData.display_name}
                  onChange={(v) => setFormData({...formData, display_name: v})}
                  placeholder="How should I call you?"
                />
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.username || !formData.display_name}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif glow-text">Our Visuals</h1>
                <p className="text-gray-400 font-handwritten text-xl italic">Upload your favorite looks...</p>
              </div>

              <div className="space-y-6">
                {/* Cover Upload */}
                <div className="relative h-40 rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden group">
                  {previews.cover ? (
                    <img src={previews.cover} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                      <ImageIcon size={32} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Cover Photo</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                  </label>
                </div>

                {/* Avatar Upload */}
                <div className="flex justify-center -mt-20 relative z-20">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-rose-500 to-orange-400">
                      <div className="w-full h-full rounded-[2.3rem] border-4 border-[#050506] overflow-hidden bg-card-bg">
                        {previews.avatar ? (
                          <img src={previews.avatar} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera size={20} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold">Back</button>
                <button onClick={nextStep} className="btn-primary flex-[2]">Almost There</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif glow-text">The Final Touch</h1>
                <p className="text-gray-400 font-handwritten text-xl italic">Express your heart...</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">About Us</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell our story in a few words..."
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <OnboardingInput 
                    label="Status" 
                    icon={Heart} 
                    value={formData.relationship_status}
                    onChange={(v) => setFormData({...formData, relationship_status: v})}
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
                  label="Our Quote" 
                  icon={Quote} 
                  value={formData.favorite_quote}
                  onChange={(v) => setFormData({...formData, favorite_quote: v})}
                  placeholder="Something romantic..."
                />
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold">Back</button>
                <button 
                  onClick={handleComplete} 
                  disabled={isLoading}
                  className="btn-primary flex-[2] flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Enter Sanctuary'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function OnboardingInput({ label, icon: Icon, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">{label}</label>
      <div className="relative">
        <Icon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-600" size={18} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-12"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
