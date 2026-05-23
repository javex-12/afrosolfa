import { Music, Mic, Settings, LogOut, MessageSquare, Sparkles, ShieldCheck, Plus, Image as ImageIcon, Link as LinkIcon, FileAudio, ChevronRight, Globe, Layers, Zap } from 'lucide-react'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[1000] bg-brand-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 bg-brand-accent rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.25)]">
          <Music className="text-black w-10 h-10" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">AFROSOLFA</h2>
          <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="w-full h-full bg-brand-accent"
            />
          </div>
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
    if (isStandalone) setView('dashboard');
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [])

  const enterApp = () => {
    setView('dashboard');
    setActiveTab('chat');
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-accent/30 selection:text-white antialiased">
          {view === 'dashboard' ? (
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
              {/* Pro Sidebar */}
              <aside className="hidden md:flex w-72 border-r border-white/5 bg-brand-zinc flex-col p-8 z-50">
                <div className="flex items-center gap-3 mb-14 cursor-pointer group" onClick={() => setView('landing')}>
                  <div className="w-10 h-10 bg-brand-accent rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Music className="text-black w-6 h-6" />
                  </div>
                  <span className="text-xl font-black tracking-tighter italic uppercase">AFROSOLFA</span>
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
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                        activeTab === item.id 
                        ? 'bg-white/5 text-white border border-white/10 shadow-sm' 
                        : 'text-brand-muted hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-brand-accent' : 'group-hover:text-brand-accent'}`} />
                      <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="pt-8 border-t border-white/5">
                  <button onClick={() => setView('landing')} className="w-full flex items-center gap-4 p-4 text-brand-muted hover:text-red-400 transition-all group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-widest">Exit Workspace</span>
                  </button>
                </div>
              </aside>

              {/* Content Canvas */}
              <main className="flex-1 overflow-hidden relative bg-mesh-gradient">
                <div className="h-full flex flex-col">
                  {/* Mobile Nav Header */}
                  <header className="md:hidden p-6 border-b border-white/5 flex items-center justify-between bg-brand-zinc/80 backdrop-blur-xl z-[100]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                        <Music className="text-black w-5 h-5" />
                      </div>
                      <span className="font-black tracking-tighter italic text-sm">AFROSOLFA</span>
                    </div>
                    <button onClick={() => setActiveTab('settings')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-brand-muted" />
                    </button>
                  </header>

                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="h-full"
                      >
                        {activeTab === 'chat' ? (
                          <ChatAssistant isIntegrated={true} />
                        ) : activeTab === 'analyze' ? (
                          <div className="h-full overflow-y-auto p-6 md:p-12 max-w-5xl mx-auto custom-scrollbar">
                            <AudioAnalyzer />
                          </div>
                        ) : (
                          <div className="h-full overflow-y-auto p-6 md:p-20 max-w-2xl mx-auto">
                              <div className="flex items-center gap-4 mb-16">
                                <div className="p-4 bg-brand-accent/10 rounded-3xl">
                                  <Settings className="text-brand-accent w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Settings</h2>
                              </div>
                              <div className="space-y-6">
                                <section className="p-8 rounded-[2.5rem] bg-brand-zinc border border-white/5 shadow-2xl">
                                  <p className="font-bold text-xl mb-1">Musical Profile</p>
                                  <p className="text-sm text-brand-muted mb-8">Personalize your AI Mentor's responses.</p>
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center cursor-pointer hover:border-brand-accent transition-all">
                                        <p className="text-[10px] font-black uppercase text-brand-muted mb-1">Key Preference</p>
                                        <p className="font-bold">G# Major</p>
                                     </div>
                                     <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center cursor-pointer hover:border-brand-accent transition-all">
                                        <p className="text-[10px] font-black uppercase text-brand-muted mb-1">Solfa Type</p>
                                        <p className="font-bold">Movable Do</p>
                                     </div>
                                  </div>
                                </section>
                                <button onClick={() => {localStorage.removeItem('afrosolfa_chat_history'); window.location.reload()}} className="w-full p-6 rounded-[2rem] border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all">
                                  Clear All Conversations
                                </button>
                              </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Mobile Tabs */}
                  <nav className="md:hidden border-t border-white/5 bg-brand-zinc/80 backdrop-blur-xl flex justify-around p-6 pb-12 z-[100]">
                    {[
                      { id: 'chat', icon: MessageSquare },
                      { id: 'analyze', icon: Mic },
                      { id: 'settings', icon: Settings },
                    ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`transition-all ${activeTab === tab.id ? 'text-brand-accent scale-110' : 'text-brand-muted'}`}
                      >
                        <tab.icon className="w-6 h-6" />
                      </button>
                    ))}
                  </nav>
                </div>
              </main>
            </div>
          ) : (
            <div className="min-h-screen bg-mesh-gradient">
              {/* Nav */}
              <nav className="fixed top-0 w-full z-[100] h-24 flex items-center px-8 md:px-20 justify-between bg-brand-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                    <Music className="text-black w-5 h-5" />
                  </div>
                  <span className="text-xl font-black italic tracking-tighter">AFROSOLFA</span>
                </div>
                <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
                  <a href="#" className="hover:text-white transition-colors">Analyzer</a>
                  <a href="#" className="hover:text-white transition-colors">Library</a>
                  <button onClick={enterApp} className="bg-white text-black px-8 py-3 rounded-full font-black text-[11px] hover:bg-brand-accent transition-all shadow-lg">Enter App</button>
                </div>
              </nav>

              <main className="pt-40 md:pt-60 px-8">
                {/* Hero */}
                <div className="max-w-6xl mx-auto text-center mb-40">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/5 border border-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                      <Sparkles className="w-3 h-3" />
                      The Soul of African Music Intelligence
                    </div>
                    <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.75] uppercase italic mb-12">
                      Afro <br />
                      <span className="text-white/10 outline-text">Solfa.</span>
                    </h1>
                    <p className="text-xl md:text-3xl text-brand-muted max-w-3xl mx-auto mb-20 font-medium leading-tight">
                      Conversational AI for Yoruba hymns, Nigerian gospel piano, and choir mentoring.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                      <button onClick={enterApp} className="w-full sm:w-auto px-16 py-8 bg-brand-accent hover:bg-emerald-400 text-black font-black rounded-[2.5rem] transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] text-xl uppercase tracking-tighter">
                        Start Mentoring
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Bento Grid */}
                <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 pb-40">
                   <div className="md:col-span-8 p-12 rounded-[3.5rem] bg-brand-zinc border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-accent/5 to-transparent pointer-events-none" />
                      <div className="relative z-10">
                        <Zap className="text-brand-accent w-10 h-10 mb-8" />
                        <h3 className="text-4xl font-black tracking-tight mb-4 uppercase">Lightning Fast Analysis</h3>
                        <p className="text-brand-muted max-w-md font-medium text-lg leading-snug">Upload any audio and get key signatures, tempo, and tonic solfa in under 10 seconds.</p>
                      </div>
                      <div className="mt-12 opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700">
                         <div className="flex gap-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 w-12 bg-white/10 rounded-xl" />)}
                         </div>
                      </div>
                   </div>
                   <div className="md:col-span-4 p-12 rounded-[3.5rem] bg-brand-accent flex flex-col justify-between text-black relative overflow-hidden">
                      <div className="absolute -bottom-10 -right-10 opacity-20"><Music className="w-64 h-64" /></div>
                      <h3 className="text-4xl font-black tracking-tight uppercase leading-[0.9]">Built for the Choir.</h3>
                      <button onClick={enterApp} className="flex items-center gap-2 font-black uppercase text-xs tracking-widest mt-12 bg-black text-white self-start px-6 py-3 rounded-full">
                        Join Now <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="md:col-span-4 p-12 rounded-[3.5rem] bg-[#111] border border-white/5 flex flex-col gap-6">
                      <Globe className="text-white/20 w-10 h-10" />
                      <h3 className="text-2xl font-black tracking-tight uppercase">Yoruba Tonal Support</h3>
                      <p className="text-brand-muted font-medium">Understands linguistic pitch for accurate melodic estimation.</p>
                   </div>
                   <div className="md:col-span-8 p-12 rounded-[3.5rem] bg-[#111] border border-white/5 flex flex-col md:flex-row items-center gap-12">
                      <div className="flex-1">
                        <Layers className="text-white/20 w-10 h-10 mb-6" />
                        <h3 className="text-2xl font-black tracking-tight uppercase mb-4">Movable Do Logic</h3>
                        <p className="text-brand-muted font-medium">Automatic transposition for all 12 keys, designed specifically for Nigerian keyboardists.</p>
                      </div>
                      <div className="w-full md:w-64 aspect-video bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center">
                         <Piano className="text-white/10 w-20 h-20" />
                      </div>
                   </div>
                </section>
              </main>

              {/* Chat Preview (Floating on Landing) */}
              <ChatAssistant />

              <footer className="py-20 border-t border-white/5 px-8">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-20">
                    <span className="font-black italic text-xl tracking-tighter uppercase">AFROSOLFA</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">African Music Intelligence © 2026</p>
                 </div>
              </footer>
            </div>
          )}
        </div>
      )}

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,0.2);
        }
      `}</style>
    </>
  )
}

export { Plus, ImageIcon, LinkIcon, FileAudio }
export default App
