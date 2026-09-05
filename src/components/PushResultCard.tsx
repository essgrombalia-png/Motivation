import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  RotateCw,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Timer,
  Share2,
  Flame,
  MessageSquare,
  Check,
} from 'lucide-react';
import { SelectedPush } from '../types';

interface PushResultCardProps {
  push: SelectedPush | null;
  isSpinning: boolean;
  onComplete: (push: SelectedPush, note?: string) => void;
  onSpinAgain: () => void;
  onStartTimer: (durationMinutes: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompletedToday: boolean;
}

export const PushResultCard: React.FC<PushResultCardProps> = ({
  push,
  isSpinning,
  onComplete,
  onSpinAgain,
  onStartTimer,
  isFavorite,
  onToggleFavorite,
  isCompletedToday,
}) => {
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionNote, setReflectionNote] = useState('');
  const [copied, setCopied] = useState(false);

  if (!push) return null;

  const handleShare = () => {
    const text = `Today's Push: "${push.challenge.title}" (${push.category.label} · ${push.difficulty.label} · ${push.duration.label}). "${push.quote.text}" — Via Daily Push`;
    if (navigator.share) {
      navigator.share({
        title: "Today's Push",
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-9">
      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning-placeholder"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="p-10 rounded-3xl border border-white/[0.08] bg-[#0c101c]/60 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[280px]"
          >
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
              <Sparkles className="w-5 h-5 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Calibrating Kinetic Drums...
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
              Selecting your high-impact micro-discipline for today.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={push.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-b from-[#0f1422] via-[#0b0f19] to-[#080b11] p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {/* Ambient Radial Accent Light */}
            <div
              className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: push.category.color }}
            />

            {/* Header / Sub-label & Bookmark */}
            <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-[0.15em] uppercase bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  TODAY'S PUSH
                </span>

                {isCompletedToday && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Completed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(push.challenge.id)}
                  title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  className={`p-2.5 rounded-xl transition-all ${
                    isFavorite
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {isFavorite ? (
                    <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  title="Share push challenge"
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-400 hover:text-white border border-white/[0.08] transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Action Title */}
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug mb-3">
              {push.challenge.title}
            </h2>

            {/* Description / Instructions */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {push.challenge.description}
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-7">
              {/* Category Pill */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border"
                style={{
                  backgroundColor: `${push.category.color}15`,
                  borderColor: `${push.category.color}35`,
                  color: push.category.color,
                }}
              >
                <span>{push.category.label}</span>
              </div>

              {/* Difficulty Pill */}
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border bg-white/[0.04] ${push.difficulty.textColor} ${push.difficulty.borderColor}`}
              >
                <span>{push.difficulty.label}</span>
              </div>

              {/* Duration Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{push.duration.label}</span>
              </div>

              {/* XP Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/10 border border-amber-400/30 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+{push.totalXp} XP</span>
              </div>
            </div>

            {/* Editorial Serif Motivational Quote Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.07] mb-7 relative">
              <span className="text-3xl text-amber-400/30 font-serif leading-none absolute top-3 left-3">
                “
              </span>
              <p className="font-serif-quote text-lg sm:text-xl text-slate-100 italic pl-5 pr-2 leading-relaxed">
                {push.quote.text}
              </p>
              <div className="mt-2 text-right font-mono text-xs text-amber-400/90 font-medium tracking-wider uppercase">
                — {push.quote.author}
              </div>
            </div>

            {/* Optional Reflection Box */}
            <AnimatePresence>
              {reflectionOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Personal Reflection:
                  </label>
                  <textarea
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder="What friction did you overcome? How does completing this make you feel?"
                    rows={2}
                    className="w-full rounded-xl bg-black/60 border border-white/[0.12] px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {/* Complete Challenge Button */}
              <button
                id="complete-challenge-button"
                onClick={() => {
                  onComplete(push, reflectionNote);
                  setReflectionNote('');
                  setReflectionOpen(false);
                }}
                disabled={isCompletedToday}
                className={`flex-1 py-4 px-6 rounded-2xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isCompletedToday
                    ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] active:scale-[0.98]'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>{isCompletedToday ? 'Challenge Completed!' : 'Complete Challenge'}</span>
              </button>

              {/* Start Focus Timer */}
              <button
                id="start-timer-button"
                onClick={() => onStartTimer(push.duration.minutes)}
                title="Launch focus timer"
                className="py-4 px-5 rounded-2xl font-semibold text-sm bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.09] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Timer className="w-4 h-4 text-amber-400" />
                <span>Start Timer</span>
              </button>

              {/* Spin Again */}
              <button
                id="spin-again-button"
                onClick={onSpinAgain}
                className="py-4 px-5 rounded-2xl font-semibold text-sm bg-black/40 hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <RotateCw className="w-4 h-4 text-slate-400" />
                <span>Spin Again</span>
              </button>

              {/* Reflection Toggle */}
              {!isCompletedToday && (
                <button
                  onClick={() => setReflectionOpen(!reflectionOpen)}
                  title="Add personal reflection notes"
                  className={`p-4 rounded-2xl border transition-colors flex items-center justify-center ${
                    reflectionOpen
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                      : 'bg-black/40 text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
