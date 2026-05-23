import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ChatAssistantProps {
  isIntegrated?: boolean;
}

const HISTORY_KEY = 'afrosolfa_chat_history';

const LOCAL_KNOWLEDGE: Record<string, string> = {
  "hello": "Bawo ni! I am AfroSolfa AI. How can I help with your music today?",
  "yoruba hymn": "Yoruba hymns often use the Pentatonic or Diatonic scale. I can help you find the solfa for many standard hymns.",
  "g# major": "G# Major is a common key in Nigerian worship. Its notes are G#, A#, C, C#, D#, F, and G.",
  "doh": "In the Movable Do system, 'Doh' is the root note (Tonal Center).",
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isIntegrated = false }) => {
  const [isOpen, setIsOpen] = useState(isIntegrated);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'ai', content: "Ek’abo! I am your AI Mentor. I specialize in Yoruba hymns and tonic solfa. What are we working on today?" }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const getLocalResponse = (query: string): string => {
    const lowQuery = query.toLowerCase();
    for (const key in LOCAL_KNOWLEDGE) {
      if (lowQuery.includes(key)) return LOCAL_KNOWLEDGE[key];
    }
    return "I'm having a bit of trouble reaching my online brain, but I'm still here! Ask me about hymns or keys.";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // @ts-ignore
      let apiUrl = import.meta.env.VITE_API_URL || 'https://afrosolfa-api.onrender.com/api/v1';
      const response = await axios.post(`${apiUrl}/chat`, { 
        message: userMsg,
        context: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      }, { timeout: 10000 });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: getLocalResponse(userMsg) }]);
    } finally {
      setLoading(false);
    }
  };

  const chatUI = (
    <div className={`flex flex-col h-full ${!isIntegrated ? 'fixed bottom-6 right-6 w-[400px] h-[600px] bg-[#0d0d0d] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden z-[500]' : 'w-full bg-transparent'}`}>
      {!isIntegrated && (
        <div className="p-8 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-emerald-500" />
            <span className="font-black text-sm uppercase tracking-widest italic">AfroSolfa</span>
          </div>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/5 border border-white/5' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-gray-500" /> : <Bot className="w-5 h-5 text-black" />}
            </div>
            <div className={`text-lg leading-relaxed max-w-[85%] font-medium ${msg.role === 'user' ? 'text-right text-emerald-400' : 'text-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><Bot className="w-5 h-5 text-black" /></div>
            <div className="flex gap-2 items-center px-6 py-4 bg-white/5 rounded-full border border-white/5">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className={`p-8 pb-12 ${isIntegrated ? 'max-w-4xl mx-auto w-full' : ''}`}>
        <div className="relative bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-2 shadow-2xl">
           <div className="flex items-center gap-2 px-2">
              <button className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-600">
                <Plus className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message AfroSolfa AI..."
                className="flex-1 bg-transparent border-none py-4 px-3 text-lg font-medium focus:ring-0 placeholder:text-zinc-800 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-[1.5rem] bg-white text-black disabled:opacity-10 flex items-center justify-center transition-all shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );

  if (isIntegrated) return chatUI;

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="z-[500]">
            {chatUI}
          </motion.div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl hover:scale-105 transition-all z-[500]"
          >
            <Sparkles className="text-black w-8 h-8" />
          </button>
        )}
      </AnimatePresence>
    </>
  );
};
