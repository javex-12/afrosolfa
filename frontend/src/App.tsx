import { Music, Mic, Settings, LogOut, MessageSquare, Sparkles, Upload, Trash2, ShieldCheck, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio } from 'lucide-react'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useEffect } from 'react'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'settings'>('chat')

  // Auto-enter if in standalone mode
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setView('dashboard')
    }
  }, [])

  const enterApp = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('dashboard');
    setActiveTab('chat');
  }

  const clearHistory = () => {
    localStorage.removeItem('afrosolfa_chat_history');
    window.location.reload();
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0d0d0d] flex-col p-6 z-50">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Music className="text-black w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">AfroSolfa AI</span>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'chat', icon: MessageSquare, label: 'Chat' },
              { id: 'analyze', icon: Mic, label: 'Audio Lab' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-white/5 text-white border border-white/10' 
                  : 'text-gray-500 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <button onClick={() => setView('landing')} className="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-white transition-all">
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Exit</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
           <div className="flex items-center gap-2">
              <Music className="text-emerald-500 w-6 h-6" />
              <span className="font-bold">AfroSolfa</span>
           </div>
           <button onClick={() => setActiveTab('settings')}><Settings className="w-5 h-5 text-gray-500" /></button>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden relative bg-[#0a0a0a]">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'chat' ? (
                <ChatAssistant isIntegrated={true} />
              ) : activeTab === 'analyze' ? (
                <div className="max-w-4xl mx-auto p-6 md:p-12"><AudioAnalyzer /></div>
              ) : (
                <div className="max-w-2xl mx-auto p-6 md:p-20 space-y-12">
                    <h2 className="text-3xl font-bold">Settings</h2>
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="font-bold">Chat History</p>
                            <p className="text-sm text-gray-500">Wipe all local AI conversations.</p>
                         </div>
                         <button onClick={clearHistory} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Clear</button>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                         <div>
                            <p className="font-bold">Cloud Connectivity</p>
                            <p className="text-sm text-gray-500">Live sync with Supabase.</p>
                         </div>
                         <ShieldCheck className="text-emerald-500 w-5 h-5" />
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-t border-white/5 bg-[#0d0d0d] flex justify-around p-4">
            <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'text-emerald-500' : 'text-gray-500'}><MessageSquare /></button>
            <button onClick={() => setActiveTab('analyze')} className={activeTab === 'analyze' ? 'text-emerald-500' : 'text-gray-500'}><Mic /></button>
            <button onClick={() => setView('landing')} className="text-gray-500"><LogOut /></button>
        </nav>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-emerald-500/30">
      <nav className="fixed top-0 w-full z-[100] h-20 flex items-center px-6 md:px-12 justify-between bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Music className="text-emerald-500 w-7 h-7" />
          <span className="text-xl font-bold tracking-tight">AfroSolfa AI</span>
        </div>
        <button onClick={enterApp} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-400 transition-all">Open App</button>
      </nav>

      <main className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-10">
          <Sparkles className="w-3 h-3" />
          Powered by Claude-style Intelligence
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
          The AI Mentor for <br />
          <span className="text-gray-500">African Musicians.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Ask questions, upload audio, or transcribe hymns. Experience the first music assistant built for the soul of Africa.
        </p>
        <button onClick={enterApp} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 text-lg">
          Start Conversation
        </button>
      </main>
      <ChatAssistant />
    </div>
  )
}

export { Plus, ImageIcon, LinkIcon, FileAudio }
export default App