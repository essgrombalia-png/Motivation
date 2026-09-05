import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface FocusTimerModalProps {
  isOpen: boolean;
  initialMinutes: number;
  challengeTitle: string;
  onClose: () => void;
  onCompleteFromTimer: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  initialMinutes,
  challengeTitle,
  onClose,
  onCompleteFromTimer,
}) => {
  const totalSeconds = initialMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsRemaining(initialMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  }, [initialMinutes, isOpen]);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            soundEngine.playTimerDone();
            soundEngine.vibrate([100, 50, 100]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    setIsFinished(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-white/[0.09] shadow-2xl text-center flex flex-col items-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-amber-300 mb-1">
            EXECUTIVE FOCUS CHRONOMETER
          </span>

          <h3 className="text-base sm:text-lg font-display font-bold text-white max-w-xs truncate mb-5">
            {challengeTitle}
          </h3>

          {/* Circular Countdown Progress Ring */}
          <div className="relative w-64 h-64 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
              {/* Background track */}
              <circle
                cx="120"
                cy="120"
                r="110"
                className="stroke-white/[0.06]"
                strokeWidth="8"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="120"
                cy="120"
                r="110"
                className="stroke-amber-400 transition-all duration-300"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.4))' }}
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-semibold mt-2">
                {isFinished ? 'Push Conquered!' : isRunning ? 'In Deep Focus' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Quick preset adjusters if paused */}
          {!isRunning && !isFinished && (
            <div className="flex items-center gap-2 mb-6">
              {[5, 10, 15, 25, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSecondsRemaining(m * 60);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    secondsRemaining === m * 60
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 w-full mt-2">
            <button
              onClick={handleReset}
              title="Reset timer"
              className="p-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsRunning(!isRunning);
                soundEngine.playTick(1.2);
              }}
              className="flex-1 py-4 px-6 rounded-2xl font-display font-extrabold text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all active:scale-[0.98]"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Focus</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>{secondsRemaining === totalSeconds ? 'Initiate Push' : 'Resume'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onCompleteFromTimer();
                onClose();
              }}
              title="Finish & Claim XP"
              className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border border-emerald-300/60 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
