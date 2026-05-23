import { Music, Upload, Search, Piano, Mic, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { AudioAnalyzer } from './components/AudioAnalyzer'

function App() {
  const scrollToAnalyzer = () => {

    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AfroSolfa AI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Analyzer</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Library</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Community</a>
            <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full border border-white/10 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                The First AI Music Assistant Built for <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                  African Songs
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Upload hymns, Yoruba songs, gospel music, or choir recordings and instantly get tonic solfa, piano notes, and intelligent musical analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={scrollToAnalyzer}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Song
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Try a Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Piano, title: "Tonic Solfa Extraction", desc: "Instantly generate accurate Do-Re-Mi mappings for any Yoruba or Nigerian gospel song." },
              { icon: Mic, title: "Vocal Separation", desc: "Crystal clear separation of lead vocals, backing choir, and instruments using advanced AI." },
              { icon: Info, title: "Cultural Context", desc: "Designed with an understanding of Yoruba tonal languages and African melodic movements." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:border-emerald-500/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all">
                  <feature.icon className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Analyzer Section */}
        <section id="analyzer" className="max-w-7xl mx-auto px-6 pb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Music Intelligence Lab</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our neural network is specifically trained on African gospel cadences and Yoruba worship patterns.
            </p>
          </div>
          <AudioAnalyzer />
        </section>
      </main>
    </div>
  )
}

export default App