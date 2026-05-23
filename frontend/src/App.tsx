import { Music, Mic, Settings, LogOut, MessageSquare, Sparkles, ShieldCheck, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio } from 'lucide-react'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useEffect, useLayoutEffect } from 'react'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'settings'>('chat')

  // CRITICAL: Force Dashboard if PWA
  useLayoutEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setView('dashboard');
    }
  }, [])

  const enterApp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setView('dashboard');
    setActiveTab('chat');
  }

  const clearHistory = () => {
    localStorage.removeItem('afrosolfa_chat_history');
    window.location.reload();
  }

  // If we are in Dashboard mode (PWA or Web-App)
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0d0d0d] flex-col p-6 z-50">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Music className="text-black w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight uppercase tracking-tighter italic">AFROSOLFA</span>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'chat', icon: MessageSquare, label: 'AI Mentor' },
              { id: 'analyze', icon: Mic, label: 'Audio Lab' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-white/5 text-white border border-white/10' 
                  : 'text-gray-500 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setView('landing')} 
              className="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Exit App</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d] z-[60]">
           <div className="flex items-center gap-2">
              <Music className="text-emerald-500 w-6 h-6" />
              <span className="font-bold tracking-tighter italic">AFROSOLFA</span>
           </div>
           <button onClick={() => setActiveTab('settings')}><Settings className="w-5 h-5 text-gray-500" /></button>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden relative bg-[#0a0a0a]">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === 'chat' ? (
                <ChatAssistant isIntegrated={true} />
              ) : activeTab === 'analyze' ? (
                <div className="max-w-4xl mx-auto p-6 md:p-12"><AudioAnalyzer /></div>
              ) : (
                <div className="max-w-2xl mx-auto p-6 md:p-20 space-y-12">
                    <h2 className="text-3xl font-black uppercase">Settings</h2>
                    <div className="space-y-4">
                      <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="font-bold">Chat History</p>
                            <p className="text-sm text-gray-500">Wipe all local AI conversations.</p>
                         </div>
                         <button onClick={clearHistory} className="px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition-all uppercase">Clear</button>
                      </div>
                      <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="font-bold">Server Status</p>
                            <p className="text-sm text-gray-500">Connected to AfroSolfa Cloud Intelligence.</p>
                         </div>
                         <ShieldCheck className="text-emerald-500 w-5 h-5" />
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden border-t border-white/5 bg-[#0d0d0d] flex justify-around p-4 pb-8 z-50">
            <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'text-emerald-500' : 'text-gray-500'}><MessageSquare className="w-6 h-6" /></button>
            <button onClick={() => setActiveTab('analyze')} className={activeTab === 'analyze' ? 'text-emerald-500' : 'text-gray-500'}><Mic className="w-6 h-6" /></button>
            <button onClick={() => setView('landing')} className="text-gray-500"><LogOut className="w-6 h-6" /></button>
        </nav>
      </div>
    )
  }

  // Web Landing Page
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-emerald-500/30">
      <nav className="fixed top-0 w-full z-[100] h-20 flex items-center px-6 md:px-12 justify-between bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Music className="text-emerald-500 w-7 h-7" />
          <span className="text-2xl font-black italic tracking-tighter">AFROSOLFA</span>
        </div>
        <button 
          type="button"
          onClick={() => enterApp()} 
          className="bg-white text-black px-8 py-2.5 rounded-full font-black text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-white/5"
        >
          Open App
        </button>
      </nav>

      <main className="pt-48 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
          <Sparkles className="w-3 h-3" />
          Advanced Music Intelligence
        </div>
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase">
          Talk to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">The Soul.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium">
          The first conversational AI built for African gospel, Yoruba hymns, and choir piano learning.
        </p>
        <button 
          type="button"
          onClick={() => enterApp()} 
          className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-emerald-600/40 text-xl uppercase tracking-tighter"
        >
          Start Chatting
        </button>
      </main>
      
      {/* Floating Chat for Web users to preview */}
      <ChatAssistant />
    </div>
  )
}

export { Plus, ImageIcon, LinkIcon, FileAudio }
export default App
