/**
 * NEW SIGNUP PAGE - CLEAN IMPLEMENTATION
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Lock, User, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateInternalEmail, checkUsernameAvailability } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validation
    if (formData.username.length < 3) {
      setError("Handle must be at least 3 characters.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passphrases do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Check Availability
      const isAvailable = await checkUsernameAvailability(formData.username);
      if (!isAvailable) {
        throw new Error("This handle is already claimed. Try another frequency.");
      }

      // 3. Create Account with Hidden Email
      const email = generateInternalEmail(formData.username);
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          data: { username: formData.username }
        }
      });

      if (signUpError) throw signUpError;
      
      // Success - user will be logged in and AuthGuard will redirect to /onboarding
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-warm-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <header className="text-center mb-10 space-y-3">
          <Link to="/" className="inline-flex p-4 rounded-2xl bg-white shadow-premium mb-2">
            <ShieldCheck size={32} className="text-rose-600" />
          </Link>
          <h1 className="text-4xl font-outfit font-bold text-charcoal tracking-tight">New Genesis</h1>
          <p className="text-warm-500 font-medium">Claim your unique frequency</p>
        </header>

        <Card className="p-8 sm:p-10 shadow-premium">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Desired Handle</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. starlight" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                    className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Secure Passphrase</label>
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

              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Confirm Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-warm-50/50 border border-warm-100 rounded-xl py-4 pl-12 pr-4 text-sm text-charcoal outline-none focus:bg-white focus:border-rose-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center px-2">{error}</p>
            )}

            <Button type="submit" className="w-full py-6" isLoading={isLoading}>
              Begin Genesis <Sparkles size={16} className="ml-2" />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-warm-100 text-center">
            <p className="text-xs text-warm-500 mb-4">Already have a frequency?</p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Reconnect <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
