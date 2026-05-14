import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
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
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (loginError) throw loginError;
        if (data.user) checkProfile(data.user.id);
      } else {
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (signupError) throw signupError;
        if (authData.user) navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050506]">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-rose-500/10 rounded-full blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-500/10 rounded-full blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,6,0.8)_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        <header className="text-center mb-16 space-y-8">
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex p-8 rounded-[3rem] bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_60px_rgba(244,63,94,0.2)] relative group"
          >
            <div className="absolute inset-0 bg-rose-500/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <Heart size={64} fill="currentColor" className="relative z-10" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-serif text-white tracking-tight leading-none glow-text">Kadhi Tari</h1>
            <div className="flex items-center justify-center gap-4 opacity-60">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-500" />
              <p className="text-gray-400 font-handwritten text-3xl italic">Our private sanctuary</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-500" />
            </div>
          </div>
        </header>

        <Card className="p-10 sm:p-14 space-y-12 border-white/5 bg-white/[0.01] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <div className="flex gap-4 p-2 bg-white/[0.02] rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-inner">
            <TabButton active={isLogin} onClick={() => setIsLogin(true)} label="Sign In" />
            <TabButton active={!isLogin} onClick={() => setIsLogin(false)} label="Join Us" />
          </div>

          <form onSubmit={handleAuth} className="space-y-10">
            <div className="space-y-8">
              <Input 
                icon={Mail} 
                type="email" 
                placeholder="Sanctuary Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="py-6 text-lg"
              />
              <Input 
                icon={Lock} 
                type="password" 
                placeholder="Access Key" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="py-6 text-lg"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[1.8rem] flex items-center gap-4"
                >
                  <ShieldCheck size={20} className="text-rose-400 shrink-0" />
                  <p className="text-rose-400 text-[11px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full py-8 text-xl tracking-tight shadow-[0_20px_50px_rgba(244,63,94,0.3)]" 
              isLoading={isLoading}
              size="xl"
            >
              <Zap size={22} className="mr-3" />
              {isLogin ? 'Enter Sanctuary' : 'Initiate Bond'}
            </Button>
          </form>

          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b0b0d] px-8 text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Synchronize Soul</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="glass"
            onClick={handleGoogleLogin}
            className="w-full gap-5 py-7 border-white/10 hover:bg-white/10"
            size="xl"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-lg tracking-tight">Continue with Google</span>
          </Button>
        </Card>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">Encrypted Connection · Private Instance</p>
        </footer>
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex-1 py-5 rounded-[1.8rem] text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-500 relative z-10 ${active ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="login-tab"
          className="absolute inset-0 bg-white rounded-[1.8rem] -z-10 shadow-2xl shadow-white/10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

