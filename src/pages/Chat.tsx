import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, MoreVertical, CheckCheck, Loader2, Phone, Video, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
  is_read?: boolean;
}

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error && data) setMessages(data);
      setIsLoading(false);
      scrollToBottom();
    };

    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' } as any, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    const messageText = inputText.trim();
    setInputText("");

    const newMessage = {
      text: messageText,
      sender_id: currentUserId,
      sender_name: 'Me' // This could be fetched from user profile
    };

    const { error } = await supabase.from('messages').insert([newMessage]);
    
    if (error) {
      console.error("Error sending message:", error);
      // Optional: Add toast error here
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-[#050506] text-white animate-in slide-in-from-bottom-4 duration-500">
      {/* Chat Header */}
      <header className="flex justify-between items-center px-4 py-4 border-b border-white/5 glass-panel rounded-b-[2rem] z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-400">
              <div className="w-full h-full rounded-full bg-[#050506] flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Friend" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#050506]" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Sanctuary Chat</h1>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online Now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-8 no-scrollbar scroll-smooth"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <MessageCircle size={48} className="text-rose-500/50" />
            <p className="text-sm font-medium italic">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            const showDate = idx === 0 || new Date(messages[idx-1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
            
            return (
              <div key={msg.id} className="space-y-4">
                {showDate && (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/5">
                      {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={twMerge("flex w-full", isMe ? 'justify-end' : 'justify-start')}
                >
                  <div className={twMerge("max-w-[75%] space-y-1.5", isMe ? 'items-end' : 'items-start')}>
                    <div className={twMerge(
                      "px-5 py-3.5 rounded-[1.8rem] shadow-xl transition-all duration-300",
                      isMe 
                        ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-tr-none' 
                        : 'glass-card text-white/90 rounded-tl-none border-white/10'
                    )}>
                      <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                    </div>
                    <div className={twMerge("flex items-center gap-1.5 px-2", isMe ? 'justify-end' : 'justify-start')}>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {isMe && <CheckCheck size={14} className="text-rose-500" />}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card px-4 py-2 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-rose-500/50 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-rose-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-rose-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gradient-to-t from-[#050506] to-transparent">
        <form onSubmit={handleSendMessage} className="relative group">
          <div className="glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-white/10 focus-within:border-rose-500/30 transition-all shadow-2xl">
            <button type="button" className="p-3 text-gray-400 hover:text-rose-400 transition-colors hover:bg-rose-500/5 rounded-full">
              <ImageIcon size={22} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[15px] px-2 placeholder:text-gray-600 text-white font-medium"
            />
            <button type="button" className="p-3 text-gray-400 hover:text-rose-400 transition-colors hover:bg-rose-500/5 rounded-full">
              <Smile size={22} />
            </button>
            <motion.button 
              type="submit"
              disabled={!inputText.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

