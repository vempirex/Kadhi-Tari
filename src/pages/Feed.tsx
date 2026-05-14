import { motion } from 'framer-motion';
import { Image as ImageIcon, Heart, MessageCircle, Share2, Plus } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop',
    caption: 'That sunset felt like a dream...',
    user: 'Vijay',
    timestamp: '2h ago',
    reactions: 12,
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
    caption: 'Best chai in town. Finally found it ☕',
    user: 'Friend',
    timestamp: '5h ago',
    reactions: 8,
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
    caption: 'Random observation: the sky today is very cinematic.',
    user: 'Vijay',
    timestamp: '1d ago',
    reactions: 15,
  }
];

export default function Feed() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-serif glow-text">Shared Feed</h1>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-primary text-background shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-[2rem] overflow-hidden p-3"
          >
            {/* Polaroid Image Area */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
              <img 
                src={post.imageUrl} 
                alt="Feed item" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-300 font-medium uppercase tracking-widest">{post.user}</p>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 text-white/80 hover:text-primary transition-colors">
                    <Heart size={18} />
                    <span className="text-xs">{post.reactions}</span>
                  </button>
                  <button className="text-white/80 hover:text-secondary transition-colors">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Caption Area */}
            <div className="px-3 pb-4 space-y-2">
              <p className="text-lg font-handwritten leading-relaxed italic">
                "{post.caption}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
