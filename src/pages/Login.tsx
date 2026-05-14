import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, Sparkles, ShieldCheck, Zap, ArrowRight, User, Fingerprint } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getEmailFromUsername } from '../lib/auth';
import { twMerge } from 'tailwind-merge';

export default function Login() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'magic-link'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    email: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) checkProfile(user.id);
  };

  const checkProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single();
    if (data?.username) navigate('/');
    else navigate('/onboarding');
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let loginEmail = formData.identifier;
      if (!formData.identifier.includes('@')) {
        const email = await getEmailFromUsername(formData.identifier);
        if (!email) throw new Error('Username not found.');
        loginEmail = email;
      }
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: formData.password
      });
      if (loginError) throw loginError;
      if (data.user) checkProfile(data.user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { emailRedirectTo: `${window.location.origin}/onboarding` },
      });
      if (magicError) throw magicError;
      setMessage("Verification link sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-warm-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[100px]" />
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
          <p className="text-warm-500 font-medium">A private sanctuary for your shared journey</p>
        </header>

        <Card className="p-6 sm:p-8">
          <div className="flex gap-2 p-1 bg-warm-50 rounded-xl mb-8">
            <button 
              onClick={() => { setAuthMode('login'); setError(null); setMessage(null); }}
              className={twMerge(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                authMode === 'login' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
              )}
            >
              Reconnect
            </button>
            <button 
              onClick={() => { setAuthMode('magic-link'); setError(null); setMessage(null); }}
              className={twMerge(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                authMode === 'magic-link' ? "bg-white text-charcoal shadow-sm" : "text-warm-400 hover:text-warm-600"
              )}
            >
              New Genesis
            </button>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handlePasswordLogin} 
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Identity</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="Username or Email" 
                        value={formData.identifier}
                        onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                        required
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal placeholder:text-warm-300 focus:bg-white focus:border-rose-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Passphrase</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal placeholder:text-warm-300 focus:bg-white focus:border-rose-200 outline-none transition-all tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Enter Sanctuary
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="magic-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleMagicLink} 
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-3 pl-12 pr-4 text-sm text-charcoal placeholder:text-warm-300 focus:bg-white focus:border-rose-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Magic Link
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {(error || message) && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              {error && <p className="text-rose-600 text-xs font-semibold">{error}</p>}
              {message && <p className="text-emerald-600 text-xs font-semibold">{message}</p>}
            </motion.div>
          )}
        </Card>

        <footer className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warm-400">
            <Fingerprint size={14} />
            Secure Private Access
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
