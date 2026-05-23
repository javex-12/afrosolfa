import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface ChatAssistantProps {
  isIntegrated?: boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isIntegrated = false }) => {
  const [isOpen, setIsOpen] = useState(isIntegrated);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Ek’abo! I am AfroSolfa AI. Ask me anything about Yoruba hymns, tonic solfa, or Nigerian gospel music. How can I help your music journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync open state with integrated prop
  useEffect(() => {
    if (isIntegrated) setIsOpen(true);
  }, [isIntegrated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // Robust API URL detection
      let apiUrl = (import.meta as any).env?.VITE_API_URL;
      
      // If we're on Render or Vercel, try to use the current host or a fallback
      if (!apiUrl || apiUrl === 'http://localhost:8000/api/v1') {
        if (window.location.hostname !== 'localhost') {
           // Fallback to the production render URL if localhost is used in prod
           apiUrl = 'https://afrosolfa-api.onrender.com/api/v1';
        } else {
           apiUrl = 'http://localhost:8000/api/v1';
        }
      }

      const response = await axios.post(`${apiUrl}/chat`, { 
        message: userMsg,
        context: "The user is currently in the AfroSolfa AI Workspace. Provide detailed musical analysis."
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having a bit of trouble connecting to my musical brain (Network Error). Please ensure the backend is live at Render." }]);
    } finally {
      setLoading(false);
    }
  };

  const chatContent = (
    <div className={`flex flex-col h-full ${!isIntegrated ? 'w-[350px] md:w-[400px] h-[500px] bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden' : 'w-full h-full bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden'}`}>
      {/* Header - Only show in floating mode */}
      {!isIntegrated && (
        <div className="p-8 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-white tracking-tight">AfroSolfa AI</h4>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Assistant</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-emerald-500 text-black font-bold rounded-tr-none' 
              : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none flex gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-6 ${isIntegrated ? 'bg-white/[0.02]' : 'bg-black/20'} border-t border-white/5`}>
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question about African music..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isIntegrated) return chatContent;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all group"
      >
        <Sparkles className="text-black w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};