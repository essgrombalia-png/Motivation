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
  Check,
  Zap,
  ArrowRight,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { SelectedPush } from '../types';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

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

  const categoryThemeMap: Record<string, RealisticIconTheme> = {
    health: 'emerald',
    fitness: 'amber',
    mindset: 'amethyst',
    productivity: 'sapphire',
    learning: 'cyan',
    social: 'rose',
    discipline: 'gold',
    finance: 'emerald',
    'self-care': 'amethyst',
    creativity: 'rose',
  };

  const difficultyThemeMap: Record<string, RealisticIconTheme> = {
    easy: 'emerald',
    medium: 'sapphire',
    hard: 'amethyst',
    beast: 'ruby',
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning-placeholder"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-10 rounded-2xl border border-slate-800 bg-[#0d1322]/80 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[260px] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          >
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 border-t-amber-400 animate-spin mb-4" />
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Calibrating Mission...
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs font-normal">
              Selecting your optimal micro-discipline challenge.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={push.id}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0d1322]/95 p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Header / Sub-label & Bookmark */}
            <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  <RealisticIcon name="Shield" theme="gold" size="xs" />
                  TODAY'S MISSION
                </span>

                {isCompletedToday && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Check className="w-3 h-3 stroke-[3]" />
                    COMPLETED
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleFavorite(push.challenge.id)}
                  title={isFavorite ? 'Remove from saved' : 'Save mission'}
                  className={`p-1.5 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <RealisticIcon
                    name={isFavorite ? 'BookmarkCheck' : 'Bookmark'}
                    theme={isFavorite ? 'gold' : 'obsidian'}
                    size="xs"
                  />
                </button>

                <button
                  onClick={handleShare}
                  title="Share mission"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                >
                  <RealisticIcon
                    name={copied ? 'Check' : 'Share2'}
                    theme={copied ? 'emerald' : 'obsidian'}
                    size="xs"
                  />
                </button>
              </div>
            </div>

            {/* Main Action Title */}
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-snug mb-2.5">
              {push.challenge.title}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-5 font-normal">
              {push.challenge.description}
            </p>

            {/* Metadata Badges with Realistic Icons */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              {/* Category */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-900/80 shadow-inner"
                style={{
                  borderColor: `${push.category.color}40`,
                  color: '#ffffff',
                }}
              >
                <RealisticIcon
                  name={push.category.icon}
                  theme={categoryThemeMap[push.category.id] || 'gold'}
                  size="xs"
                />
                <span>{push.category.label}</span>
              </div>

              {/* Difficulty */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-900/80 shadow-inner ${push.difficulty.textColor} ${push.difficulty.borderColor}`}
              >
                <RealisticIcon
                  name="Zap"
                  theme={difficultyThemeMap[push.difficulty.id] || 'sapphire'}
                  size="xs"
                />
                <span>{push.difficulty.label}</span>
              </div>

              {/* Duration */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 border border-slate-800 text-slate-200 shadow-inner">
                <RealisticIcon name="Clock" theme="titanium" size="xs" />
                <span>{push.duration.label}</span>
              </div>

              {/* XP */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/10 border border-amber-400/30 text-amber-300 shadow-inner">
                <RealisticIcon name="Sparkles" theme="gold" size="xs" glow />
                <span>+{push.totalXp} XP</span>
              </div>
            </div>

            {/* 3-Step Action Blueprint */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-300 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-400 border border-slate-700 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                  1
                </span>
                <span>Prepare environment</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-400 border border-slate-700 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                  2
                </span>
                <span>Focus without distraction</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                  3
                </span>
                <span>Log win & compound streak</span>
              </div>
            </div>

            {/* Quote Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 mb-5 relative shadow-inner">
              <p className="font-serif-quote text-base sm:text-lg text-slate-200 italic leading-relaxed">
                “{push.quote.text}”
              </p>
              <div className="mt-1.5 text-right font-mono text-[11px] text-amber-400 font-medium">
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
                  className="mb-4 overflow-hidden"
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Victory Note:
                  </label>
                  <textarea
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder="Briefly describe how you overcame friction..."
                    rows={2}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              {/* Complete Challenge Button */}
              <button
                id="complete-challenge-button"
                onClick={() => {
                  onComplete(push, reflectionNote);
                  setReflectionNote('');
                  setReflectionOpen(false);
                }}
                disabled={isCompletedToday}
                className={`flex-1 py-3 px-5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isCompletedToday
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 cursor-default'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] active:scale-98'
                }`}
              >
                <RealisticIcon name="CheckCircle2" theme="emerald" size="xs" />
                <span>{isCompletedToday ? 'Mission Accomplished' : 'Conquer & Claim XP'}</span>
              </button>

              {/* Start Focus Timer */}
              <button
                id="start-timer-button"
                onClick={() => onStartTimer(push.duration.minutes)}
                title="Launch focus timer"
                className="py-3 px-4 rounded-xl font-display font-medium text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
              >
                <RealisticIcon name="Timer" theme="gold" size="xs" />
                <span>Timer ({push.duration.minutes}m)</span>
              </button>

              {/* Spin Again */}
              <button
                id="spin-again-button"
                onClick={onSpinAgain}
                className="py-3 px-4 rounded-xl font-display font-medium text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
              >
                <RealisticIcon name="RotateCw" theme="obsidian" size="xs" />
                <span>Spin Again</span>
              </button>

              {/* Reflection Toggle */}
              {!isCompletedToday && (
                <button
                  onClick={() => setReflectionOpen(!reflectionOpen)}
                  title="Add note"
                  className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                    reflectionOpen
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <RealisticIcon name="MessageSquare" theme="titanium" size="xs" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

