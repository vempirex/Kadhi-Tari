import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, MoreVertical, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const mockMessages = [
  { id: 1, text: "Did you see that reel I sent? 😂", sender: "Friend", time: "10:24 PM" },
  { id: 2, text: "Wait, which one? You sent like 50 today", sender: "Me", time: "10:25 PM" },
  { id: 3, text: "The one with the cat trying to jump but failing miserably", sender: "Friend", time: "10:25 PM" },
  { id: 4, text: "Ahhh yes! That was gold 💀", sender: "Me", time: "10:26 PM" },
  { id: 5, text: "Anyway, how's your day going?", sender: "Friend", time: "10:26 PM" },
];

export default function Chat() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <header className="flex justify-between items-center px-2 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Friend" alt="Avatar" />
            </div>
          </div>
          <div>
            <h1 className="font-medium">Friend</h1>
            <p className="text-xs text-green-400">Typing...</p>
          </div>
        </div>
        <MoreVertical size={20} className="text-gray-400" />
      </header>

      <div className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
        {mockMessages.map((msg, i) => {
          const isMe = msg.sender === "Me";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{msg.time}</p>
                  {isMe && <CheckCheck size={12} className="text-primary" />}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="pt-4 pb-2">
        <div className="glass-card rounded-full p-2 flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <ImageIcon size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 placeholder:text-gray-600"
          />
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Smile size={20} />
          </button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-primary text-background"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
