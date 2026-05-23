import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, User, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio } from 'lucide-react';
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
      { role: 'ai', content: "Ek’abo! I am AfroSolfa AI. I can help you find keys, transcribe solfa for Yoruba hymns, or help you understand Nigerian gospel progressions. What are we working on today?" }
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
      let apiUrl = (import.meta as any).env?.VITE_API_URL || 'https://afrosolfa-api.onrender.com/api/v1';
      const response = await axios.post(`${apiUrl}/chat`, { 
        message: userMsg,
        context: messages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an issue connecting. Please check your internet or ensured the backend on Render is live." }]);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: ImageIcon, label: 'Identify Hymn (OCR)', action: () => console.log('Image upload') },
    { icon: FileAudio, label: 'Audio Analysis', action: () => console.log('Audio upload') },
    { icon: LinkIcon, label: 'YouTube Link', action: () => console.log('Link paste') },
  ];

  const chatUI = (
    <div className={`flex flex-col h-full ${!isIntegrated ? 'w-[400px] h-[600px] bg-brand-zinc border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden' : 'w-full bg-transparent'}`}>
      {!isIntegrated && (
        <div className="p-8 border-b border-white/5 bg-brand-accent/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-black">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-white tracking-tight uppercase italic text-sm">AfroSolfa AI</h4>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[9px] text-brand-accent font-black uppercase tracking-widest">Live</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-brand-muted" /></button>
        </div>
      )}

      {/* Message Canvas */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto custom-scrollbar ${isIntegrated ? 'max-w-3xl mx-auto w-full px-6 py-20 md:py-32' : 'p-6'}`}>
        <div className="space-y-16">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-white/5 border border-white/5' : 'bg-brand-accent shadow-lg shadow-brand-accent/20'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-brand-muted" /> : <Bot className="w-5 h-5 text-black" />}
              </div>
              <div className={`text-lg leading-[1.6] max-w-[85%] font-medium ${msg.role === 'user' ? 'text-right text-brand-accent' : 'text-white/90'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center"><Bot className="w-5 h-5 text-black" /></div>
              <div className="flex gap-2 items-center px-6 py-4 bg-white/[0.03] rounded-[2rem] border border-white/5">
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Claude Input Bar */}
      <div className={`p-8 pb-12 ${isIntegrated ? 'max-w-3xl mx-auto w-full' : ''}`}>
        <div className="relative bg-white/[0.03] rounded-[2.5rem] border border-white/5 p-2 shadow-2xl focus-within:border-brand-accent/30 transition-all">
           <div className="flex items-center gap-2 px-2">
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-all text-brand-muted"
                >
                  <Plus className={`w-6 h-6 transition-transform ${showMenu ? 'rotate-45' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-6 w-64 bg-brand-zinc border border-white/10 rounded-[2.5rem] shadow-2xl p-3 z-[200]"
                    >
                      {menuItems.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => { item.action(); setShowMenu(false); }}
                          className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] rounded-3xl text-sm font-black text-brand-muted hover:text-brand-accent transition-all uppercase tracking-tighter"
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
                placeholder="Ask your AI Mentor..."
                className="flex-1 bg-transparent border-none py-4 px-3 text-lg font-medium focus:ring-0 placeholder:text-zinc-700"
              />

              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-[1.5rem] bg-white text-black disabled:bg-white/5 disabled:text-zinc-800 flex items-center justify-center transition-all shadow-xl shadow-white/5 hover:bg-brand-accent"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
        <p className="text-[9px] text-zinc-700 text-center mt-6 uppercase tracking-[0.4em] font-black">Powered by Groq • Designed for the Afro-Pianist</p>
      </div>
    </div>
  );

  if (isIntegrated) return chatUI;

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="origin-bottom-right"
          >
            {chatUI}
          </motion.div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-20 h-20 bg-brand-accent rounded-[2.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 hover:rotate-6 transition-all"
          >
            <Sparkles className="text-black w-8 h-8" />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};
