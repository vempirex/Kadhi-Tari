import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Sparkles, User, Fingerprint, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getDummyEmail, isUsernameAvailable } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

type AuthStep = 'username' | 'password';

export default function Login() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [step, setStep] = useState<AuthStep>('username');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (session) {
      if (profile?.username) navigate('/');
      else navigate('/onboarding');
    }
  }, [session, profile, navigate]);

  const handleCheckUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || formData.username.length < 3) {
      setError("Please enter at least 3 characters.");
      return;
    }

    setIsChecking(true);
    setError(null);
    try {
      const available = await isUsernameAvailable(formData.username);
      setIsNewUser(available);
      setStep('password');
    } catch (err: any) {
      setError("Unable to connect to the sanctuary. Please check your signal.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const email = getDummyEmail(formData.username);

    try {
      if (isNewUser) {
        // Create new account
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: formData.password,
          options: {
            data: { username: formData.username }
          }
        });
        if (signUpError) throw signUpError;
        
        // After signup, AuthContext will catch session and redirect to onboarding
      } else {
        // Login existing
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "The passphrase does not match this frequency." : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-warm-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <header className="text-center mb-8 space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-white shadow-premium mb-2">
            <Heart size={32} className="text-rose-600 fill-rose-600" />
          </div>
          <h1 className="text-4xl font-outfit font-bold text-charcoal tracking-tight">Kadhi Tari</h1>
          <p className="text-warm-500 font-medium">Your private sanctuary awaits</p>
        </header>

        <Card className="p-6 sm:p-10 shadow-premium overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'username' ? (
              <motion.form 
                key="username-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCheckUsername}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-charcoal">Choose Your Handle</h2>
                  <p className="text-[10px] text-warm-400 font-bold uppercase tracking-widest">Identify your unique frequency</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Unique Handle</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="e.g. starlight" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                        required
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal placeholder:text-warm-300 focus:bg-white focus:border-rose-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isChecking}>
                  Check Availability <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="password-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleAuth}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600">
                    {isNewUser ? <Sparkles size={18} /> : <ShieldCheck size={18} />}
                    <h2 className="text-xl font-bold text-charcoal">
                      {isNewUser ? "Unclaimed Frequency" : "Welcome Back"}
                    </h2>
                  </div>
                  <p className="text-[10px] text-warm-400 font-bold uppercase tracking-widest">
                    {isNewUser ? "Secure this handle with a passphrase" : "Provide your secret access code"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl border border-warm-100">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-rose-500 shadow-sm">
                      {formData.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-warm-400 uppercase tracking-widest">Current Handle</p>
                      <p className="text-xs font-bold text-charcoal">@{formData.username}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep('username')}
                      className="text-[10px] font-bold text-rose-600 hover:underline px-2"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Passphrase</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type="password" 
                        placeholder="Your secret code" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        autoFocus
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal placeholder:text-warm-300 focus:bg-white focus:border-rose-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {isNewUser ? "Begin Genesis" : "Reconnect Sanctuary"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-3 bg-rose-50 border border-rose-100 rounded-xl"
            >
              <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
            </motion.div>
          )}
        </Card>

        <footer className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warm-400">
            <Fingerprint size={14} />
            Secure Private Access
          </div>
          <div className="flex justify-center gap-6">
            <Zap size={16} className="text-warm-300" />
            <Sparkles size={16} className="text-warm-300" />
            <Heart size={16} className="text-warm-300" />
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
