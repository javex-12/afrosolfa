import { Music, Mic, Settings, LogOut, MessageSquare, Sparkles, ShieldCheck, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio } from 'lucide-react'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] mb-8"
      >
        <Music className="text-black w-12 h-12" />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <h2 className="text-2xl font-black italic tracking-tighter text-white">AFROSOLFA</h2>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full bg-emerald-500"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'settings'>('chat')
  const [isLoading, setIsLoading] = useState(true)

  useLayoutEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setView('dashboard');
    }
    
    // Artificial delay for the "Premium" splash feel
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
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

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-emerald-500/30">
          {view === 'dashboard' ? (
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-700">
              {/* Sidebar - Desktop Only */}
              <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#080808] flex-col p-6 z-50">
                <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setView('landing')}>
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Music className="text-black w-5 h-5" />
                  </div>
                  <span className="text-lg font-black tracking-tighter italic">AFROSOLFA</span>
                </div>

                <nav className="flex-1 space-y-2">
                  {[
                    { id: 'chat', icon: MessageSquare, label: 'AI Mentor' },
                    { id: 'analyze', icon: Mic, label: 'Audio Lab' },
                    { id: 'settings', icon: Settings, label: 'Settings' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                        activeTab === item.id 
                        ? 'bg-white/5 text-white border border-white/10 shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-tighter">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="pt-6 border-t border-white/5">
                  <button onClick={() => setView('landing')} className="w-full flex items-center gap-3 p-4 text-gray-500 hover:text-red-400 transition-all">
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold text-sm uppercase tracking-tighter">Exit</span>
                  </button>
                </div>
              </aside>

              {/* Mobile Header */}
              <header className="md:hidden p-6 border-b border-white/5 flex items-center justify-between bg-[#080808]">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Music className="text-black w-5 h-5" />
                    </div>
                    <span className="font-black tracking-tighter italic">AFROSOLFA</span>
                 </div>
                 <button onClick={() => setActiveTab('settings')}><Settings className="w-5 h-5 text-gray-500" /></button>
              </header>

              <main className="flex-1 overflow-hidden relative bg-[#050505]">
                <div className="h-full flex flex-col">
                  {activeTab === 'chat' ? (
                    <ChatAssistant isIntegrated={true} />
                  ) : activeTab === 'analyze' ? (
                    <div className="max-w-4xl mx-auto p-6 md:p-12 overflow-y-auto w-full"><AudioAnalyzer /></div>
                  ) : (
                    <div className="max-w-2xl mx-auto p-8 md:p-20 space-y-12">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-12">Settings</h2>
                        <div className="space-y-4">
                          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                             <div>
                                <p className="font-bold text-xl mb-1">Chat Memory</p>
                                <p className="text-sm text-gray-500">Wipe all local AI conversations.</p>
                             </div>
                             <button onClick={clearHistory} className="px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl text-xs font-black hover:bg-red-500 hover:text-white transition-all uppercase">Clear</button>
                          </div>
                          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                             <div>
                                <p className="font-bold text-xl mb-1">PWA Status</p>
                                <p className="text-sm text-gray-500">Optimized for standalone experience.</p>
                             </div>
                             <ShieldCheck className="text-emerald-500 w-6 h-6" />
                          </div>
                        </div>
                    </div>
                  )}
                </div>
              </main>

              {/* Mobile Navigation */}
              <nav className="md:hidden border-t border-white/5 bg-[#080808] flex justify-around p-6 pb-10">
                  <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'text-emerald-500' : 'text-gray-500'}><MessageSquare className="w-7 h-7" /></button>
                  <button onClick={() => setActiveTab('analyze')} className={activeTab === 'analyze' ? 'text-emerald-500' : 'text-gray-500'}><Mic className="w-7 h-7" /></button>
                  <button onClick={() => setView('landing')} className="text-gray-500"><LogOut className="w-7 h-7" /></button>
              </nav>
            </div>
          ) : (
            <div className="min-h-screen animate-in fade-in duration-1000">
              <nav className="fixed top-0 w-full z-[100] h-20 flex items-center px-6 md:px-12 justify-between bg-black/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Music className="text-emerald-500 w-7 h-7" />
                  <span className="text-2xl font-black italic tracking-tighter">AFROSOLFA</span>
                </div>
                <button onClick={() => enterApp()} className="bg-white text-black px-8 py-2.5 rounded-full font-black text-sm hover:bg-emerald-400 transition-all shadow-xl">Open App</button>
              </nav>

              <main className="pt-48 pb-20 px-6 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                  <Sparkles className="w-3 h-3" />
                  Premium Music Intelligence
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 leading-[0.8] uppercase italic">
                  Afro <br />
                  <span className="text-gray-800">Solfa.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium">
                  The conversational AI built for African gospel, Yoruba hymns, and choir piano learning.
                </p>
                <button onClick={() => enterApp()} className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-emerald-600/40 text-xl uppercase tracking-tighter">
                  Enter Workspace
                </button>
              </main>
              <ChatAssistant />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export { Plus, ImageIcon, LinkIcon, FileAudio }
export default App