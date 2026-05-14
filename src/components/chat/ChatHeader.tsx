import { ArrowLeft, Phone, Video, MoreHorizontal, ShieldCheck, Zap, Sparkles, History, Fingerprint, Wind, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ChatHeaderProps {
  otherUser?: any;
}

export default function ChatHeader({ otherUser }: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-12 sm:px-[5rem] py-16 flex items-center justify-between border-b-4 border-white/5 bg-black/[0.1] backdrop-blur-[150px] z-[100] relative overflow-hidden shadow-inner">
      {/* Cinematic Accent */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rose-500/[0.1] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-orange-500/[0.08] to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-12 relative z-10">
        <Button 
          variant="glass"
          size="sm"
          onClick={() => navigate(-1)} 
          className="rounded-[4rem] p-12 h-auto aspect-square border-4 border-white/10 lg:hidden group shadow-3xl hover:bg-rose-500/25 active:scale-[0.5] shadow-inner"
        >
          <ArrowLeft size={72} strokeWidth={1} className="group-hover:-translate-x-4 transition-all duration-[1500ms] drop-shadow-3xl" />
        </Button>
        
        <div className="flex items-center gap-16">
          <div className="relative group/chat-avatar">
            <div className="w-[10rem] h-[10rem] sm:w-[13rem] sm:h-[13rem] rounded-[5rem] p-[5px] bg-gradient-to-tr from-rose-800 via-orange-700 to-rose-800 shadow-[0_50px_100px_rgba(0,0,0,1)] group-hover/chat-avatar:scale-125 transition-all duration-[1500ms] group-hover/chat-avatar:rotate-[20deg] shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-all duration-[1500ms]" />
              <div className="w-full h-full rounded-[4.5rem] bg-[#050506] overflow-hidden border-[12px] border-[#050506] relative z-10">
                <img 
                  src={otherUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || 'Love'}`} 
                  alt={otherUser?.username} 
                  className="w-full h-full object-cover transition-all duration-[5000ms] group-hover/chat-avatar:scale-150 grayscale-[0.5] group-hover/chat-avatar:grayscale-0 brightness-[0.7] group-hover/chat-avatar:brightness-[1]" 
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-[3.5rem] h-[3.5rem] bg-[#050506] rounded-full flex items-center justify-center p-[4px] shadow-[0_0_50px_rgba(244,63,94,1)] z-20">
              <div className="w-full h-full rounded-full bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,1)] animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="font-serif text-[7rem] sm:text-[10rem] text-white tracking-tighter leading-none group-hover/chat-avatar:text-rose-400 transition-all duration-[1500ms] italic drop-shadow-3xl">
              {otherUser?.display_name || otherUser?.username || 'Our Sanctuary'}
            </h1>
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-6 px-10 py-2 rounded-full bg-rose-500/15 border-4 border-rose-500/40 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-rose-500/10 blur-[20px]" />
                <span className="w-4 h-4 rounded-full bg-rose-500 animate-ping relative z-10" />
                <span className="text-[16px] text-rose-500 font-black uppercase tracking-[1em] italic relative z-10 drop-shadow-2xl leading-none">Live Resonance</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 opacity-30 italic group-hover:opacity-100 transition-all duration-1000">
                <Fingerprint size={56} strokeWidth={1} className="text-gray-950 drop-shadow-3xl" />
                <span className="text-[14px] text-gray-950 font-black uppercase tracking-[0.8em] leading-none">Synchronized Thread</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8 sm:gap-16 relative z-10">
        <IconButton icon={Phone} />
        <IconButton icon={Video} />
        <IconButton icon={MoreHorizontal} />
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-16 text-gray-950 hover:text-white transition-all duration-[1500ms] hover:bg-white/15 rounded-[4.5rem] active:scale-[0.5] border-4 border-transparent hover:border-white/20 group shadow-[0_40px_100px_rgba(0,0,0,1)] relative overflow-hidden italic shadow-inner">
      <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/[0.08] transition-all duration-[1500ms]" />
      <Icon size={104} strokeWidth={0.1} className="group-hover:scale-150 group-hover:rotate-[20deg] transition-all duration-[1500ms] relative z-10 drop-shadow-3xl" />
    </button>
  );
}
