/**
 * NEW LOGIN PAGE - CLEAN IMPLEMENTATION
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock, User, ArrowRight, Fingerprint, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateInternalEmail } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle Automatic Redirection
  useEffect(() => {
    if (session) {
      if (profile?.username) navigate('/');
      else navigate('/onboarding');
    }
  }, [session, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please enter your credentials.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const email = generateInternalEmail(formData.username);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      // Success will be handled by useEffect
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "Access denied. Frequency or passphrase incorrect." : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-warm-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <header className="text-center mb-10 space-y-3">
          <Link to="/" className="inline-flex p-4 rounded-2xl bg-white shadow-premium mb-2">
            <Heart size={32} className="text-rose-600 fill-rose-600" />
          </Link>
          <h1 className="text-4xl font-outfit font-bold text-charcoal tracking-tight">Kadhi Tari</h1>
          <p className="text-warm-500 font-medium">Reconnect to your sanctuary</p>
        </header>

        <Card className="p-8 sm:p-10 shadow-premium">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Handle</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="your_handle" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
                    className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center px-2">{error}</p>
            )}

            <Button type="submit" className="w-full py-6" isLoading={isLoading}>
              Enter Sanctuary <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-warm-100 text-center">
            <p className="text-xs text-warm-500 mb-4">First time here?</p>
            <Link to="/signup">
              <Button variant="outline" className="w-full">
                Claim a handle <Sparkles size={14} className="ml-2 text-rose-500" />
              </Button>
            </Link>
          </div>
        </Card>

        <footer className="mt-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warm-400">
            <Fingerprint size={14} />
            Secure Private Link
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
