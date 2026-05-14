import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Heart, ShieldAlert, Key, Zap, Shield, Fingerprint, Wind, Sun, Moon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Secret() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = () => {
    // The password is an inside joke: "2minute"
    if (password.toLowerCase() === '2minute') {
      setIsAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative">
        <Card
          animate={{ 
            x: error ? [-10, 10, -10, 10, 0] : 0
          }}
          className="p-8 sm:p-12 max-w-lg w-full space-y-8 text-center bg-white shadow-premium"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
              <Lock size={32} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
              <Zap size={16} />
              Restricted Resonance
            </div>
            <h2 className="text-3xl font-outfit font-bold text-charcoal tracking-tight">The Forbidden Vault</h2>
            <p className="text-warm-500 font-medium italic text-sm">
              "Echo the secret dialect of our shared universe to proceed..."
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-warm-400 uppercase tracking-widest ml-1">Secret Frequency</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-200 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="Whisper the code..."
                  className="w-full bg-warm-50 border border-warm-100 rounded-xl py-3 pl-12 pr-12 text-center text-lg font-bold tracking-[0.5em] text-charcoal placeholder:text-warm-200 outline-none focus:bg-white focus:border-rose-200 transition-all"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-300 hover:text-charcoal transition-all p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleUnlock}
              className="w-full"
            >
              <Key size={18} className="mr-2" /> Breach the Silence
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 italic text-[10px] font-bold uppercase tracking-widest">
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span>Hint: A champion of extending calls</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex flex-col items-center gap-4 text-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold uppercase tracking-widest text-[10px]">
            <Key size={16} />
            Restricted Resonance
          </div>
          <h1 className="text-4xl sm:text-5xl font-outfit font-bold text-charcoal tracking-tight">The Inner Sanctum</h1>
          <p className="text-warm-500 font-medium text-lg max-w-xl">
            Locked away from the noise of the external world.
          </p>
        </div>
      </header>

      <div className="grid gap-8 px-2">
        <Card className="p-8 sm:p-10 space-y-6 border-rose-100 bg-rose-50/20 relative overflow-hidden group">
          <div className="flex items-center gap-4 text-rose-600">
            <div className="p-3 rounded-xl bg-white border border-rose-100 shadow-sm">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-outfit font-bold tracking-tight">The Core Protocol</h3>
          </div>
          
          <p className="text-xl font-medium italic text-charcoal leading-relaxed">
            "No matter how chaotic the external world manifests, this frequency remains our absolute sanctuary. Our conversations are the gravity that keeps our universe from drifting apart. 🌙"
          </p>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-24">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="aspect-square flex flex-col items-center justify-center text-center p-8 gap-4 group hover:border-rose-200 transition-all bg-white"
            >
              <div className="w-20 h-20 rounded-full bg-warm-50 border border-warm-100 group-hover:bg-rose-50 group-hover:border-rose-100 flex items-center justify-center transition-all">
                <Heart size={32} className="text-warm-200 group-hover:text-rose-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-warm-300 group-hover:text-rose-600 transition-colors">Fragment #{i}</p>
                <p className="text-sm font-medium italic text-warm-400">Awaiting sync...</p>
              </div>
              <div className="opacity-0 group-hover:opacity-40 transition-opacity">
                <Fingerprint size={24} className="text-warm-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
