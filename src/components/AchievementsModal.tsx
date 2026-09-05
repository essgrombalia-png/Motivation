import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/challenges';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const unlockedCount = ACHIEVEMENTS_DATA.filter((ach) => ach.condition(profile)).length;

  const getAchievementTheme = (iconName: string, isUnlocked: boolean): RealisticIconTheme => {
    if (!isUnlocked) return 'obsidian';
    switch (iconName) {
      case 'Trophy':
      case 'Crown':
      case 'Medal':
        return 'gold';
      case 'Flame':
        return 'amber';
      case 'Skull':
        return 'ruby';
      case 'Sparkles':
        return 'gold';
      case 'Layers':
        return 'sapphire';
      case 'CheckCircle2':
        return 'emerald';
      default:
        return 'gold';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-white/[0.09] shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <RealisticIcon name="Trophy" theme="gold" size="md" glow />
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Milestones & Trophies
                </h2>
                <p className="text-xs text-slate-400">Honor marks of enduring discipline</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/25">
              {unlockedCount} / {ACHIEVEMENTS_DATA.length} Unlocked
            </span>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ACHIEVEMENTS_DATA.map((ach) => {
              const isUnlocked = ach.condition(profile);
              const theme = getAchievementTheme(ach.icon, isUnlocked);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400/[0.09] via-slate-900/60 to-slate-950/80 border-amber-400/35 shadow-[0_4px_16px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-950/40 border-white/[0.05] opacity-55'
                  }`}
                >
                  <div className="shrink-0">
                    {isUnlocked ? (
                      <RealisticIcon name={ach.icon} theme={theme} size="sm" glow />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-sm font-display font-bold truncate ${
                          isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {ach.title}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-mono tracking-wider font-bold text-amber-300">
                          EARNED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
