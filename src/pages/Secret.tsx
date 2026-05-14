import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Heart } from 'lucide-react';

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-4 text-center">
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="glass-card rounded-[3rem] p-12 space-y-6 max-w-sm w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl" />
          
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-white/5 text-primary">
              <Lock size={40} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif glow-text">The Secret Vault</h2>
            <p className="text-sm text-gray-500 font-handwritten italic">
              "Enter the inside joke password..."
            </p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-colors text-center font-medium"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUnlock}
            className="w-full py-4 rounded-2xl bg-primary text-background font-bold shadow-lg shadow-primary/20"
          >
            Unlock Memories
          </motion.button>
        </motion.div>

        <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">
          Hint: A champion of extending calls
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="px-2 text-center py-4">
        <h1 className="text-3xl font-serif glow-text">Hidden Corner 🔒</h1>
        <p className="text-primary font-handwritten text-xl italic">The things only we know...</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl p-8 space-y-4 border-primary/20 bg-primary/5"
        >
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={20} />
            <h3 className="font-bold">A Hidden Promise</h3>
          </div>
          <p className="font-handwritten text-xl leading-loose italic">
            "No matter how chaotic things get out there, this space remains our peaceful late-night conversation. 🌙"
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl aspect-square flex flex-col items-center justify-center text-center p-4 gap-2 group"
            >
              <Heart size={24} className="text-gray-700 group-hover:text-primary transition-colors" />
              <p className="text-[10px] text-gray-600 uppercase font-bold">Locked Memory #{i}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
