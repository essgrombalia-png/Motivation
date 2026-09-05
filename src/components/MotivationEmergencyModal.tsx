import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { RealisticIcon } from './RealisticIcon';

interface MotivationEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConquerEmergency: (xpGain: number) => void;
}

const EMERGENCY_PROTOCOLS = [
  {
    id: 'p1',
    title: 'The 2-Minute Ignition Rule',
    tagline: 'Defeat inertia instantly',
    description:
      'Commit to doing your hardest task for only 120 seconds. Once friction breaks, momentum takes over.',
    durationSec: 120,
    xpReward: 75,
  },
  {
    id: 'p2',
    title: 'Dopamine Shockwave',
    tagline: 'Physical state shift',
    description:
      'Perform 15 fast jumping jacks or deep breaths + splash cold water on your face. Reset your nervous system right now.',
    durationSec: 60,
    xpReward: 50,
  },
  {
    id: 'p3',
    title: 'Digital Clean Sweep',
    tagline: 'Ruthless focus purge',
    description:
      'Close all irrelevant tabs, flip your phone face-down in another room, and write down 1 single victory task.',
    durationSec: 90,
    xpReward: 60,
  },
];

export const MotivationEmergencyModal: React.FC<MotivationEmergencyModalProps> = ({
  isOpen,
  onClose,
  onConquerEmergency,
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState(EMERGENCY_PROTOCOLS[0]);
  const [secondsLeft, setSecondsLeft] = useState(selectedProtocol.durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setSecondsLeft(selectedProtocol.durationSec);
    setIsRunning(false);
    setIsCompleted(false);
  }, [selectedProtocol]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEngine.playLevelUp();
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          if (prev % 10 === 0) {
            soundEngine.playTick(1.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const handleStart = () => {
    soundEngine.playSpinStart();
    setIsRunning(true);
  };

  const handlePause = () => {
    soundEngine.playTick(0.8);
    setIsRunning(false);
  };

  const handleReset = () => {
    soundEngine.playTick(1.0);
    setIsRunning(false);
    setSecondsLeft(selectedProtocol.durationSec);
    setIsCompleted(false);
  };

  const handleClaim = () => {
    soundEngine.playCelebration();
    onConquerEmergency(selectedProtocol.xpReward);
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#160c0c] via-[#100808] to-[#080505] border-2 border-red-500/60 p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.4)] overflow-hidden"
        >
          {/* Top Energy Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-red-600/30 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white border border-white/[0.1] transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <RealisticIcon name="Zap" theme="ruby" size="md" glow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black uppercase tracking-widest text-red-400">
                  ANTI-PROCRASTINATION SOS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-extrabold border border-red-500/40">
                  SHOCK PROTOCOL
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                Break Inertia Right Now
              </h3>
            </div>
          </div>

          {/* Protocol Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {EMERGENCY_PROTOCOLS.map((proto) => (
              <button
                key={proto.id}
                onClick={() => setSelectedProtocol(proto)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedProtocol.id === proto.id
                    ? 'bg-red-500/20 border-red-500/70 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:bg-white/[0.08]'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{proto.title}</div>
                <div className="text-[10px] font-mono text-red-300/80 mt-0.5 font-bold">
                  {proto.durationSec}s · +{proto.xpReward} XP
                </div>
              </button>
            ))}
          </div>

          {/* Protocol Detail Box */}
          <div className="p-4 rounded-2xl bg-black/60 border border-red-500/30 mb-6">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <RealisticIcon name="Flame" theme="amber" size="xs" />
              {selectedProtocol.tagline}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedProtocol.description}
            </p>
          </div>

          {/* High Energy Emergency Timer */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-red-950/40 to-black border border-red-500/40 mb-6 shadow-inner">
            <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-wider drop-shadow-[0_0_25px_rgba(239,68,68,0.8)] mb-4">
              {formatTime(secondsLeft)}
            </div>

            <div className="flex items-center gap-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-display font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(239,68,68,0.6)] flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{secondsLeft === selectedProtocol.durationSec ? 'Ignite Sprint' : 'Resume'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-6 py-3 rounded-xl bg-white/[0.1] hover:bg-white/[0.15] text-white font-display font-bold text-sm tracking-wider uppercase border border-white/[0.2] flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleReset}
                title="Reset timer"
                className="p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.1] active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Completion Claim Box */}
          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-black text-base uppercase tracking-wider shadow-[0_0_40px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2 animate-bounce transition-all"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[3]" />
              <span>Inertia Destroyed! Claim +{selectedProtocol.xpReward} XP</span>
            </button>
          ) : (
            <p className="text-center text-[11px] font-mono text-slate-400">
              "The secret of getting ahead is getting started." — Mark Twain
            </p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
