import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { CategoryId, UserProfile } from '../types';
import { CATEGORIES } from '../data/challenges';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateFocusAreas: (areas: CategoryId[]) => void;
  onToggleSound: (val: boolean) => void;
  onResetData: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateFocusAreas,
  onToggleSound,
  onResetData,
}) => {
  if (!isOpen) return null;

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

  const toggleCategory = (catId: CategoryId) => {
    let nextAreas: CategoryId[];
    if (profile.focusAreas.includes(catId)) {
      if (profile.focusAreas.length <= 1) return;
      nextAreas = profile.focusAreas.filter((id) => id !== catId);
    } else {
      nextAreas = [...profile.focusAreas, catId];
    }
    onUpdateFocusAreas(nextAreas);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-white/[0.09] shadow-2xl max-h-[90vh] overflow-y-auto"
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
            <RealisticIcon name="SlidersHorizontal" theme="sapphire" size="md" glow />
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Focus Areas & Settings
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Configure the categories you wish to calibrate. The roller wheel biases toward your chosen focus areas during randomized selections.
          </p>

          {/* Categories Multi-Select Chips */}
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {CATEGORIES.map((cat) => {
              const isSelected = profile.focusAreas.includes(cat.id);
              const theme = categoryThemeMap[cat.id] || 'gold';
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-950/60 border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <RealisticIcon name={cat.icon} theme={theme} size="xs" />
                    <span className="text-xs sm:text-sm font-semibold truncate">{cat.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Sound & Sensory Settings */}
          <div className="pt-4 border-t border-white/[0.07] mb-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
              ACOUSTIC & TACTILE FEEDBACK
            </h4>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <RealisticIcon
                  name={profile.soundEnabled ? 'Volume2' : 'VolumeX'}
                  theme={profile.soundEnabled ? 'gold' : 'obsidian'}
                  size="sm"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Mechanical Sound Synthesizer</div>
                  <div className="text-[11px] text-slate-400">Tactile clicks, cylinder locks, and celebratory fanfares</div>
                </div>
              </div>
              <button
                onClick={() => onToggleSound(!profile.soundEnabled)}
                className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                  profile.soundEnabled ? 'bg-amber-400 justify-end' : 'bg-white/[0.1] justify-start'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full ${
                    profile.soundEnabled ? 'bg-slate-950' : 'bg-slate-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset App State */}
          <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300">Reset Local Profile</div>
              <div className="text-[11px] text-slate-500">Purge streaks, completions, and accumulated XP</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress, streaks, and XP?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <RealisticIcon name="RotateCcw" theme="ruby" size="xs" />
              <span>Reset Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
