import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Flame, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface MotivationEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmergencyChallenge: (title: string, categoryId: string) => void;
}

const EMERGENCY_MANTRAS = [
  {
    quote: "You don't have to feel like it. Action precedes emotion.",
    sub: "Motion creates emotion. Take physical action and your psychological state follows.",
    author: "Psychological Law",
  },
  {
    quote: "The magic you're looking for is in the work you're avoiding.",
    sub: "Lean directly into resistance. Discomfort is the exact compass to growth.",
    author: "Universal Axiom",
  },
  {
    quote: "Nobody is coming to save you. It is entirely on you.",
    sub: "Command your standard. One decisive choice in this exact second alters your trajectory.",
    author: "Marcus Aurelius",
  },
  {
    quote: "In 10 minutes, you can either be 10 minutes into the work, or still stuck in paralysis.",
    sub: "Shrink the initial step until it is impossible to resist, then execute immediately.",
    author: "Momentum Principle",
  },
];

const EMERGENCY_MICRO_ACTIONS = [
  {
    id: 'e1',
    title: '5-Minute Zero-Screen Walk',
    cat: 'fitness',
    desc: 'Step outside immediately without digital devices. Return refreshed in 5 minutes.',
  },
  {
    id: 'e2',
    title: 'Drop and hit 20 clean Push-ups',
    cat: 'fitness',
    desc: 'Flood your system with dopamine and oxygen to shatter mental inertia.',
  },
  {
    id: 'e3',
    title: '120-Second Ice Cold Water Splash',
    cat: 'health',
    desc: 'Trigger the mammalian dive reflex to reset your autonomic nervous system.',
  },
  {
    id: 'e4',
    title: 'Rapid Workspace Reset',
    cat: 'productivity',
    desc: 'Clear physical desktop clutter to immediately recover focus and order.',
  },
];

export const MotivationEmergencyModal: React.FC<MotivationEmergencyModalProps> = ({
  isOpen,
  onClose,
  onSelectEmergencyChallenge,
}) => {
  const [mantraIdx, setMantraIdx] = useState(0);

  if (!isOpen) return null;

  const currentMantra = EMERGENCY_MANTRAS[mantraIdx];

  const nextMantra = () => {
    setMantraIdx((prev) => (prev + 1) % EMERGENCY_MANTRAS.length);
    soundEngine.playTick(1.3);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-red-500/35 shadow-[0_0_50px_rgba(239,68,68,0.2)] max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
              <Zap className="w-5 h-5 fill-red-400 text-red-400" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-red-400 uppercase">
                EMERGENCY MOTIVATION PROTOCOL
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Shatter Inertia
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Procrastination is a temporary biological feedback loop. Break friction with rapid physical intervention:
          </p>

          {/* Big Mantra Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/[0.08] via-black/40 to-transparent border border-red-500/30 mb-6 relative overflow-hidden">
            <h3 className="text-lg sm:text-xl font-serif-quote italic text-white leading-snug mb-2">
              "{currentMantra.quote}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {currentMantra.sub}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                — {currentMantra.author}
              </span>
              <button
                onClick={nextMantra}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-semibold font-mono"
              >
                <span>Cycle Reframe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rapid Micro-Pushes */}
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400 mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            SELECT 1 ZERO-FRICTION MICRO-PUSH IMMEDIATELY:
          </h4>

          <div className="space-y-2.5">
            {EMERGENCY_MICRO_ACTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectEmergencyChallenge(item.title, item.cat);
                  soundEngine.playTriumph();
                  onClose();
                }}
                className="w-full text-left p-4 rounded-2xl bg-black/40 border border-white/[0.07] hover:border-red-500/50 hover:bg-red-500/[0.05] transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="text-sm font-display font-bold text-white group-hover:text-red-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-red-500/15 text-red-300 text-xs font-mono font-bold border border-red-500/30 shrink-0 group-hover:bg-red-500 group-hover:text-slate-950 transition-all">
                  Commit
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
