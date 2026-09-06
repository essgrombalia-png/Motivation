import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
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
  RotateCw,
  Trophy,
} from 'lucide-react';
import { SelectedPush } from '../types';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

interface PushNotificationOverlayProps {
  isOpen: boolean;
  push: SelectedPush | null;
  onClose: () => void;
  onComplete: (push: SelectedPush, note?: string) => void;
  onSpinAgain: () => void;
  onStartTimer: (durationMinutes: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompletedToday: boolean;
}

export const PushNotificationOverlay: React.FC<PushNotificationOverlayProps> = ({
  isOpen,
  push,
  onClose,
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

  if (!isOpen || !push) return null;

  const handleShare = () => {
    const text = `Today's Push: "${push.challenge.title}" (${push.category.label} · ${push.difficulty.label} · ${push.duration.label}). "${push.quote.text}" — Via Daily Push`;
    if (navigator.share) {
      navigator.share({
        title: "Today's Push Mission",
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
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-auto">
        {/* Soft Backdrop Tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-transparent rounded-3xl"
        />

        {/* Floating Notification Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-lg rounded-3xl bg-slate-950/95 border-2 border-amber-400/40 p-5 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.25)] overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow inside Card */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

          {/* Top Status & Controls */}
          <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-black tracking-wider uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <RealisticIcon name="Shield" theme="gold" size="xs" glow />
                <span>MISSION UNLOCKED</span>
              </span>

              {isCompletedToday && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Check className="w-3 h-3 stroke-[3]" />
                  CONQUERED
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleFavorite(push.challenge.id)}
                title={isFavorite ? 'Remove from saved' : 'Save mission'}
                className={`p-1.5 rounded-xl transition-all ${
                  isFavorite
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
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
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              >
                <RealisticIcon
                  name={copied ? 'Check' : 'Share2'}
                  theme={copied ? 'emerald' : 'obsidian'}
                  size="xs"
                />
              </button>

              <button
                onClick={onClose}
                title="Dismiss overlay"
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mission Title */}
          <div className="mb-2">
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-snug">
              {push.challenge.title}
            </h3>
          </div>

          {/* Mission Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
            {push.challenge.description}
          </p>

          {/* Metadata Chips with Realistic Iconography */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Category */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border bg-slate-900/90 shadow-inner"
              style={{
                borderColor: `${push.category.color}50`,
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
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border bg-slate-900/90 shadow-inner ${push.difficulty.textColor} ${push.difficulty.borderColor}`}
            >
              <RealisticIcon
                name="Zap"
                theme={difficultyThemeMap[push.difficulty.id] || 'sapphire'}
                size="xs"
              />
              <span>{push.difficulty.label}</span>
            </div>

            {/* Duration */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-900/90 border border-slate-800 text-slate-200 shadow-inner">
              <RealisticIcon name="Clock" theme="titanium" size="xs" />
              <span>{push.duration.label}</span>
            </div>

            {/* XP Award */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <RealisticIcon name="Sparkles" theme="gold" size="xs" glow />
              <span>+{push.totalXp} XP</span>
            </div>
          </div>

          {/* Quote Banner */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 mb-4 text-xs">
            <p className="font-serif-quote text-slate-200 italic leading-relaxed">
              “{push.quote.text}”
            </p>
            <div className="mt-1 text-right font-mono text-[10px] text-amber-400 font-semibold">
              — {push.quote.author}
            </div>
          </div>

          {/* Reflection Note Input */}
          <AnimatePresence>
            {reflectionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden"
              >
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="Victory reflection (optional note)..."
                  rows={2}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            {/* Complete Challenge Button */}
            <button
              id="notification-complete-button"
              onClick={() => {
                onComplete(push, reflectionNote);
                setReflectionNote('');
                setReflectionOpen(false);
              }}
              disabled={isCompletedToday}
              className={`flex-1 py-3 px-4 rounded-2xl font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isCompletedToday
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/80 cursor-default'
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] active:scale-98'
              }`}
            >
              <RealisticIcon name="CheckCircle2" theme="emerald" size="xs" />
              <span>{isCompletedToday ? 'Accomplished Today' : 'Conquer & Claim XP'}</span>
            </button>

            {/* Launch Focus Timer */}
            <button
              id="notification-timer-button"
              onClick={() => {
                onStartTimer(push.duration.minutes);
                onClose();
              }}
              className="py-3 px-3.5 rounded-2xl font-display font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <RealisticIcon name="Timer" theme="gold" size="xs" />
              <span>Timer ({push.duration.minutes}m)</span>
            </button>

            {/* Spin Again */}
            <button
              id="notification-spin-again-button"
              onClick={() => {
                onClose();
                onSpinAgain();
              }}
              className="py-3 px-3.5 rounded-2xl font-display font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <RealisticIcon name="RotateCw" theme="obsidian" size="xs" />
              <span>Spin Again</span>
            </button>

            {/* Note Toggle */}
            {!isCompletedToday && (
              <button
                onClick={() => setReflectionOpen(!reflectionOpen)}
                title="Add victory note"
                className={`p-3 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer ${
                  reflectionOpen
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <RealisticIcon name="MessageSquare" theme="titanium" size="xs" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
