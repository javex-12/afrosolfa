import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FULL_NOTES = [...NOTES, ...NOTES]; // 2 octaves

interface PianoKeyboardProps {
  activeNotes?: string[];
  onNoteClick?: (note: string) => void;
  className?: string;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ 
  activeNotes = [], 
  onNoteClick,
  className 
}) => {
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);

  const handleNoteDown = (note: string, index: number) => {
    const noteId = `${note}-${index}`;
    setPressedNotes(prev => [...prev, noteId]);
    onNoteClick?.(note);
    
    // Play sound simulation
    console.log(`Playing: ${note}`);
  };

  const handleNoteUp = (note: string, index: number) => {
    const noteId = `${note}-${index}`;
    setPressedNotes(prev => prev.filter(id => id !== noteId));
  };

  return (
    <div className={cn("flex flex-col items-center gap-6 select-none", className)}>
      <div className="relative flex h-48 md:h-64 bg-black/40 p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {FULL_NOTES.map((note, i) => {
          const isBlack = note.includes('#');
          const noteId = `${note}-${i}`;
          const isActive = activeNotes.includes(note);
          const isPressed = pressedNotes.includes(noteId);

          return (
            <motion.div
              key={noteId}
              onMouseDown={() => handleNoteDown(note, i)}
              onMouseUp={() => handleNoteUp(note, i)}
              onMouseLeave={() => handleNoteUp(note, i)}
              onTouchStart={() => handleNoteDown(note, i)}
              onTouchEnd={() => handleNoteUp(note, i)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex-shrink-0 transition-colors duration-150 cursor-pointer",
                isBlack 
                  ? "w-6 md:w-8 h-28 md:h-40 z-10 -mx-3 md:-mx-4 rounded-b-lg shadow-lg" 
                  : "w-10 md:w-14 h-full border-x border-black/10 first:border-l-0 last:border-r-0 rounded-b-xl shadow-inner",
                !isBlack && !isActive && !isPressed && "bg-gradient-to-b from-gray-100 to-white hover:from-white hover:to-gray-100",
                !isBlack && isActive && "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]",
                !isBlack && isPressed && "bg-emerald-500",
                isBlack && !isActive && !isPressed && "bg-zinc-800 border-x border-black hover:bg-zinc-700",
                isBlack && isActive && "bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.4)]",
                isBlack && isPressed && "bg-emerald-700"
              )}
            >
              <div className={cn(
                "absolute bottom-4 left-0 right-0 text-center font-bold text-[10px] md:text-xs tracking-tighter",
                isBlack ? "text-zinc-500" : "text-zinc-400"
              )}>
                {note}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          Detected Notes
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          Inactive
        </div>
      </div>
    </div>
  );
};
