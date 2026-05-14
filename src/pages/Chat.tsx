import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  is_read?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });

    fetchMessages();

    const channel = supabase
      .channel('chat_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) setMessages(data);
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUserId) return;

    const { error } = await supabase.from('messages').insert([{
      text: text,
      sender_id: currentUserId,
    }]);
    
    if (error) console.error("Error sending message:", error);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] glass-panel rounded-[2.5rem] overflow-hidden border-white/10 shadow-2xl">
      <ChatHeader />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 no-scrollbar bg-gradient-to-b from-[#050506]/50 to-transparent"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500 opacity-50" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Restoring connection...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 px-6">
            <div className="p-8 rounded-[3rem] bg-rose-500/5 text-rose-400 border border-rose-500/10">
              <MessageCircle size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif text-white">Silence is beautiful</p>
              <p className="text-xs text-gray-400 italic max-w-[200px] leading-relaxed">
                But whispers are better. Start our secret conversation here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isMe={msg.sender_id === currentUserId} 
              />
            ))}
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
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

