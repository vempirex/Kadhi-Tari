import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Sparkles, Zap, Shield, 
  SendHorizontal, History, ArrowDown, Fingerprint,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { twMerge } from 'tailwind-merge';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
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

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 150;
    setShowScrollButton(!isNearBottom);
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
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white/[0.01] backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-rose-500/[0.02] pointer-events-none" />
      
      <ChatHeader otherUser={otherUser} />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 no-scrollbar relative z-10 scroll-smooth"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 size={32} className="animate-spin text-rose-500" />
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[1em] italic">Syncing Frequencies...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-8 px-6"
          >
            <div className="relative">
              <div className="p-12 bg-rose-500/5 rounded-[4rem] text-rose-500/20 border border-rose-500/10">
                <MessageSquare size={120} strokeWidth={0.5} />
              </div>
              <div className="absolute -top-4 -right-4 p-3 rounded-full bg-black border border-white/10 shadow-xl">
                <Sparkles size={24} className="text-rose-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-serif text-white italic">A Beautiful Silence</h2>
              <p className="text-4xl text-gray-400 italic max-w-lg mx-auto font-handwritten opacity-70">
                "In the quiet space between us, our souls speak most clearly. Start our whisper trail here..."
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 pb-8">
            <div className="flex justify-center mb-12 opacity-30">
              <div className="flex items-center gap-6 italic">
                <div className="w-12 h-px bg-rose-500/20" />
                <div className="px-4 py-1 rounded-full border border-rose-500/20 text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] italic">
                   Sanctuary Established
                </div>
                <div className="w-12 h-px bg-rose-500/20" />
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

        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-6 right-6 p-4 rounded-full bg-rose-500 text-white shadow-lg hover:scale-110 transition-transform z-50 group"
            >
              <ArrowDown size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-20 bg-black/20 border-t border-white/5">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
