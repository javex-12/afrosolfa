import React, { useState, useEffect } from 'react'
import { 
  Music, Mic, Settings, LogOut, MessageSquare, Sparkles, Plus, 
  Download, Trash2, Zap, Layers, Globe, Piano 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'

// --- Types ---
type View = 'landing' | 'dashboard'
type Tab = 'chat' | 'analyze' | 'settings'

function App() {
  const [view, setView] = useState<View>('landing')
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [isLoading, setIsLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  
  // Settings State
  const [userSettings, setUserSettings] = useState({
    preferredKey: localStorage.getItem('afro_pref_key') || 'G# Major',
    solfaType: localStorage.getItem('afro_solfa_type') || 'Movable Do'
  })

  useEffect(() => {
    // PWA Detection & Logic
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) setView('dashboard');

    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [])

  const enterApp = () => {
    setView('dashboard');
    setActiveTab('chat');
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("Installation: Open your browser menu and select 'Add to Home Screen'.");
    }
  }

  const updateSetting = (key: string, value: string) => {
    setUserSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`afro_${key}`, value);
  }

  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <Music className="text-black w-8 h-8" />
          </div>
          <p className="text-emerald-500 font-bold tracking-[0.4em] text-[10px] uppercase">AfroSolfa AI</p>
        </div>
      </div>
    )
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden antialiased">
        {/* Sidebar */}
        <aside className="hidden md:flex w-72 border-r border-white/5 bg-[#080808] flex-col z-50">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Music className="text-black w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight italic uppercase tracking-tighter">AFROSOLFA</span>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'chat', icon: MessageSquare, label: 'AI Mentor' },
                { id: 'analyze', icon: Mic, label: 'Audio Lab' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                    activeTab === item.id ? 'bg-white/5 text-emerald-400 shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest leading-none">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
            <button onClick={() => setView('landing')} className="flex items-center gap-4 text-gray-500 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest">
              <LogOut className="w-4 h-4" /> Exit Workspace
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden p-5 border-b border-white/5 flex items-center justify-between bg-[#080808] backdrop-blur-xl z-[60]">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><Music className="text-black w-5 h-5" /></div>
              <span className="font-bold italic text-sm tracking-tighter uppercase">AFROSOLFA</span>
           </div>
           <button onClick={() => setActiveTab('settings')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Settings className="w-5 h-5 text-gray-500" /></button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative bg-[#050505]">
          <div className="h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-hidden"
              >
                {activeTab === 'chat' ? (
                  <ChatAssistant isIntegrated={true} />
                ) : activeTab === 'analyze' ? (
                  <div className="h-full overflow-y-auto p-6 md:p-16 max-w-5xl mx-auto w-full custom-scrollbar">
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-3 tracking-tight">Audio Lab</h2>
                      <p className="text-gray-500 font-medium text-lg">Analyze recordings into tonic solfa and MIDI notes.</p>
                    </div>
                    <AudioAnalyzer />
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-8 md:p-20 max-w-2xl mx-auto w-full">
                      <h2 className="text-4xl font-bold uppercase italic tracking-tighter mb-16">Preferences</h2>
                      <div className="space-y-10">
                        <section className="space-y-6">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Musical Profile</p>
                           <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between">
                              <div>
                                <p className="font-bold text-xl">Preferred Key</p>
                                <p className="text-sm text-gray-500">Global default for transcription.</p>
                              </div>
                              <select 
                                value={userSettings.preferredKey}
                                onChange={(e) => updateSetting('preferredKey', e.target.value)}
                                className="bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-emerald-400 outline-none focus:border-emerald-500 transition-all"
                              >
                                {['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'].map(k => (
                                  <option key={k} value={`${k} Major`}>{k} Major</option>
                                ))}
                              </select>
                           </div>
                        </section>

                        <section className="space-y-6 pt-10 border-t border-white/5">
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">System</p>
                           <div className="space-y-4">
                              <button onClick={handleInstall} className="w-full p-6 bg-white text-black rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all uppercase tracking-widest text-xs">
                                <Download className="w-5 h-5" /> Install Offline App
                              </button>
                              <button onClick={clearAllData} className="w-full p-6 bg-red-500/10 text-red-500 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs">
                                <Trash2 className="w-5 h-5" /> Reset Local Engine
                              </button>
                           </div>
                        </section>
                      </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Nav */}
          <nav className="md:hidden border-t border-white/5 bg-[#080808] flex justify-around p-6 pb-12 z-[100]">
              {[
                { id: 'chat', icon: MessageSquare },
                { id: 'analyze', icon: Mic },
                { id: 'settings', icon: Settings },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)} 
                  className={`transition-all duration-300 ${activeTab === tab.id ? 'text-emerald-500 scale-125' : 'text-gray-500'}`}
                >
                  <tab.icon className="w-6 h-6" />
                </button>
              ))}
          </nav>
        </main>
      </div>
    )
  }

  // --- Premium Landing Page ---
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col antialiased">
      <nav className="h-24 flex items-center px-8 md:px-20 justify-between max-w-7xl mx-auto w-full z-[100]">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:rotate-6 transition-transform">
            <Music className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">AFROSOLFA</span>
        </div>
        <div className="flex items-center gap-10">
          <button onClick={enterApp} className="hidden sm:block text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Launch Dashboard</button>
          <button onClick={enterApp} className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-white/5">Open App</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 flex-1 flex flex-col justify-center py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full mb-10 uppercase tracking-[0.4em]">
            <Sparkles className="w-3 h-3" /> Conversational AI For African Music
          </div>
          <h1 className="text-6xl md:text-9xl font-black leading-[0.85] mb-12 uppercase italic tracking-tighter">
            Unlock the <br />
            <span className="text-gray-800">Soul of Solfa.</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-500 mb-16 leading-tight max-w-2xl font-medium">
            An AI Mentor designed for church keyboardists, choir directors, and Yoruba hymn lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={enterApp} className="px-12 py-7 bg-emerald-500 text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_50px_rgba(16,185,129,0.25)] transition-all">
              Enter Workspace
            </button>
            <button onClick={handleInstall} className="px-12 py-7 bg-white/5 border border-white/10 text-white font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Install App
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-40">
           {[
             { label: 'Key Identification', icon: Zap },
             { label: 'Tonic Solfa', icon: Layers },
             { label: 'Yoruba Dialects', icon: Globe },
             { label: 'Piano Training', icon: Piano }
           ].map((f, i) => (
             <div key={i} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group cursor-default">
                <f.icon className="w-8 h-8 text-emerald-500 mb-8 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{f.label}</h3>
             </div>
           ))}
        </section>
      </main>

      <footer className="h-40 flex items-center px-8 opacity-20 border-t border-white/5 mt-20">
         <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <span className="font-black italic text-sm tracking-widest">AFROSOLFA AI</span>
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Lagos • London • 2026</p>
         </div>
      </footer>
    </div>
  )
}

export default App