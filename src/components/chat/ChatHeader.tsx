import { ArrowLeft, Phone, Video, MoreHorizontal, ShieldCheck, Zap, Sparkles, History, Fingerprint, Wind, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { twMerge } from 'tailwind-merge';

interface ChatHeaderProps {
  otherUser?: any;
  isOnline?: boolean;
}

export default function ChatHeader({ otherUser, isOnline }: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-warm-100 bg-white/80 backdrop-blur-md z-[100]">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)} 
          className="lg:hidden p-2 h-auto rounded-xl"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-warm-100 overflow-hidden bg-warm-50 flex items-center justify-center">
              {otherUser?.avatar_url ? (
                <img 
                  src={otherUser.avatar_url} 
                  alt={otherUser.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={20} className="text-warm-300" />
              )}
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>
          
          <div>
            <h1 className="text-base font-bold text-charcoal leading-none">
              {otherUser?.display_name || otherUser?.username || 'Our Sanctuary'}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={twMerge(
                "text-[10px] font-bold uppercase tracking-wider",
                isOnline ? "text-emerald-600" : "text-warm-400"
              )}>
                {isOnline ? "Live Frequency" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <IconButton icon={Phone} />
        <IconButton icon={Video} />
        <IconButton icon={MoreHorizontal} />
      </div>
    </header>
  );
}

function IconButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-2.5 text-warm-400 hover:text-charcoal hover:bg-warm-50 rounded-xl transition-all">
      <Icon size={20} />
    </button>
  );
}
