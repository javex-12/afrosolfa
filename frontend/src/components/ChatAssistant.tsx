import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, User, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ChatAssistantProps {
  isIntegrated?: boolean;
}

const HISTORY_KEY = 'afrosolfa_chat_history';

// Local Mock Database for when Render/Network fails
const LOCAL_KNOWLEDGE: Record<string, string> = {
  "hello": "Bawo ni! I am AfroSolfa AI. How can I help with your music today?",
  "yoruba hymn": "Yoruba hymns often use the Pentatonic or Diatonic scale. I can help you find the solfa for many standard hymns. Which number are you looking for?",
  "g# major": "G# Major is a common key in Nigerian worship. Its notes are G#, A#, C, C#, D#, F, and G. In Tonic Solfa, G# is 'Doh'.",
  "doh": "In the Movable Do system, 'Doh' is the root note (Tonal Center) of whatever key you are playing in.",
  "church": "AfroSolfa was built specifically to help church keyboardists and choir members learn faster."
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isIntegrated = false }) => {
  const [isOpen, setIsOpen] = useState(isIntegrated);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'ai', content: "Ek’abo! I am your AI Mentor. I specialize in Yoruba hymns, tonic solfa, and African gospel piano. What are we working on?" }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const getLocalResponse = (query: string): string => {
    const lowQuery = query.toLowerCase();
    for (const key in LOCAL_KNOWLEDGE) {
      if (lowQuery.includes(key)) return LOCAL_KNOWLEDGE[key];
    }
    return "I'm having a bit of trouble reaching my online brain, but I'm still here! Ask me about Yoruba hymns, keys, or tonic solfa.";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      let apiUrl = (import.meta as any).env?.VITE_API_URL || 'https://afrosolfa-api.onrender.com/api/v1';
      const response = await axios.post(`${apiUrl}/chat`, { 
        message: userMsg,
        context: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      }, { timeout: 8000 }); // 8 second timeout
      
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      // SMART FALLBACK
      const fallback = getLocalResponse(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const chatUI = (
    <div className={`flex flex-col h-full ${!isIntegrated ? 'fixed bottom-6 right-6 w-[400px] h-[600px] bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-[500]' : 'w-full bg-[#0a0a0a]'}`}>
      {!isIntegrated && (
        <div className="p-6 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm uppercase">AI Mentor</span>
          </div>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto custom-scrollbar ${isIntegrated ? 'max-w-3xl mx-auto w-full px-6 py-12' : 'p-6'}`}>
        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`text-[15px] leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl rounded-tr-none border border-emerald-500/20' : 'text-gray-300 p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/5'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
              <div className="bg-white/5 p-4 rounded-2xl flex gap-1.5 items-center border border-white/5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-6 ${isIntegrated ? 'max-w-3xl mx-auto w-full' : ''}`}>
        <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 p-2 shadow-xl">
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400"
              >
                <Plus className={`w-5 h-5 transition-transform ${showMenu ? 'rotate-45' : ''}`} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about music, hymns, or keys..."
                className="flex-1 bg-transparent border-none py-3 text-sm focus:ring-0 placeholder:text-gray-600"
              />

              <button 
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:bg-emerald-400 transition-all"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {chatUI}
          </motion.div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all z-[500]"
          >
            <Sparkles className="text-white w-7 h-7" />
          </button>
        )}
      </AnimatePresence>
    </>
  );
};