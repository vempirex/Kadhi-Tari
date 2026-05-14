import { ArrowLeft, Phone, Video, MoreHorizontal, ShieldCheck, Zap, Sparkles, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ChatHeaderProps {
  otherUser?: any;
}

export default function ChatHeader({ otherUser }: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-6 sm:px-12 py-8 flex items-center justify-between border-b border-white/5 bg-black/[0.1] backdrop-blur-[40px] z-30 relative overflow-hidden">
      {/* Cinematic Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rose-500/[0.05] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-orange-500/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-8 relative z-10">
        <Button 
          variant="glass"
          size="sm"
          onClick={() => navigate(-1)} 
          className="rounded-[1.5rem] p-4 h-auto aspect-square border-white/10 lg:hidden group shadow-2xl hover:bg-rose-500/10"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="relative group/chat-avatar">
            <div className="w-16 h-16 rounded-[2.2rem] p-[3px] bg-gradient-to-tr from-rose-500 via-orange-400 to-rose-500 shadow-2xl shadow-rose-500/30 group-hover/chat-avatar:scale-105 transition-all duration-700 group-hover/chat-avatar:rotate-3">
              <div className="w-full h-full rounded-[2rem] bg-[#050506] overflow-hidden border-[5px] border-[#050506]">
                <img 
                  src={otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || 'Love'}`} 
                  alt={otherUser?.username} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover/chat-avatar:scale-110" 
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#050506] rounded-full flex items-center justify-center p-[2px] shadow-2xl">
              <div className="w-full h-full rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-xl sm:text-2xl text-white tracking-tight leading-none group-hover/chat-avatar:text-rose-400 transition-colors">
              {otherUser?.display_name || otherUser?.username || 'Our Sanctuary'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/5 border border-rose-500/10">
                <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[9px] text-rose-400 font-black uppercase tracking-[0.4em]">Live Resonance</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 opacity-30">
                <History size={10} className="text-gray-500" />
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">Encrypted Thread</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 relative z-10">
        <IconButton icon={Phone} />
        <IconButton icon={Video} />
        <IconButton icon={MoreHorizontal} />
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-5 text-gray-600 hover:text-rose-400 transition-all duration-700 hover:bg-white/[0.02] rounded-[1.8rem] active:scale-90 border border-transparent hover:border-white/5 group shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/[0.02] transition-colors" />
      <Icon size={24} className="group-hover:scale-110 transition-transform relative z-10" />
    </button>
  );
}
