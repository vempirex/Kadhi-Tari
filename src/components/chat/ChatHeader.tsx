import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  otherUser?: any;
}

export default function ChatHeader({ otherUser }: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors lg:hidden"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-400 shadow-lg shadow-rose-500/10">
              <div className="w-full h-full rounded-full bg-[#050506] overflow-hidden">
                <img 
                  src={otherUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Love"} 
                  alt={otherUser?.username} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050506] rounded-full shadow-sm shadow-green-500/50" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-none">
              {otherUser?.display_name || otherUser?.username || 'Our Sanctuary'}
            </h1>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-[0.1em] mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              Online Now
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <IconButton icon={Phone} />
        <IconButton icon={Video} />
        <IconButton icon={MoreVertical} />
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-2.5 text-gray-400 hover:text-white transition-all hover:bg-white/5 rounded-2xl active:scale-90">
      <Icon size={20} />
    </button>
  );
}
