/**
 * UPDATED ONBOARDING - STABLE PROFILE COMPLETION
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Camera, Heart, Sparkles, User, Calendar, 
  ImageIcon, MapPin, CheckCircle2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

type Step = 'essence' | 'visuals' | 'chronos';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>('essence');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<{avatar: boolean, cover: boolean}>({ avatar: false, cover: false });
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
  });

  const [previews, setPreviews] = useState({
    avatar: '',
    cover: '',
  });

  // Pre-fill existing data to prevent blanking on refresh
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        cover_url: profile.cover_url || '',
        relationship_status: profile.relationship_status || 'In Harmony',
        anniversary: profile.anniversary || '',
        birthday: profile.birthday || '',
        location: profile.location || '',
      }));
      if (profile.avatar_url) setPreviews(p => ({ ...p, avatar: profile.avatar_url }));
      if (profile.cover_url) setPreviews(p => ({ ...p, cover: profile.cover_url }));
    }
  }, [profile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${type}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('profiles').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, [`${type}_url`]: publicUrl }));
      setPreviews(prev => ({ ...prev, [type]: publicUrl }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleComplete = async () => {
    if (!formData.full_name) {
      setError("Your full name is required to personalize your sanctuary.");
      setStep('essence');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error("Authentication session lost. Please log in again.");

      console.log("Saving final profile data...");
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          display_name: formData.display_name || formData.full_name,
          bio: formData.bio,
          relationship_status: formData.relationship_status,
          favorite_quote: formData.favorite_quote,
          avatar_url: formData.avatar_url,
          cover_url: formData.cover_url,
          anniversary: formData.anniversary || null,
          birthday: formData.birthday || null,
          location: formData.location,
          profile_completed: true, // THE CRITICAL FLAG
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      console.log("Profile stabilized. Synchronizing state...");
      await refreshProfile();
      
      // Final hard-navigation to ensure all guards see the new state
      window.location.replace('/');
    } catch (err: any) {
      console.error("Save failure:", err);
      setError(err.message || "Failed to finalize profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-100/30 rounded-full blur-[120px]" />
      </div>

      <motion.div layout className="w-full max-w-2xl relative z-10">
        <Card className="p-6 sm:p-10 shadow-premium overflow-hidden">
          <div className="mb-10 text-center">
            <Heart size={32} className="text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-outfit font-bold text-charcoal">Complete Your Profile</h1>
            <p className="text-sm text-warm-500">Your final steps before entering the sanctuary</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8 px-2">
            {(['essence', 'visuals', 'chronos'] as Step[]).map((s, i) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-warm-100">
                <motion.div 
                  className="h-full bg-rose-500"
                  initial={false}
                  animate={{ width: (['essence', 'visuals', 'chronos'] as Step[]).indexOf(step) >= i ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            {step === 'essence' && (
              <motion.div 
                key="essence" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
                    <Sparkles size={16} /> Essence Definition
                  </div>
                  <h2 className="text-2xl font-outfit font-bold text-charcoal">Who are you?</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="e.g. Vijay Kumar"
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Nickname</label>
                    <input 
                      value={formData.display_name}
                      onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                      placeholder="e.g. VJ"
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Your Story (Bio)</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Briefly share your presence..."
                    className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all min-h-[100px] resize-none"
                  />
                </div>

                <Button onClick={() => setStep('visuals')} disabled={!formData.full_name} className="w-full">
                  Continue to Visuals <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 'visuals' && (
              <motion.div 
                key="visuals" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
                    <ImageIcon size={16} /> Visual Resonance
                  </div>
                  <h2 className="text-2xl font-outfit font-bold text-charcoal">Show Your Light</h2>
                </div>

                <div className="space-y-6">
                  {/* Cover Upload */}
                  <div className="relative h-40 rounded-2xl bg-warm-50 border border-dashed border-warm-200 overflow-hidden group/cover">
                    {previews.cover ? (
                      <img src={previews.cover} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-warm-300">
                        <ImageIcon size={32} />
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Banner Image</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/cover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera size={24} className="text-white mb-2" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                    </label>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex justify-center -mt-20 relative z-10">
                    <div className="relative group/avatar">
                      <div className="w-36 h-36 rounded-full bg-white p-1 shadow-premium overflow-hidden">
                        <div className="w-full h-full rounded-full bg-warm-50 overflow-hidden flex items-center justify-center border border-warm-100">
                          {previews.avatar ? (
                            <img src={previews.avatar} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <User size={48} className="text-warm-200" />
                          )}
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
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </Button>
                  <Button onClick={() => setStep('chronos')} className="flex-[2]">
                    Next Step <ArrowRight size={16} className="ml-2" />
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
                className="space-y-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 uppercase tracking-widest text-[10px] font-bold">
                    <Calendar size={16} /> Journey Rhythm
                  </div>
                  <h2 className="text-2xl font-outfit font-bold text-charcoal">Sacred Dates</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Anniversary</label>
                    <input type="date" value={formData.anniversary} onChange={(e) => setFormData({...formData, anniversary: e.target.value})} className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Birthday</label>
                    <input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 px-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300" size={18} />
                    <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Where you reside..." className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep('visuals')} className="flex-1">
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    isLoading={isLoading}
                    className="flex-[2]"
                  >
                    Enter Sanctuary <CheckCircle2 size={16} className="ml-2" />
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
