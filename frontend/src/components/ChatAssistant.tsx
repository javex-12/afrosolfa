import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Sparkles, User, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ChatAssistantProps {
  isIntegrated?: boolean;
}

const HISTORY_KEY = 'afrosolfa_chat_history';

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isIntegrated = false }) => {
  const [isOpen, setIsOpen] = useState(isIntegrated);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'ai', content: "Hello! I'm AfroSolfa AI. I'm here to help you with African music theory, tonic solfa, or identifying your favorite hymns. How can I assist you today?" }
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Robust API detection with forced Production fallback
      let apiUrl = (import.meta as any).env?.VITE_API_URL;
      if (!apiUrl || apiUrl.includes('localhost')) {
         apiUrl = 'https://afrosolfa-api.onrender.com/api/v1';
      }

      const response = await axios.post(`${apiUrl}/chat`, { 
        message: userMsg,
        context: messages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an issue connecting to the AI brain. Please check your internet or ensured the backend on Render is live." }]);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: ImageIcon, label: 'Upload Image', action: () => console.log('Image upload') },
    { icon: FileAudio, label: 'Upload Audio', action: () => console.log('Audio upload') },
    { icon: LinkIcon, label: 'Paste Link', action: () => console.log('Link paste') },
  ];

  const chatUI = (
    <div className={`flex flex-col h-full ${!isIntegrated ? 'w-[400px] h-[600px] bg-[#111] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden' : 'w-full bg-[#0a0a0a]'}`}>
      {!isIntegrated && (
        <div className="p-8 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-emerald-500" />
            <span className="font-black text-sm uppercase tracking-widest italic">AfroSolfa</span>
          </div>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
      )}

      {/* Message List */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto custom-scrollbar ${isIntegrated ? 'max-w-3xl mx-auto w-full px-6 py-12 md:py-20' : 'p-5'}`}>
        <div className="space-y-12">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-emerald-600 shadow-lg shadow-emerald-500/20'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`text-[16px] leading-relaxed max-w-[85%] font-medium ${msg.role === 'user' ? 'text-right text-emerald-400' : 'text-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
              <div className="flex gap-1.5 items-center px-5 py-3 bg-white/5 rounded-[2rem]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claude-style Input Bar */}
      <div className={`p-6 pb-12 ${isIntegrated ? 'max-w-3xl mx-auto w-full' : ''}`}>
        <div className="relative bg-white/[0.03] rounded-[2.5rem] border border-white/10 p-2 shadow-2xl">
           <div className="flex items-center gap-2 px-2">
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-all text-gray-400"
                >
                  <Plus className={`w-6 h-6 transition-transform ${showMenu ? 'rotate-45' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-6 w-56 bg-[#1a1a1a] border border-white/10 rounded-[2rem] shadow-2xl p-3 z-[100]"
                    >
                      {menuItems.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => { item.action(); setShowMenu(false); }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl text-sm font-black text-gray-400 hover:text-white transition-all uppercase tracking-tighter"
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message AfroSolfa AI..."
                className="flex-1 bg-transparent border-none py-4 px-3 text-base font-medium focus:ring-0 placeholder:text-gray-600"
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-2xl bg-white text-black disabled:bg-gray-800 disabled:text-gray-500 flex items-center justify-center transition-all shadow-xl shadow-white/5"
              >
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>
           </div>
        </div>
        <p className="text-[10px] text-gray-700 text-center mt-6 uppercase tracking-[0.3em] font-black">Powered by Groq Intelligence • African Music Decoded</p>
      </div>
    </div>
  );

  if (isIntegrated) return chatUI;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {chatUI}
        </motion.div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
        >
          <Sparkles className="text-white w-8 h-8" />
        </button>
      )}
    </div>
  );
};
