import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, Heart, Sparkles } from 'lucide-react';
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
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        // In a real app, you'd fetch the specific partner. For now, we fetch the other profile.
        const { data: profiles } = await supabase.from('profiles').select('*').neq('id', user.id).limit(1);
        if (profiles && profiles[0]) setOtherUser(profiles[0]);
      }
      await fetchMessages();
    };

    setupChat();

    const channel = supabase
      .channel('chat_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
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
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] glass-panel rounded-[3rem] overflow-hidden border-white/5 shadow-2xl relative">
      <ChatHeader otherUser={otherUser} />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-2 no-scrollbar bg-gradient-to-b from-[#050506]/30 to-transparent"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-[2rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Heart size={20} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] animate-pulse">Synchronizing Soul Whispers...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-60 px-10">
            <div className="p-10 rounded-[3rem] bg-rose-500/5 text-rose-400 border border-rose-500/10 shadow-inner">
              <MessageCircle size={64} strokeWidth={1} />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-white tracking-tight leading-tight">A Beautiful Silence</h2>
              <p className="text-lg text-gray-400 italic max-w-sm mx-auto leading-relaxed font-handwritten">
                "In the silence, our souls speak most clearly. Start our whisper trail here..."
              </p>
            </div>
            <div className="flex items-center gap-3 text-rose-400/30">
              <Sparkles size={16} />
              <span className="w-1 h-1 rounded-full bg-rose-400/20" />
              <Heart size={16} />
              <span className="w-1 h-1 rounded-full bg-rose-400/20" />
              <Sparkles size={16} />
            </div>
          </div>
        ) : (
          <div className="space-y-2 pb-6">
            <div className="flex justify-center mb-12">
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
                Sanctuary Connection Established
              </div>
            </div>
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

