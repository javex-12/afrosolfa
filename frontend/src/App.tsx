import { useState } from 'react'
import { Music, Upload, Search, Piano, Mic, Info, LayoutDashboard, History, Settings, LogOut, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { AudioAnalyzer } from './components/AudioAnalyzer'
import { ChatAssistant } from './components/ChatAssistant'
import { PianoKeyboard } from './components/PianoKeyboard'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState('analyze')

  const scrollToAnalyzer = () => {
    setView('dashboard')
  }

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-r border-white/5 bg-black/40 flex flex-col items-center md:items-stretch p-4 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <Music className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter hidden md:block italic">AFROSOLFA</span>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { id: 'analyze', icon: LayoutDashboard, label: 'Workspace' },
              { id: 'library', icon: Search, label: 'Hymn Search' },
              { id: 'history', icon: History, label: 'My Library' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
        <main className="flex-1 overflow-y-auto relative p-4 md:p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent">
          <div className="max-w-5xl mx-auto">
            <header className="mb-12 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Intelligence
                </div>
                <h2 className="text-4xl font-black tracking-tight">Music Lab</h2>
                <p className="text-gray-500 mt-1 font-medium">Identify keys, solfa, and African cadences.</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 p-2 bg-white/5 rounded-2xl border border-white/5">
                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-400">Pro Plan</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-[#0a0a0a]" />
              </div>
            </header>

            <AudioAnalyzer />
          </div>
          <ChatAssistant />
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
            <a href="#" className="hover:text-emerald-400 transition-colors">Analyzer</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Library</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Community</a>
            <button 
              onClick={() => setView('dashboard')}
              className="bg-white text-black px-6 py-3 rounded-full hover:bg-emerald-400 transition-all font-black"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-40 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 blur-[150px] rounded-full animate-pulse" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Sparkles className="w-3 h-3" />
                Powered by Groq Intelligence
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                African Music <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">
                  Decoded by AI.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                The first professional-grade AI workspace for Yoruba hymns, Nigerian gospel, and choir arrangements.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={scrollToAnalyzer}
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 group"
                >
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Get Started Free
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Hymn Database
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Piano, title: "Tonic Solfa Engine", desc: "Our neural net identifies Yoruba tonal movements and maps them to accurate Do-Re-Mi steps." },
              { icon: Mic, title: "Choir Voice Splitting", desc: "Separate soprano, alto, and tenor parts with 98% accuracy for faster choir rehearsals." },
              { icon: Info, title: "Cultural Intelligence", desc: "Understands the difference between Juju, Fuji, and Contemporary Worship cadences." }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-emerald-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Preview Section */}
        <section className="max-w-7xl mx-auto px-6 pb-40 text-center">
            <div className="bg-gradient-to-b from-white/[0.05] to-transparent rounded-[4rem] border border-white/5 p-12 md:p-24 overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
               <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic">"E ba mi gbe ga..."</h2>
               <p className="text-emerald-500 font-black tracking-[0.4em] uppercase text-xs mb-12">Detected Key: G# Major</p>
               <div className="flex justify-center gap-4 opacity-50 blur-sm scale-90 select-none pointer-events-none">
                 <PianoKeyboard activeNotes={['C', 'E', 'G']} />
               </div>
               <div className="mt-12">
                  <button 
                    onClick={() => setView('dashboard')}
                    className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-emerald-400 transition-all"
                  >
                    Enter Workspace
                  </button>
               </div>
            </div>
        </section>
      </main>

      <ChatAssistant />
      
      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
               <Music className="w-4 h-4" />
             </div>
             <span className="font-black italic tracking-tighter">AFROSOLFA</span>
           </div>
           <p className="text-gray-500 text-sm font-medium">© 2026 AfroSolfa AI. Built for the Throne.</p>
           <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
             <a href="#" className="hover:text-white">Twitter</a>
             <a href="#" className="hover:text-white">Instagram</a>
             <a href="#" className="hover:text-white">Support</a>
           </div>
        </div>
      </footer>
    </div>
  )
}

export default App
