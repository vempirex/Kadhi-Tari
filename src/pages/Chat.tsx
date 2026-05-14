import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, MoreVertical, CheckCheck, Loader2, Phone, Video, Search, MessageCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  is_read?: boolean;
  profiles?: {
    username: string;
    avatar_url: string;
    display_name: string;
  };
}

export default function Chat() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });

    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, display_name')
          .eq('id', payload.new.sender_id)
          .single();
        
        const newMessage = { ...payload.new, profiles: profile } as Message;
        setMessages((prev) => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(username, avatar_url, display_name)')
      .order('created_at', { ascending: true });
    
    if (!error && data) setMessages(data);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    const messageText = inputText.trim();
    setInputText("");

    const { error } = await supabase.from('messages').insert([{
      text: messageText,
      sender_id: currentUserId,
    }]);
    
    if (error) console.error("Error sending message:", error);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050506] flex flex-col animate-in fade-in slide-in-from-right duration-500">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050506]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-400">
                <div className="w-full h-full rounded-full bg-[#050506] overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Love" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050506] rounded-full" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">Our Sanctuary</h1>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-[0.1em]">Online Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={Phone} />
          <IconButton icon={Video} />
          <IconButton icon={MoreVertical} />
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="p-6 rounded-[2.5rem] bg-rose-500/10 text-rose-400">
              <MessageCircle size={40} />
            </div>
            <p className="text-sm font-medium italic">Start our secret conversation...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={twMerge("flex w-full", isMe ? 'justify-end' : 'justify-start')}
              >
                <div className={twMerge("max-w-[80%] flex flex-col", isMe ? 'items-end' : 'items-start')}>
                  <div className={twMerge(
                    "px-5 py-3 rounded-[1.8rem] shadow-xl text-[15px] leading-relaxed",
                    isMe 
                      ? 'bg-rose-500 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
                  )}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 px-2">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck size={12} className="text-rose-500" />}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div className="h-4" />
      </div>

      {/* Input */}
      <div className="p-6 bg-gradient-to-t from-[#050506] to-transparent">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-white/10 focus-within:border-rose-500/30 transition-all shadow-2xl">
            <button type="button" className="p-3 text-gray-500 hover:text-rose-400 transition-colors">
              <ImageIcon size={20} />
            </button>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Whisper something..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-gray-600"
            />
            <button type="button" className="p-3 text-gray-500 hover:text-rose-400 transition-colors">
              <Smile size={20} />
            </button>
            <motion.button 
              type="submit"
              disabled={!inputText.trim()}
              whileTap={{ scale: 0.9 }}
              className="p-3.5 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon }: any) {
  return (
    <button className="p-2.5 text-gray-400 hover:text-white transition-all hover:bg-white/5 rounded-xl">
      <Icon size={20} />
    </button>
  );
}

