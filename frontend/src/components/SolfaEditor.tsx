import React, { useState } from 'react';
import { Save, RotateCcw, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface SolfaStep {
  note: string;
  solfa: string;
}

interface SolfaEditorProps {
  initialData: SolfaStep[];
  detectedKey: string;
  onSave: (data: SolfaStep[]) => void;
}

const SOLFA_SYMBOLS = ['d', 'r', 'm', 'f', 's', 'l', 't', 'd2'];

export const SolfaEditor: React.FC<SolfaEditorProps> = ({ initialData, detectedKey, onSave }) => {
  const [steps, setSteps] = useState<SolfaStep[]>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateSolfa = (index: number, newSolfa: string) => {
    const newSteps = [...steps];
    newSteps[index].solfa = newSolfa;
    setSteps(newSteps);
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            Correction Interface 
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-md uppercase tracking-wider">Editor Mode</span>
          </h4>
          <p className="text-gray-500 text-sm">Key: {detectedKey} Major</p>
        </div>
        
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSave(steps)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-bold transition-all"
          >
            <Save className="w-4 h-4" />
            Save Edits
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                currentIndex === i 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-white/5 border-transparent hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-500">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-bold text-lg">{step.solfa}</span>
              </div>
              <span className="text-sm text-gray-500">{step.note}</span>
            </motion.div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="bg-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
             <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 block">Editing Step {currentIndex + 1}</span>
             <div className="text-6xl font-black text-emerald-400 mb-2">{steps[currentIndex].solfa}</div>
             <div className="text-gray-400 font-medium">Note: {steps[currentIndex].note}</div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-8 w-full">
            {SOLFA_SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => updateSolfa(currentIndex, sym)}
                className={`py-3 rounded-xl font-bold transition-all border ${
                  steps[currentIndex].solfa === sym
                  ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 border-white/5 hover:border-emerald-500/50 text-gray-400'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <Play className="w-8 h-8 text-white fill-white" />
            </button>
            <button 
              disabled={currentIndex === steps.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
