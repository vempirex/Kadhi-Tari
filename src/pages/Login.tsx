import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, Sparkles, ShieldCheck, Zap, Globe, Fingerprint, Key, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
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
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#050506]">
      {/* Cinematic Background - Enhanced */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-15%] w-[90%] h-[90%] bg-rose-500/[0.12] rounded-full blur-[220px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-25%] right-[-15%] w-[90%] h-[90%] bg-orange-500/[0.12] rounded-full blur-[220px] opacity-40 animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,6,1)_100%)]" />
        
        {/* Dynamic Light Particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: Math.random()
              }}
              animate={{ 
                y: [null, '-100vh'],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 20 + 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * -20
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95, filter: 'blur(50px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl relative z-10"
      >
        <header className="text-center mb-32 space-y-16">
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 12, -12, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex p-16 rounded-[6rem] bg-rose-500/[0.08] text-rose-500 border-2 border-rose-500/20 shadow-[0_80px_200px_rgba(244,63,94,0.4)] relative group shadow-inner"
          >
            <div className="absolute inset-0 bg-rose-500/40 blur-[120px] opacity-20 group-hover:opacity-40 transition-all duration-1000" />
            <Heart size={150} fill="currentColor" strokeWidth={0.1} className="relative z-10 drop-shadow-[0_0_50px_rgba(244,63,94,0.8)]" />
          </motion.div>
          
          <div className="space-y-10">
            <h1 className="text-8xl sm:text-[13rem] font-serif text-white tracking-[-0.05em] leading-[0.85] glow-text italic">Kadhi Tari</h1>
            <div className="flex items-center justify-center gap-10 opacity-30">
              <div className="h-[3px] w-32 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-inner" />
              <p className="text-gray-800 font-handwritten text-5xl sm:text-7xl italic tracking-tighter">Our Private Sanctuary</p>
              <div className="h-[3px] w-32 bg-gradient-to-l from-transparent via-rose-500 to-transparent shadow-inner" />
            </div>
          </div>
        </header>

        <Card className="p-16 sm:p-40 space-y-32 border-2 border-white/5 bg-white/[0.01] shadow-[0_150px_450px_rgba(0,0,0,1)] relative overflow-hidden backdrop-blur-[100px] rounded-[7rem] shadow-inner">
          <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-rose-500/[0.06] blur-[180px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="flex gap-10 p-4 bg-white/[0.01] rounded-[6rem] border-2 border-white/5 backdrop-blur-[60px] shadow-inner relative z-10">
            <TabButton active={isLogin} onClick={() => setIsLogin(true)} label="Sign In" />
            <TabButton active={!isLogin} onClick={() => setIsLogin(false)} label="Join Us" />
          </div>

          <form onSubmit={handleAuth} className="space-y-24 relative z-10">
            <div className="space-y-16">
              <div className="space-y-8 group">
                <label className="text-[16px] font-black text-gray-800 uppercase tracking-[1em] px-10 italic group-focus-within:text-rose-500 transition-all duration-1000">Identification</label>
                <div className="relative">
                   <Mail className="absolute left-16 top-1/2 -translate-y-1/2 text-gray-950 group-focus-within:text-rose-500 transition-all duration-1000" size={56} strokeWidth={1} />
                   <input 
                    type="email" 
                    placeholder="The Registry Email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="input-field py-16 pl-40 text-5xl sm:text-6xl bg-white/[0.01] border-2 border-white/5 focus:bg-rose-500/[0.03] focus:border-rose-500/40 transition-all duration-1000 shadow-inner rounded-[5rem] text-white italic placeholder:text-gray-950 selection:bg-rose-500/40"
                  />
                </div>
              </div>
              <div className="space-y-8 group">
                <label className="text-[16px] font-black text-gray-800 uppercase tracking-[1em] px-10 italic group-focus-within:text-rose-500 transition-all duration-1000">Access Key</label>
                <div className="relative">
                   <Lock className="absolute left-16 top-1/2 -translate-y-1/2 text-gray-950 group-focus-within:text-rose-500 transition-all duration-1000" size={56} strokeWidth={1} />
                   <input 
                    type="password" 
                    placeholder="The Sacred Passphrase" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="input-field py-16 pl-40 text-5xl sm:text-6xl bg-white/[0.01] border-2 border-white/5 focus:bg-rose-500/[0.03] focus:border-rose-500/40 transition-all duration-1000 shadow-inner rounded-[5rem] text-white italic tracking-[0.4em] placeholder:text-gray-950 selection:bg-rose-500/40"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(20px)' }} 
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(20px)' }}
                  className="bg-rose-500/[0.03] border-2 border-rose-500/20 p-12 rounded-[4.5rem] flex items-center gap-12 shadow-inner"
                >
                  <div className="w-20 h-20 rounded-[3rem] bg-rose-500/15 flex items-center justify-center shrink-0 border-2 border-rose-500/30">
                    <ShieldCheck size={40} className="text-rose-500" strokeWidth={1} />
                  </div>
                  <p className="text-rose-500 text-3xl font-black uppercase tracking-[0.4em] leading-relaxed italic">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full py-20 text-7xl italic tracking-tighter shadow-[0_100px_250px_rgba(244,63,94,0.6)] relative overflow-hidden group/submit border-none rounded-[6rem]" 
              isLoading={isLoading}
              size="xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-900 to-orange-800 opacity-0 group-hover/submit:opacity-100 transition-all duration-1000" />
              <span className="relative z-10 flex items-center justify-center gap-16">
                <Zap size={72} strokeWidth={1} className="group-hover/submit:animate-pulse fill-current" />
                {isLogin ? 'Enter Sanctuary' : 'Initiate Bond'}
                <ArrowRight size={64} strokeWidth={1} className="group-hover/submit:translate-x-10 transition-all duration-1000" />
              </span>
            </Button>
          </form>

          <div className="relative py-16 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-[3px] bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-inner" /></div>
            <div className="relative flex justify-center">
              <span className="bg-[#050506] px-16 text-[18px] font-black uppercase tracking-[1em] text-gray-950 italic">Universal Sync</span>
            </div>
          </div>

          <Button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full gap-16 py-16 bg-white/[0.01] hover:bg-white/[0.05] border-2 border-white/5 hover:border-white/20 relative overflow-hidden group/google rounded-[6rem] text-6xl italic tracking-tighter shadow-inner"
            size="xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent opacity-0 group-hover/google:opacity-100 transition-all duration-1000" />
            <svg className="w-16 h-16 relative z-10" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="relative z-10">Continue via Google Pulse</span>
          </Button>
        </Card>

        <footer className="mt-32 text-center space-y-10">
          <div className="flex items-center justify-center gap-8 text-gray-950">
            <ShieldCheck size={36} strokeWidth={1} className="animate-pulse" />
            <p className="text-[18px] font-black uppercase tracking-[0.9em] italic">Quantum Encrypted Tunnel</p>
          </div>
          <p className="text-[14px] text-gray-950 font-black uppercase tracking-[0.7em] italic opacity-40">Solely for those who belong</p>
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
      className={`flex-1 py-12 rounded-[5rem] text-[18px] font-black tracking-[0.8em] uppercase transition-all duration-1000 relative z-10 italic ${active ? 'text-black' : 'text-gray-950 hover:text-white'}`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="login-tab"
          className="absolute inset-0 bg-white rounded-[5rem] -z-10 shadow-[0_30px_80px_rgba(255,255,255,0.3)]"
          transition={{ type: "spring", bounce: 0.1, duration: 1.5 }}
        />
      )}
    </button>
  );
}
