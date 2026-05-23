import { Music, Search, Mic, Settings, LogOut, MessageSquare, Sparkles, Upload, Trash2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useEffect } from 'react'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'settings'>('chat')
  const [isPWA, setIsPWA] = useState(false)

  // Detect PWA mode
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsPWA(true)
      setView('dashboard') // Auto-enter dashboard if in PWA mode
    }
  }, [])

  const enterApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Entering Dashboard...");
    setView('dashboard');
    setActiveTab('chat');
  }

  const clearHistory = () => {
    localStorage.removeItem('afrosolfa_chat_history');
    window.location.reload();
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 flex flex-col items-center md:items-stretch p-4 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Music className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter hidden md:block italic">AFROSOLFA</span>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { id: 'chat', icon: MessageSquare, label: 'AI Mentor' },
              { id: 'analyze', icon: Mic, label: 'Audio Lab' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm hidden md:block">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-3">
            <button onClick={() => setView('landing')} className="w-full flex items-center gap-3 p-4 text-red-400/50 hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm hidden md:block">Exit App</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent">
          <div className="h-full flex flex-col">
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="md:hidden w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
                  <Music className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase">
                  {activeTab === 'chat' ? 'AI Mentor' : activeTab === 'analyze' ? 'Audio Lab' : 'System Settings'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                 <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase">Live Server</p>
                    <p className="text-[9px] text-gray-500">v0.1.0-beta</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto h-full p-4 md:p-8">
                {activeTab === 'chat' ? (
                  <div className="h-full max-h-[calc(100vh-160px)]">
                     <ChatAssistant isIntegrated={true} />
                  </div>
                ) : activeTab === 'analyze' ? (
                  <AudioAnalyzer />
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <Settings className="text-emerald-500" /> Account Settings
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                            <p className="font-bold text-white">Chat History</p>
                            <p className="text-xs text-gray-500">Clear all local conversations and AI memory.</p>
                          </div>
                          <button 
                            onClick={clearHistory}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all text-xs font-bold"
                          >
                            <Trash2 className="w-4 h-4" /> Reset
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                            <p className="font-bold text-white">Cloud Storage</p>
                            <p className="text-xs text-gray-500">Connected to Supabase audio-uploads.</p>
                          </div>
                          <ShieldCheck className="text-emerald-500 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="text-emerald-500 w-8 h-8" />
            <span className="text-2xl font-black tracking-tighter italic">AFROSOLFA</span>
          </div>
          <button 
            type="button"
            onClick={enterApp}
            className="bg-white text-black px-8 py-3 rounded-full hover:bg-emerald-400 transition-all font-black"
          >
            Open App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-48 pb-32 text-center max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
          <Sparkles className="w-3 h-3" />
          The Soul of African Music
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase">
          Talk to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Your Mentor.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
          The first AI assistant built specifically for Yoruba hymns and African gospel keyboardists.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            type="button"
            onClick={enterApp}
            className="w-full sm:w-auto px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-[2rem] transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3"
          >
            <MessageSquare className="w-6 h-6" />
            Start Chatting
          </button>
          <button 
             type="button"
             onClick={enterApp}
             className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-[2rem] border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Upload className="w-6 h-6" />
            Audio Lab
          </button>
        </div>
      </main>

      {/* Persistent Floating Chat for Landing Page */}
      <ChatAssistant />
    </div>
  )
}

export default App
