import { useState } from 'react';
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
      } else {
        // Signup Flow
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              full_name: formData.fullName
            }
          }
        });

        if (signupError) throw signupError;

        // Create Profile in DB
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                username: formData.username,
                display_name: formData.fullName,
                joined_at: new Date().toISOString()
              }
            ]);
          if (profileError) throw profileError;
        }
      }
      navigate('/');
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
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050506]">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-300/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 mb-2">
            <Heart size={32} />
          </div>
          <h1 className="text-4xl font-serif text-white shadow-rose-500/20">Kadhi Tari Sanctuary</h1>
          <p className="text-gray-400 font-handwritten text-xl italic">Our private universe awaits...</p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl space-y-8">
          <div className="flex p-1 bg-white/5 rounded-2xl">
            <Tab active={isLogin} onClick={() => setIsLogin(true)} label="Sign In" />
            <Tab active={!isLogin} onClick={() => setIsLogin(false)} label="Join Us" />
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <AuthInput 
                    icon={User} 
                    type="text" 
                    placeholder="Sanctuary Username" 
                    value={formData.username}
                    onChange={(v: string) => setFormData({...formData, username: v})}
                  />
                  <AuthInput 
                    icon={Sparkles} 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.fullName}
                    onChange={(v: string) => setFormData({...formData, fullName: v})}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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

            {error && <p className="text-rose-400 text-xs text-center font-medium">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white font-bold shadow-lg shadow-rose-500/20 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (isLogin ? 'Enter Sanctuary' : 'Create Sanctuary')}
            </motion.button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0c0c0e] px-4 text-gray-500 font-bold tracking-widest">Or</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-medium text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300",
        active ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
      )}
    >
      {label}
    </button>
  );
}

function AuthInput({ icon: Icon, value, onChange, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500" size={18} />
      <input
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-rose-500/50 transition-colors text-white"
      />
    </div>
  );
}
