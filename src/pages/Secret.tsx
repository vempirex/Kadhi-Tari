import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Heart, ShieldAlert, Key } from 'lucide-react';
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
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: error ? [-10, 10, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.5 }}
          className="p-10 sm:p-16 space-y-12 max-w-xl w-full relative overflow-hidden text-center border-white/5"
        >
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex justify-center relative">
            <div className="p-8 rounded-[2.5rem] bg-rose-500/5 text-rose-500 border border-rose-500/10 shadow-[0_0_40px_rgba(244,63,94,0.1)] relative z-10">
              <Lock size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 bg-rose-500/20 blur-3xl opacity-20 animate-pulse" />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">The Forbidden Vault</h2>
            <p className="text-gray-500 text-lg font-handwritten italic opacity-80">
              "Echo the secret dialect to proceed..."
            </p>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Inside joke password..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.8rem] px-8 py-5 outline-none focus:border-rose-500/40 focus:bg-rose-500/[0.02] transition-all text-center font-medium text-lg placeholder:text-gray-600 tracking-widest"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-rose-400 transition-colors p-2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              onClick={handleUnlock}
              className="w-full gap-4 py-6"
              size="xl"
            >
              <Key size={22} />
              <span>Breach the Silence</span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 text-orange-400/50 relative z-10 bg-orange-400/[0.03] py-4 rounded-2xl border border-orange-400/5">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Hint: A champion of extending calls
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <header className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-rose-400 font-black uppercase tracking-[0.4em] text-[10px]">
            <Key size={12} className="animate-pulse" />
            Restricted Resonance
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif glow-text leading-tight tracking-tight">The Inner Sanctum</h1>
          <p className="text-gray-400 text-lg font-handwritten italic opacity-80 max-w-lg mx-auto">
            The private frequency of our shared existence... 🔒
          </p>
        </div>
      </header>

      <div className="grid gap-10 px-2 sm:px-0">
        <Card 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-10 sm:p-16 space-y-8 border-rose-500/10 bg-rose-500/[0.02] relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles size={120} strokeWidth={1} />
          </div>

          <div className="flex items-center gap-4 text-rose-400 relative z-10">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <Sparkles size={24} />
            </div>
            <h3 className="text-2xl font-serif tracking-tight">The Core Protocol</h3>
          </div>
          
          <p className="font-handwritten text-2xl sm:text-3xl leading-relaxed italic text-white/90 relative z-10">
            "No matter how chaotic the external world manifests, this frequency remains our absolute sanctuary. Our conversations are the gravity that keeps our universe from drifting apart. 🌙"
          </p>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-video sm:aspect-square flex flex-col items-center justify-center text-center p-10 gap-6 group hover:border-rose-500/30 transition-all duration-700 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/20 group-hover:scale-110 transition-all duration-700 relative z-10 shadow-xl">
                <Heart size={32} className="text-gray-700 group-hover:text-rose-500 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="space-y-2 relative z-10">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] group-hover:text-rose-400 transition-colors">Fragment #{i}</p>
                <p className="text-sm font-serif italic text-gray-600 group-hover:text-gray-400 transition-colors">Awaiting sync...</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
