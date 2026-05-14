import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Image, BookHeart, Calendar, Heart, Zap, Sparkles, Send, History, Fingerprint, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import UploadModal from '../UploadModal';

export default function FAB() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'story'>('post');
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openUpload = (type: 'post' | 'story') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-32 lg:bottom-16 right-10 lg:right-20 z-[2000]" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, filter: 'blur(30px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 100, filter: 'blur(30px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-32 right-0 flex flex-col gap-8 items-end min-w-[350px]"
          >
            <CreateOption 
              icon={Camera} 
              label="New Story" 
              onClick={() => openUpload('story')} 
              color="text-rose-500" 
              desc="Broadcast Frequency"
              index={0}
            />
            <CreateOption 
              icon={Image} 
              label="Share Post" 
              onClick={() => openUpload('post')} 
              color="text-orange-500" 
              desc="Archive Reflection"
              index={1}
            />
            <CreateOption 
              icon={BookHeart} 
              label="Write Letter" 
              onClick={() => { setIsOpen(false); navigate('/letters'); }} 
              color="text-purple-500" 
              desc="Soul Script"
              index={2}
            />
            <CreateOption 
              icon={Calendar} 
              label="Add Milestone" 
              onClick={() => { setIsOpen(false); navigate('/timeline'); }} 
              color="text-blue-500" 
              desc="Celestial Node"
              index={3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "w-24 h-24 rounded-[3.5rem] flex items-center justify-center shadow-[0_50px_150px_rgba(244,63,94,0.6)] transition-all duration-1000 relative overflow-hidden group border-none",
          isOpen 
            ? "bg-white text-black rotate-0" 
            : "bg-gradient-to-tr from-rose-700 via-orange-600 to-rose-700 text-white"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <Plus size={56} strokeWidth={1} className={twMerge("transition-all duration-1000 relative z-10", isOpen && "rotate-[135deg]")} />
      </motion.button>

      {/* Global Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSuccess={() => {
          if (window.location.pathname === '/feed') {
            window.location.reload(); 
          }
        }}
        type={uploadType}
      />

      {/* Blur Overlay when Open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/95 backdrop-blur-[100px] z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateOption({ icon: Icon, label, onClick, color, desc, index }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 50, filter: 'blur(20px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: -20, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-10 bg-black/[0.8] backdrop-blur-[80px] border-2 border-white/5 px-12 py-8 rounded-[3.5rem] w-full group hover:bg-white/[0.05] hover:border-rose-500/40 transition-all duration-1000 shadow-[0_80px_200px_rgba(0,0,0,1)] relative overflow-hidden shadow-inner italic"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="text-right flex-1 relative z-10">
        <p className="text-[11px] font-black text-gray-800 uppercase tracking-[0.5em] group-hover:text-rose-500/60 transition-colors italic mb-2">{desc}</p>
        <p className="text-4xl font-serif text-white group-hover:text-rose-400 transition-colors tracking-tighter italic">{label}</p>
      </div>
      <div className={twMerge("p-5 rounded-[1.8rem] bg-white/[0.01] border-2 border-white/5 group-hover:scale-125 group-hover:rotate-[15deg] transition-all duration-1000 relative z-10 shadow-3xl", color)}>
        <Icon size={36} strokeWidth={1} className="animate-pulse" />
      </div>
    </motion.button>
  );
}
