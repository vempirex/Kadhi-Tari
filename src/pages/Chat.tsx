import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Heart, Sparkles, Zap, Shield, 
  SendHorizontal, History, ArrowDown, Fingerprint,
  MessageSquare, Loader2
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
  receiver_id: string;
  created_at: string;
  is_read?: boolean;
  image_url?: string;
  message_type: 'text' | 'image';
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<any>(null);

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

    // Realtime Channel for Messaging & Presence
    const channel = supabase.channel('chat_realtime', {
      config: {
        presence: {
          key: currentUserId || 'anon',
        },
      },
    });

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => {
          if (prev.some(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const onlineIds = Object.keys(newState);
        setOnlineUsers(onlineIds);
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.userId === otherUser?.id) {
          setIsOtherUserTyping(payload.isTyping);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && currentUserId) {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, otherUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherUserTyping]);

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

  const handleTyping = (isTyping: boolean) => {
    if (!currentUserId) return;
    const channel = supabase.channel('chat_realtime');
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId, isTyping },
    });
  };

  const handleSendMessage = async (text: string, imageUrl?: string) => {
    if (!currentUserId || !otherUser) return;

    const { error } = await supabase.from('messages').insert([{
      text: text,
      sender_id: currentUserId,
      receiver_id: otherUser.id,
      image_url: imageUrl,
      message_type: imageUrl ? 'image' : 'text'
    }]);
    
    if (error) console.error("Error sending message:", error);
    
    // Immediately stop typing indicator after send
    handleTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white border border-warm-100 rounded-3xl overflow-hidden shadow-soft relative">
      <ChatHeader 
        otherUser={otherUser} 
        isOnline={onlineUsers.includes(otherUser?.id)} 
      />

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 relative z-10 scroll-smooth no-scrollbar bg-warm-50/10"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 size={24} className="animate-spin text-rose-500" />
            <p className="text-[10px] text-warm-400 font-bold uppercase tracking-widest italic">Syncing...</p>
          </div>
        ) : messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6 px-6"
          >
            <div className="p-10 bg-warm-50 rounded-full text-warm-200 border border-warm-100">
              <MessageSquare size={64} strokeWidth={1} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-charcoal">A Beautiful Silence</h2>
              <p className="text-sm font-medium text-warm-400 max-w-xs mx-auto">
                Start your shared journey here. Every whisper is a step closer.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 pb-4">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-warm-100" />
                <div className="px-3 py-1 rounded-full bg-rose-50 text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                   Sanctuary Established
                </div>
                <div className="w-10 h-px bg-warm-100" />
              </div>
            </div>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isMe={msg.sender_id === currentUserId} 
              />
            ))}
            
            {isOtherUserTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-2 bg-warm-100/50 w-fit rounded-2xl rounded-tl-sm"
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-warm-400 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] font-bold text-warm-500 uppercase tracking-widest">
                  {otherUser?.display_name || 'Soulmate'} is typing...
                </span>
              </motion.div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-6 right-6 p-3 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors z-50"
            >
              <ArrowDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-warm-100 bg-white">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
}
