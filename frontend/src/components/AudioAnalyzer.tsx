import React, { useState } from 'react';
import { Upload, Music, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PianoKeyboard } from './PianoKeyboard';
import { SolfaEditor } from './SolfaEditor';
import axios from 'axios';

export const AudioAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Point to our FastAPI backend
      const response = await axios.post('http://localhost:8000/api/v1/analyze', formData);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Please check if the backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 md:p-12">
        {!result ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
              <Upload className="text-emerald-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to Transcribe?</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              Upload an MP3 or WAV file. Our AI will detect the key, scale, and tonic solfa automatically.
            </p>

            <label className="relative group cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="audio/*" 
                onChange={handleFileChange}
                disabled={analyzing}
              />
              <div className="px-8 py-4 bg-white/5 group-hover:bg-white/10 rounded-2xl border border-white/10 transition-all flex items-center gap-3">
                <Music className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-gray-200">
                  {file ? file.name : "Select Audio File"}
                </span>
              </div>
            </label>

            <AnimatePresence>
              {file && !analyzing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={uploadAndAnalyze}
                  className="mt-6 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                >
                  Start AI Analysis
                </motion.button>
              )}
            </AnimatePresence>

            {analyzing && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-emerald-400 font-medium animate-pulse">
                  Separating vocals and detecting pitches...
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold">{result.filename}</h4>
                  <p className="text-gray-400 text-sm">Analysis Complete</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400">{result.analysis.key}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Detected Key</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400">{Math.round(result.analysis.confidence * 100)}%</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Confidence</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400">{Math.round(result.analysis.tempo)}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">BPM</span>
                </div>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-4"
              >
                Reset & Try Another
              </button>
            </div>

            <div className="flex flex-col items-center">
              <h5 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">
                {isEditing ? "Correction Workspace" : "Melody Visualization"}
              </h5>
              
              {!isEditing ? (
                <>
                  <PianoKeyboard activeNotes={result.analysis.detected_notes.map((n: string) => n.replace(/[0-9]/g, ''))} />
                  
                  <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.analysis.tonic_solfa.map((solfa: string, i: number) => (
                      <div key={i} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                        <span className="block text-3xl font-bold text-white mb-1">{solfa}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Step {i + 1}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-12 px-8 py-4 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-2xl font-bold transition-all"
                  >
                    Edit & Refine Solfa
                  </button>
                </>
              ) : (
                <div className="w-full">
                   <SolfaEditor 
                    detectedKey={result.analysis.key}
                    initialData={result.analysis.detected_notes.map((note: string, i: number) => ({
                      note,
                      solfa: result.analysis.tonic_solfa[i] || 'd'
                    }))}
                    onSave={(updated) => {
                      console.log("Saving updated solfa:", updated);
                      setIsEditing(false);
                    }}
                   />
                   <button 
                    onClick={() => setIsEditing(false)}
                    className="mt-6 text-gray-500 hover:text-white transition-colors"
                   >
                     Cancel Editing
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
