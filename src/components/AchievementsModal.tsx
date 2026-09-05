import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  Sparkles,
  Flame,
  Trophy,
  Crown,
  CheckCircle2,
  Medal,
  Layers,
  Clock,
  Lock,
  Skull,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/challenges';

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
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS_DATA.map((ach) => {
              const isUnlocked = ach.condition(profile);

              let IconComp = Award;
              if (ach.icon === 'Sparkles') IconComp = Sparkles;
              if (ach.icon === 'Flame') IconComp = Flame;
              if (ach.icon === 'Trophy') IconComp = Trophy;
              if (ach.icon === 'Crown') IconComp = Crown;
              if (ach.icon === 'Skull') IconComp = Skull;
              if (ach.icon === 'CheckCircle2') IconComp = CheckCircle2;
              if (ach.icon === 'Medal') IconComp = Medal;
              if (ach.icon === 'Layers') IconComp = Layers;
              if (ach.icon === 'Clock') IconComp = Clock;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400/[0.08] via-white/[0.02] to-transparent border-amber-400/35 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                      : 'bg-black/40 border-white/[0.05] opacity-50'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-white/[0.06] text-slate-500'
                    }`}
                  >
                    {isUnlocked ? <IconComp className="w-5 h-5 stroke-[2.5]" /> : <Lock className="w-5 h-5" />}
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
