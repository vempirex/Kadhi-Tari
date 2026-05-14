import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Camera, Image, BookHeart, Calendar, Heart } from 'lucide-react';
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
    <div className="fixed bottom-28 lg:bottom-12 right-6 lg:right-12 z-[150]" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 flex flex-col gap-3 items-end min-w-[200px]"
          >
            <CreateOption 
              icon={Camera} 
              label="New Story" 
              onClick={() => openUpload('story')} 
              color="text-rose-400" 
              desc="Daily moments"
            />
            <CreateOption 
              icon={Image} 
              label="Share Post" 
              onClick={() => openUpload('post')} 
              color="text-orange-400" 
              desc="Infinite memories"
            />
            <CreateOption 
              icon={BookHeart} 
              label="Write Letter" 
              onClick={() => { setIsOpen(false); navigate('/letters'); }} 
              color="text-purple-400" 
              desc="Soul notes"
            />
            <CreateOption 
              icon={Calendar} 
              label="Add Milestone" 
              onClick={() => { setIsOpen(false); navigate('/timeline'); }} 
              color="text-blue-400" 
              desc="Our timeline"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-500/20 transition-all duration-500",
          isOpen 
            ? "bg-white text-black" 
            : "bg-gradient-to-br from-rose-400 to-rose-600 text-white"
        )}
      >
        <Plus size={32} className={twMerge("transition-transform duration-500", isOpen && "rotate-45")} />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateOption({ icon: Icon, label, onClick, color, desc }: any) {
  return (
    <motion.button
      whileHover={{ x: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-4 bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 px-5 py-4 rounded-[2rem] w-full group hover:bg-white/5 transition-all shadow-2xl"
    >
      <div className="text-right flex-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{desc}</p>
        <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{label}</p>
      </div>
      <div className={twMerge("p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-all", color)}>
        <Icon size={20} />
      </div>
    </motion.button>
  );
}
