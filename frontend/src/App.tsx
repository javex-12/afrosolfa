import { 
  Music, Mic, Settings, LogOut, MessageSquare, Sparkles, Plus, 
  Image as ImageIcon, Link as LinkIcon, FileAudio, ChevronRight, 
  Globe, Layers, Zap, Piano, Download, Trash2, CheckCircle2 
} from 'lucide-react'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { useState, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Types ---
type View = 'landing' | 'dashboard'
type Tab = 'chat' | 'analyze' | 'settings'

function App() {
  const [view, setView] = useState<View>('landing')
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [isLoading, setIsLoading] = useState(true)
  
  // Real Settings State
  const [userSettings, setUserSettings] = useState({
    preferredKey: localStorage.getItem('afro_pref_key') || 'G# Major',
    solfaType: localStorage.getItem('afro_solfa_type') || 'Movable Do',
    aiPersona: 'Expert Mentor'
  })

  // PWA Install Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) setView('dashboard');

    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("To install: Open browser menu and select 'Add to Home Screen' or 'Install App'.");
    }
  }

  const updateSetting = (key: string, value: string) => {
    const newSettings = { ...userSettings, [key]: value };
    setUserSettings(newSettings);
    localStorage.setItem(`afro_${key}`, value);
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
            <Music className="text-black w-8 h-8" />
          </div>
          <p className="text-emerald-500 font-bold tracking-[0.3em] text-[10px] uppercase">Initializing AfroSolfa</p>
        </div>
      </div>
    )
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
        {/* Modern Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-white/5 bg-[#0d0d0d] flex-col">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Music className="text-black w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight">AfroSolfa AI</span>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id ? 'bg-white/5 text-emerald-400' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-8 border-t border-white/5">
            <button onClick={() => setView('landing')} className="flex items-center gap-3 text-gray-500 hover:text-white transition-all">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-semibold">Exit App</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
          {/* Mobile Header */}
          <header className="md:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="text-emerald-500 w-6 h-6" />
              <span className="font-bold">AfroSolfa</span>
            </div>
            <button onClick={() => setActiveTab('settings')}><Settings className="w-5 h-5 text-gray-500" /></button>
          </header>

          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'chat' && <ChatAssistant isIntegrated={true} />}
            {activeTab === 'analyze' && (
              <div className="h-full overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto">
                <header className="mb-10">
                  <h2 className="text-3xl font-bold mb-2">Audio Lab</h2>
                  <p className="text-gray-500">Transcribe audio files into tonic solfa and piano notes.</p>
                </header>
                <AudioAnalyzer />
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="h-full overflow-y-auto p-6 md:p-12 max-w-2xl mx-auto space-y-10">
                <header>
                  <h2 className="text-3xl font-bold mb-2">Settings</h2>
                  <p className="text-gray-500">Manage your musical preferences and app installation.</p>
                </header>

                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Musical Profile</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold">Preferred Key</p>
                        <p className="text-sm text-gray-500">The default key for solfa transcription.</p>
                      </div>
                      <select 
                        value={userSettings.preferredKey}
                        onChange={(e) => updateSetting('preferredKey', e.target.value)}
                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
                      >
                        {['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'].map(k => (
                          <option key={k} value={`${k} Major`}>{k} Major</option>
                        ))}
                      </select>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold">Solfa Notation</p>
                        <p className="text-sm text-gray-500">Choose between Movable or Fixed Do.</p>
                      </div>
                      <div className="flex gap-2">
                        {['Movable Do', 'Fixed Do'].map(type => (
                          <button 
                            key={type}
                            onClick={() => updateSetting('solfaType', type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userSettings.solfaType === type ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-white/5">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Application</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={handleInstall}
                      className="w-full p-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all"
                    >
                      <Download className="w-5 h-5" /> Install App to Device
                    </button>
                    <button 
                      onClick={() => { localStorage.clear(); window.location.reload(); }}
                      className="w-full p-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" /> Clear All Data & Cache
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // --- Landing Page ---
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <nav className="h-20 flex items-center px-6 md:px-20 justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Music className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold">AfroSolfa</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={enterApp} className="text-sm font-bold text-gray-400 hover:text-white transition-all">Log In</button>
          <button onClick={enterApp} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-emerald-500 transition-all">Get Started</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold rounded-full mb-8 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> AI-Powered Music Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
              The First AI Mentor for <span className="text-emerald-500 italic">African Musicians.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
              Upload hymns, detect keys, and transcribe tonic solfa with an AI that understands Yoruba and Nigerian musical cadences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={enterApp} className="px-10 py-5 bg-emerald-500 text-black font-bold rounded-2xl text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all">
                Start Chatting Now
              </button>
              <button onClick={handleInstall} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl text-lg hover:bg-white/10 transition-all">
                Install App
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Key Detection', icon: Zap, color: 'text-yellow-500' },
              { label: 'Tonic Solfa', icon: Layers, color: 'text-emerald-500' },
              { label: 'Yoruba Hymns', icon: Globe, color: 'text-blue-500' },
              { label: 'Piano Notes', icon: Piano, color: 'text-purple-500' }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all">
                <f.icon className={`${f.color} w-10 h-10 mb-6`} />
                <h3 className="font-bold text-xl">{f.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-40">
           <span className="font-bold text-xl">AFROSOLFA</span>
           <p className="text-xs font-bold uppercase tracking-widest mt-4 md:mt-0">Built for the Throne • 2026</p>
        </div>
      </footer>
      
      {view === 'landing' && <ChatAssistant />}
    </div>
  )
}

export { Plus, ImageIcon, LinkIcon, FileAudio }
export default App
