import { motion } from 'framer-motion';
import { Sparkles, Moon, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          rotate: -360,
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-20%] w-[90%] h-[90%] bg-secondary/10 rounded-full blur-[150px]"
      />

      <div className="z-10 w-full max-w-sm space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-5 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl relative"
            >
              <Moon size={48} className="text-primary glow-text" />
              <div className="absolute -top-2 -right-2">
                <Sparkles size={24} className="text-secondary glow-yellow" />
              </div>
            </motion.div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif glow-text tracking-tight">Kadhi Tari</h1>
            <p className="text-gray-400 font-handwritten text-xl italic">Our private digital sanctuary 🌙</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-[3rem] p-10 space-y-8 shadow-2xl"
        >
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to enter our shared space</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold shadow-xl shadow-white/10 transition-all hover:bg-gray-100"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </motion.button>

          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            Invite-only access restricted to 2 people
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-8"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 font-handwritten">
            <Heart size={16} className="text-primary" />
            <span>Made for just us two</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
