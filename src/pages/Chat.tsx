import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Sparkles, Zap, Shield, SendHorizonal, History, ArrowDown, Fingerprint } from 'lucide-react';
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
    <div className="flex flex-col h-[calc(100vh-16rem)] sm:h-[calc(100vh-20rem)] bg-black/[0.1] backdrop-blur-[100px] rounded-[6rem] sm:rounded-[8rem] overflow-hidden border-2 border-white/5 shadow-[0_150px_450px_rgba(0,0,0,1)] relative group shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-rose-500/[0.06] pointer-events-none" />
      <div className="absolute top-[-30%] left-[-30%] w-[100%] h-[100%] bg-rose-500/[0.1] blur-[220px] rounded-full pointer-events-none group-hover:bg-rose-500/[0.15] transition-all duration-[6000ms] animate-pulse" />
      
      <ChatHeader otherUser={otherUser} />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-12 sm:px-32 py-24 space-y-16 no-scrollbar relative z-10 scroll-smooth"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-[4.5rem] border-2 border-rose-500/10 border-t-rose-500 animate-spin" />
              <Zap size={48} className="absolute inset-0 m-auto text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <p className="text-[14px] text-gray-800 font-black uppercase tracking-[1.2em] animate-pulse italic">Synchronizing Frequencies...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(50px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="h-full flex flex-col items-center justify-center text-center space-y-32 px-20"
          >
            <div className="relative">
              <div className="p-40 bg-rose-500/[0.03] rounded-[8rem] text-rose-500/5 border-2 border-rose-500/10 shadow-inner group-hover:scale-110 transition-all duration-[4000ms]">
                <MessageCircle size={350} strokeWidth={0.1} className="drop-shadow-[0_0_100px_currentColor]" />
              </div>
              <div className="absolute -top-16 -right-16 p-12 rounded-[4rem] bg-[#050506] border-2 border-white/10 shadow-3xl">
                <Sparkles size={100} strokeWidth={1} className="text-rose-500 animate-pulse fill-rose-500" />
              </div>
            </div>
            <div className="space-y-16">
              <h2 className="text-8xl sm:text-[11rem] font-serif text-white tracking-tighter leading-tight italic">A Beautiful Silence</h2>
              <p className="text-5xl text-gray-800 italic max-w-4xl mx-auto leading-relaxed font-handwritten opacity-70">
                "In the quiet space between us, our souls speak most clearly. Start our whisper trail here..."
              </p>
            </div>
            <div className="flex items-center gap-16 text-rose-500/20">
              <div className="w-48 h-[3px] bg-gradient-to-r from-transparent via-current to-current shadow-inner" />
              <Heart size={72} strokeWidth={0.5} className="fill-current animate-pulse drop-shadow-2xl" />
              <div className="w-48 h-[3px] bg-gradient-to-l from-transparent via-current to-current shadow-inner" />
            </div>
          </motion.div>
        ) : (
          <div className="space-y-16 pb-32">
            <div className="flex justify-center mb-48 opacity-30">
              <div className="flex items-center gap-12 italic">
                <div className="w-48 h-[4px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-inner" />
                <div className="px-16 py-6 rounded-full border-2 border-rose-500/30 text-[16px] font-black text-rose-500 uppercase tracking-[1em] backdrop-blur-[60px] shadow-3xl">
                   Sanctuary Frequency Established
                </div>
                <div className="w-48 h-[4px] bg-gradient-to-l from-transparent via-rose-500 to-transparent shadow-inner" />
              </div>
            </div>
            {messages.map((msg, i) => (
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
              initial={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(50px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 100, scale: 0.8, filter: 'blur(50px)' }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-32 right-32 p-12 rounded-[4rem] bg-rose-700 text-white shadow-[0_80px_150px_rgba(244,63,94,0.7)] hover:scale-125 active:scale-90 transition-all z-50 group border-2 border-white/20 shadow-inner"
            >
              <ArrowDown size={72} strokeWidth={1} className="group-hover:translate-y-6 transition-transform duration-[1500ms]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-20">
        <div className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-inner" />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
