import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, MoreVertical, CheckCheck, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
    };

    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUserId) return;

    const newMessage = {
      text: inputText,
      sender_id: currentUserId,
      sender_name: 'Me' // This could be fetched from user profile
    };

    const { error } = await supabase.from('messages').insert([newMessage]);
    
    if (error) {
      console.error("Error sending message:", error);
    } else {
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background text-white">
      <header className="flex justify-between items-center px-2 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Friend" alt="Avatar" />
            </div>
          </div>
          <div>
            <h1 className="font-medium">Private Chat</h1>
            <p className="text-xs text-green-400">Live</p>
          </div>
        </div>
        <MoreVertical size={20} className="text-gray-400" />
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-3xl ${
                    isMe 
                      ? 'bg-primary text-background rounded-tr-none shadow-lg shadow-primary/10' 
                      : 'glass-card rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 px-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {isMe && <CheckCheck size={12} className="text-primary" />}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="pt-4 pb-2">
        <div className="glass-card rounded-full p-2 flex items-center gap-2">
          <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
            <ImageIcon size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 placeholder:text-gray-600"
          />
          <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Smile size={20} />
          </button>
          <motion.button 
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-primary text-background"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}

