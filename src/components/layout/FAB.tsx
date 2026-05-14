import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Image, BookHeart, Calendar, Heart, Zap, Sparkles, Send, History } from 'lucide-react';
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
    <div className="fixed bottom-32 lg:bottom-16 right-8 lg:right-16 z-[1500]" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-24 right-0 flex flex-col gap-4 items-end min-w-[280px]"
          >
            <CreateOption 
              icon={Camera} 
              label="New Story" 
              onClick={() => openUpload('story')} 
              color="text-rose-400" 
              desc="Broadcast Frequency"
              index={0}
            />
            <CreateOption 
              icon={Image} 
              label="Share Post" 
              onClick={() => openUpload('post')} 
              color="text-orange-400" 
              desc="Archive Reflection"
              index={1}
            />
            <CreateOption 
              icon={BookHeart} 
              label="Write Letter" 
              onClick={() => { setIsOpen(false); navigate('/letters'); }} 
              color="text-purple-400" 
              desc="Soul Script"
              index={2}
            />
            <CreateOption 
              icon={Calendar} 
              label="Add Milestone" 
              onClick={() => { setIsOpen(false); navigate('/timeline'); }} 
              color="text-blue-400" 
              desc="Celestial Node"
              index={3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: isOpen ? 0 : 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_100px_rgba(244,63,94,0.3)] transition-all duration-700 relative overflow-hidden group",
          isOpen 
            ? "bg-white text-black rotate-0" 
            : "bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 text-white"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus size={40} strokeWidth={2.5} className={twMerge("transition-all duration-700 relative z-10", isOpen && "rotate-[135deg]")} />
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
            className="fixed inset-0 bg-black/80 backdrop-blur-[20px] z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateOption({ icon: Icon, label, onClick, color, desc, index }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ x: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-6 bg-black/[0.6] backdrop-blur-[40px] border border-white/5 px-8 py-6 rounded-[2.5rem] w-full group hover:bg-white/[0.05] hover:border-rose-500/20 transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-right flex-1 relative z-10">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] group-hover:text-rose-500/60 transition-colors">{desc}</p>
        <p className="text-lg font-serif text-white group-hover:text-rose-400 transition-colors tracking-tight">{label}</p>
      </div>
      <div className={twMerge("p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative z-10 shadow-inner", color)}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
    </motion.button>
  );
}
