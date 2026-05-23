import { Music, Search, Mic, Settings, LogOut, MessageSquare, Sparkles, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState } from 'react'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'library'>('chat')

  // Navigation Helper
  const enterApp = () => {
    setView('dashboard');
    setActiveTab('chat');
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 flex flex-col items-center md:items-stretch p-4 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <Music className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter hidden md:block italic">AFROSOLFA</span>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
              { id: 'analyze', icon: Mic, label: 'Audio Lab' },
              { id: 'library', icon: Search, label: 'Hymn Search' },
            ].map((item) => (
              <button
                key={item.id}
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
            <button className="w-full flex items-center gap-3 p-4 text-gray-500 hover:text-white transition-all">
              <Settings className="w-5 h-5" />
              <span className="font-bold text-sm hidden md:block">Settings</span>
            </button>
            <button onClick={() => setView('landing')} className="w-full flex items-center gap-3 p-4 text-red-400/50 hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm hidden md:block">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent">
          <div className="h-full flex flex-col">
            <header className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeTab === 'chat' ? 'Conversational AI' : 'Music Analysis'}
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  {activeTab === 'chat' ? 'AI Mentor' : activeTab === 'analyze' ? 'Audio Lab' : 'Hymn Library'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setActiveTab('analyze')} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-xs font-bold">
                   <Upload className="w-4 h-4" /> Upload Audio
                 </button>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-[#0a0a0a]" />
              </div>
            </header>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto h-full">
                {activeTab === 'chat' ? (
                  <div className="h-[calc(100vh-180px)]">
                     {/* We will pass a prop to make it full-screen/integrated */}
                     <ChatAssistant isIntegrated={true} />
                  </div>
                ) : activeTab === 'analyze' ? (
                  <AudioAnalyzer />
                ) : (
                  <div className="text-center py-20">
                    <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
                    <h3 className="text-xl font-bold">Hymn Search Coming Soon</h3>
                    <p className="text-gray-500">Ask the AI Assistant for any hymn in the meantime!</p>
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
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Music className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">AFROSOLFA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-gray-400">
            <button onClick={enterApp} className="hover:text-emerald-400 transition-colors">Start Chatting</button>
            <button onClick={enterApp} className="hover:text-emerald-400 transition-colors">Analyzer</button>
            <button 
              onClick={enterApp}
              className="bg-white text-black px-8 py-3 rounded-full hover:bg-emerald-400 transition-all font-black shadow-xl shadow-white/5"
            >
              Enter App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-48 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Sparkles className="w-3 h-3" />
                Conversational Music Intelligence
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                Chat with the <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">
                  Soul of Africa.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                Upload a recording or just ask a question. Get tonic solfa, key signatures, and musical history instantly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={enterApp}
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 group"
                >
                  <MessageSquare className="w-5 h-5" />
                  Start AI Chat
                </button>
                <button 
                   onClick={enterApp}
                   className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <Search className="w-5 h-5" />
                  Try Analyzer
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Floating Chat for Landing Page Only */}
      {view === 'landing' && <ChatAssistant />}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-50">
           <span className="font-black italic tracking-tighter">AFROSOLFA</span>
           <p className="text-xs font-bold uppercase tracking-widest">Built for African Music Excellence</p>
        </div>
      </footer>
    </div>
  )
}

export default App