import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, Sparkles, ShieldCheck, Zap, Globe, Fingerprint, Key, ArrowRight, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getEmailFromUsername } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identifier: '', // username or email
    password: '',
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let loginEmail = formData.identifier;

      // If identifier doesn't look like an email, try to look up email by username
      if (!formData.identifier.includes('@')) {
        const email = await getEmailFromUsername(formData.identifier);
        if (!email) {
          throw new Error('Username not found. Please use your email or check your username.');
        }
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

  const handleGoogleSignup = async () => {
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/onboarding` }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-black selection:bg-rose-500/30">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-15%] w-[90%] h-[90%] bg-rose-500/[0.08] rounded-full blur-[220px] animate-pulse" />
        <div className="absolute bottom-[-25%] right-[-15%] w-[90%] h-[90%] bg-orange-500/[0.05] rounded-full blur-[220px] animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl relative z-10"
      >
        <header className="text-center mb-16 space-y-8">
          <div className="inline-flex p-12 rounded-[3rem] bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-3xl mb-8 group">
            <Heart size={64} fill="currentColor" className="text-rose-500 group-hover:scale-110 transition-transform duration-700" />
          </div>
          <h1 className="text-8xl sm:text-[10rem] font-serif tracking-tight italic leading-none text-white drop-shadow-2xl">Kadhi Tari</h1>
          <p className="text-gray-400 font-handwritten text-4xl sm:text-6xl italic opacity-60">A sanctuary for our shared frequencies</p>
        </header>

        <Card variant="glass" className="p-12 sm:p-24 border-white/5 shadow-[0_100px_300px_rgba(0,0,0,0.8)] backdrop-blur-[120px] rounded-[6rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
          
          <div className="space-y-16 py-8">
            <div className="space-y-12">
              <h2 className="text-6xl font-serif italic text-white/90 px-8">Identify Yourself</h2>
              <form onSubmit={handleAuth} className="space-y-12 px-4">
                <div className="space-y-4 group">
                  <div className="relative">
                    <User className="absolute left-16 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-500/60 transition-colors duration-500" size={56} strokeWidth={1} />
                    <input 
                      type="text" 
                      placeholder="Username or Email" 
                      value={formData.identifier}
                      onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                      required
                      className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[4rem] py-16 pl-40 pr-16 text-5xl text-white placeholder:text-white/10 focus:border-rose-500/30 focus:bg-white/[0.05] transition-all duration-700 outline-none italic font-serif"
                    />
                  </div>
                </div>

                <div className="space-y-4 group">
                  <div className="relative">
                    <Lock className="absolute left-16 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-rose-500/60 transition-colors duration-500" size={56} strokeWidth={1} />
                    <input 
                      type="password" 
                      placeholder="Passphrase" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="w-full bg-white/[0.02] border-2 border-white/5 rounded-[4rem] py-16 pl-40 pr-16 text-5xl text-white placeholder:text-white/10 focus:border-rose-500/30 focus:bg-white/[0.05] transition-all duration-700 outline-none italic tracking-widest"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="px-8"
                    >
                      <p className="text-rose-500/80 text-3xl font-black uppercase tracking-[0.2em] italic flex items-center gap-6">
                        <ShieldCheck size={32} />
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  className="w-full py-16 text-6xl shadow-[0_50px_100px_rgba(244,63,94,0.3)] rounded-[4rem]" 
                  isLoading={isLoading}
                  size="xl"
                >
                  <span className="flex items-center gap-8">
                    Enter Sanctuary <ArrowRight size={48} />
                  </span>
                </Button>
              </form>
            </div>

            <div className="relative flex items-center gap-8 px-8 py-4 opacity-20">
              <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-white" />
              <span className="text-[14px] font-black uppercase tracking-[1em] italic">Or Sync Genesis</span>
              <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent to-white" />
            </div>

            <div className="px-4">
              <Button 
                type="button"
                onClick={handleGoogleSignup}
                variant="glass"
                className="w-full gap-12 py-12 bg-white/[0.03] hover:bg-white/[0.08] border-white/10 rounded-[4rem] text-5xl group"
                size="xl"
              >
                <div className="p-4 bg-white rounded-full group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">Initiate with Google Pulse</span>
              </Button>
            </div>
          </div>
        </Card>

        <footer className="mt-24 text-center opacity-20 hover:opacity-40 transition-opacity duration-1000 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-[14px] font-black uppercase tracking-[1em] italic">
            <Fingerprint size={32} />
            Quantum Encrypted Sanctuary
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Access limited to destined frequencies</p>
        </footer>
      </motion.div>
    </div>
  );
}
