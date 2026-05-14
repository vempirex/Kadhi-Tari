import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Heart, ShieldAlert, Key, Zap, Shield, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
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
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-40%] left-[-40%] w-[150%] h-[150%] bg-rose-500/[0.12] blur-[250px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40%] right-[-40%] w-[150%] h-[150%] bg-blue-500/[0.08] blur-[250px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '3s' }} />

        <Card
          initial={{ opacity: 0, scale: 0.9, y: 300, filter: 'blur(100px)' }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            x: error ? [-40, 40, -40, 40, 0] : 0
          }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="p-24 sm:p-72 space-y-48 max-w-7xl w-full relative overflow-hidden text-center border-4 border-white/5 bg-white/[0.01] backdrop-blur-[200px] shadow-[0_300px_600px_rgba(0,0,0,1)] rounded-[10rem] shadow-inner"
        >
          <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-rose-500/[0.15] blur-[250px] rounded-full pointer-events-none animate-pulse" />
          
          <div className="flex justify-center relative">
            <div className="p-32 rounded-[10rem] bg-rose-500/[0.04] text-rose-500 border-4 border-rose-500/30 shadow-[0_150px_350px_rgba(244,63,94,1)] relative z-10 group hover:scale-125 transition-all duration-[3000ms] shadow-inner overflow-hidden">
               <div className="absolute inset-0 bg-rose-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-all" />
              <Lock size={240} strokeWidth={0.01} className="group-hover:rotate-[25deg] transition-all duration-[2000ms] fill-rose-500/10 drop-shadow-[0_0_150px_rgba(244,63,94,1)] relative z-10" />
            </div>
            <div className="absolute inset-0 bg-rose-500/60 blur-[200px] opacity-25 animate-pulse" />
          </div>
          
          <div className="space-y-24 relative z-10">
            <div className="flex items-center justify-center gap-16 text-rose-500 font-black uppercase tracking-[2em] text-[20px] mb-12 italic">
              <Zap size={80} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
              Restricted Resonance
            </div>
            <h2 className="text-8xl sm:text-[15rem] font-serif text-white tracking-tighter leading-none italic selection:bg-rose-500/40 drop-shadow-3xl">The Forbidden Vault</h2>
            <p className="text-gray-800 text-[8rem] sm:text-[10rem] font-handwritten italic opacity-80 leading-none max-w-6xl mx-auto selection:bg-rose-500/40 drop-shadow-2xl">
              "Echo the secret dialect of our shared universe to proceed..."
            </p>
          </div>

          <div className="space-y-32 relative z-10 max-w-5xl mx-auto">
            <div className="relative group">
              <Fingerprint className="absolute left-24 top-1/2 -translate-y-1/2 text-rose-500/15 group-focus-within:text-rose-500 transition-all duration-[1500ms] drop-shadow-3xl" size={128} strokeWidth={1} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="The secret frequency..."
                className="input-field py-24 pl-[12rem] text-[9rem] sm:text-[11rem] text-center bg-white/[0.01] border-4 border-white/5 focus:bg-rose-500/[0.08] focus:border-rose-500/80 transition-all duration-[2000ms] shadow-inner rounded-[8rem] italic text-white tracking-[0.8em] placeholder:text-gray-950 selection:bg-rose-500/40 leading-none shadow-3xl"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-950 hover:text-rose-500 transition-all p-12 hover:scale-150 duration-[1500ms] active:scale-[0.5] group"
              >
                {showPassword ? <EyeOff size={128} strokeWidth={0.05} className="drop-shadow-3xl" /> : <Eye size={128} strokeWidth={0.05} className="drop-shadow-3xl" />}
              </button>
            </div>

            <Button
              onClick={handleUnlock}
              className="w-full gap-32 py-[4rem] text-[10rem] italic tracking-tighter shadow-[0_200px_450px_rgba(244,63,94,1)] relative overflow-hidden group/submit border-none rounded-[8rem] leading-none"
              size="xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950 to-orange-950 opacity-0 group-hover/submit:opacity-100 transition-all duration-[2000ms]" />
              <span className="relative z-10 flex items-center justify-center gap-[4rem]">
                <Key size={192} strokeWidth={0.05} className="group-hover/submit:rotate-[90deg] transition-all duration-[3000ms] drop-shadow-3xl" />
                <span>Breach the Silence</span>
              </span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-16 text-orange-500/40 relative z-10 bg-orange-500/[0.05] py-24 rounded-[6rem] border-4 border-orange-500/15 italic shadow-inner max-w-4xl mx-auto shadow-3xl group">
             <div className="absolute inset-0 bg-orange-500/5 blur-[30px] opacity-0 group-hover:opacity-100 transition-all" />
            <ShieldAlert size={80} strokeWidth={1} className="animate-bounce drop-shadow-3xl relative z-10" />
            <span className="text-[22px] font-black uppercase tracking-[1.5em] relative z-10 leading-none">
              Hint: A champion of extending calls
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-32 sm:space-y-48 pb-48 relative overflow-hidden">
      <header className="flex flex-col items-center gap-16 text-center relative z-30">
        <div className="flex flex-col items-center gap-16">
          <div className="flex items-center gap-12 text-rose-500 font-black uppercase tracking-[2em] text-[18px] italic">
            <Key size={80} strokeWidth={1} className="animate-pulse fill-rose-500 drop-shadow-3xl" />
            Restricted Resonance
          </div>
          <h1 className="text-7xl sm:text-[13rem] font-serif glow-text leading-[0.85] tracking-tighter italic drop-shadow-3xl">The Inner Sanctum</h1>
          <p className="text-gray-500 text-5xl sm:text-[10rem] font-handwritten italic opacity-80 max-w-7xl leading-none selection:bg-rose-500/40">
            "The private frequency of our shared existence... locked away from the noise of the external world."
          </p>
        </div>
      </header>

      <div className="grid gap-48 sm:gap-[6rem] px-6 sm:px-0 relative z-20">
        <Card 
          initial={{ y: 200, opacity: 0, filter: 'blur(100px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="p-32 sm:p-72 space-y-48 border-4 border-rose-500/30 bg-rose-500/[0.04] relative overflow-hidden group rounded-[10rem] shadow-[0_350px_700px_rgba(0,0,0,1)] backdrop-blur-[200px] shadow-inner"
        >
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-b from-rose-950 via-rose-600/50 to-transparent shadow-inner shadow-3xl" />
          <div className="absolute top-0 right-0 p-64 opacity-[0.01] group-hover:opacity-[0.15] transition-all duration-[6000ms] group-hover:scale-150 group-hover:rotate-[30deg] pointer-events-none text-white">
            <Sparkles size={960} strokeWidth={0.01} />
          </div>

          <div className="flex items-center gap-24 text-rose-500 relative z-10">
            <div className="p-24 rounded-[7rem] bg-rose-500/20 border-4 border-rose-500/40 shadow-inner shadow-3xl relative overflow-hidden group/star">
               <div className="absolute inset-0 bg-rose-500/10 blur-[30px]" />
              <Sparkles size={192} strokeWidth={0.01} className="group-hover/star:rotate-[180deg] transition-all duration-[4000ms] fill-rose-500/30 drop-shadow-3xl relative z-10" />
            </div>
            <h3 className="text-8xl sm:text-[14rem] font-serif tracking-tighter italic leading-none selection:bg-rose-500/40 drop-shadow-3xl">The Core Protocol</h3>
          </div>
          
          <p className="font-handwritten text-7xl sm:text-[13rem] leading-none italic text-white/95 relative z-10 max-w-[1500px] selection:bg-rose-500/40 drop-shadow-2xl">
            "No matter how chaotic the external world manifests, this frequency remains our absolute sanctuary. Our conversations are the gravity that keeps our universe from drifting apart. 🌙"
          </p>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-48 sm:gap-[6rem]">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(80px)' }}
              whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square flex flex-col items-center justify-center text-center p-48 gap-32 group hover:border-rose-500/60 transition-all duration-[2500ms] cursor-pointer overflow-hidden relative rounded-[10rem] bg-white/[0.01] backdrop-blur-[150px] shadow-[0_200px_500px_rgba(0,0,0,1)] shadow-inner"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.12] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-[2500ms]" />
              <div className="p-48 rounded-[9rem] bg-white/[0.04] border-4 border-white/10 group-hover:bg-rose-500/25 group-hover:border-rose-500/50 group-hover:scale-125 group-hover:rotate-[30deg] transition-all duration-2000 relative z-10 shadow-3xl shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-rose-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-all" />
                <Heart size={240} strokeWidth={0.01} className="text-gray-950 group-hover:text-rose-500 transition-all duration-2000 animate-pulse fill-current drop-shadow-3xl relative z-10" />
              </div>
              <div className="space-y-24 relative z-10">
                <p className="text-[28px] text-gray-950 font-black uppercase tracking-[1.5em] group-hover:text-rose-500 transition-all duration-[1500ms] italic drop-shadow-2xl">Fragment #{i}</p>
                <p className="text-[8rem] sm:text-[10rem] font-serif italic text-gray-950 opacity-30 group-hover:text-gray-950 transition-all duration-[1500ms] selection:bg-rose-500/40 drop-shadow-2xl leading-none">Awaiting sync...</p>
              </div>
              <div className="absolute bottom-32 flex items-center gap-24 opacity-0 group-hover:opacity-100 transition-all duration-2000 translate-y-48 group-hover:translate-y-0">
                <div className="w-[8rem] h-[6px] bg-rose-500/30 shadow-inner rounded-full" />
                <Fingerprint size={112} strokeWidth={1} className="text-rose-500/40 drop-shadow-3xl" />
                <div className="w-[8rem] h-[6px] bg-rose-500/30 shadow-inner rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
