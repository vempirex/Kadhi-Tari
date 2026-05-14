import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  });

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        checkProfile(user.id);
      }
    };
    checkUser();
  }, []);

  const checkProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (data?.username) {
      navigate('/');
    } else {
      navigate('/onboarding');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        if (data.user) checkProfile(data.user.id);
      } else {
        // Signup Flow
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signupError) throw signupError;

        if (authData.user) {
          // Profile will be created during onboarding
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/onboarding` }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050506]">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-300/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex p-4 rounded-[2rem] bg-rose-500/10 text-rose-400 mb-2 border border-rose-500/20 shadow-2xl shadow-rose-500/10"
          >
            <Heart size={40} fill="currentColor" className="opacity-80" />
          </motion.div>
          <h1 className="text-4xl font-serif text-white glow-text">Kadhi Tari Sanctuary</h1>
          <p className="text-gray-400 font-handwritten text-xl italic opacity-80">Where our souls find their home...</p>
        </div>

        <div className="glass-panel rounded-[3rem] p-10 shadow-2xl space-y-10 border-white/10">
          <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
            <Tab active={isLogin} onClick={() => setIsLogin(true)} label="Sign In" />
            <Tab active={!isLogin} onClick={() => setIsLogin(false)} label="Join Us" />
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AuthInput 
              icon={Mail} 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(v: string) => setFormData({...formData, email: v})}
            />
            <AuthInput 
              icon={Lock} 
              type="password" 
              placeholder="Private Password" 
              value={formData.password}
              onChange={(v: string) => setFormData({...formData, password: v})}
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl"
              >
                <p className="text-rose-400 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="btn-primary w-full py-5 text-base"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (isLogin ? 'Enter Sanctuary' : 'Create Account')}
            </motion.button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
              <span className="bg-[#050506] px-6 text-gray-600">Soul Portal</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-5 rounded-[1.8rem] bg-white/5 border border-white/5 flex items-center justify-center gap-4 hover:bg-white/10 hover:border-white/10 transition-all font-bold text-white text-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Tab({ active, onClick, label }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex-1 py-4 rounded-xl text-xs font-bold transition-all duration-500 tracking-widest uppercase",
        active ? "bg-white/10 text-white shadow-2xl" : "text-gray-500 hover:text-gray-300"
      )}
    >
      {label}
    </button>
  );
}

function AuthInput({ icon: Icon, value, onChange, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-rose-500/5 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <Icon className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-600 group-focus-within:text-rose-400 transition-colors" size={20} />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-5 pl-14 text-base outline-none focus:border-rose-500/30 focus:bg-white/[0.08] transition-all text-white placeholder:text-gray-700"
      />
    </div>
  );
}

