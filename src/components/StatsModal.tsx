import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateLevel, getTodayDateString } from '../utils/storage';
import { CATEGORIES } from '../data/challenges';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const levelInfo = calculateLevel(profile.xp);
  const totalCompleted = profile.completedPushes.length;
  const totalMinutes = profile.completedPushes.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });

    const dayPushes = profile.completedPushes.filter((p) => p.completedAt.startsWith(dateStr));
    const dayXp = dayPushes.reduce((acc, curr) => acc + curr.xpEarned, 0);

    return {
      dateStr,
      dayName,
      dayXp,
      hasPushed: profile.activeDates.includes(dateStr),
    };
  });

  const maxDayXp = Math.max(300, ...last7Days.map((d) => d.dayXp));

  const categoryCounts: { [key: string]: number } = {};
  profile.completedPushes.forEach((p) => {
    categoryCounts[p.categoryId] = (categoryCounts[p.categoryId] || 0) + 1;
  });

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
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <RealisticIcon name="BarChart3" theme="emerald" size="md" glow />
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Momentum & Discipline Analytics
              </h2>
              <p className="text-xs text-slate-400">Track your trajectory of daily micro-habits</p>
            </div>
          </div>

          {/* Level & XP Hero Block */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-400/[0.09] via-slate-900/60 to-amber-400/[0.09] border border-amber-400/35 shadow-[0_4px_20px_rgba(245,158,11,0.12)] mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <RealisticIcon name="Crown" theme="gold" size="sm" />
                <div>
                  <span className="text-[10px] font-mono tracking-[0.16em] text-amber-300 font-bold uppercase">
                    ACTIVE RANK
                  </span>
                  <h3 className="text-lg sm:text-xl font-display font-extrabold text-white">
                    Level {levelInfo.level} · {levelInfo.title}
                  </h3>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-lg sm:text-xl font-bold text-amber-300">
                  {profile.xp.toLocaleString()} XP
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Total Accumulated</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>{levelInfo.currentLevelXp} XP in current tier</span>
              <span>{levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP to Level {levelInfo.level + 1}</span>
            </div>
          </div>

          {/* 4-Stat Grid with Realistic Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-amber-400">Streak</span>
                <RealisticIcon name="Flame" theme="amber" size="xs" />
              </div>
              <span className="text-2xl font-display font-extrabold text-white">{profile.currentStreak} <span className="text-xs font-normal text-slate-400">days</span></span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Best: {profile.bestStreak} days</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-emerald-400">Pushes</span>
                <RealisticIcon name="CheckCircle2" theme="emerald" size="xs" />
              </div>
              <span className="text-2xl font-display font-extrabold text-white">{totalCompleted}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Conquered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-cyan-400">Time Spent</span>
                <RealisticIcon name="Clock" theme="cyan" size="xs" />
              </div>
              <span className="text-2xl font-display font-extrabold text-white">{totalMinutes} <span className="text-xs font-normal text-slate-400">min</span></span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Deep focus</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-purple-400">Daily Avg</span>
                <RealisticIcon name="Zap" theme="amethyst" size="xs" />
              </div>
              <span className="text-2xl font-display font-extrabold text-white">
                {profile.activeDates.length > 0
                  ? Math.round(profile.xp / profile.activeDates.length)
                  : 0}{' '}
                <span className="text-xs font-normal text-slate-400 font-mono">XP</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">Per active day</span>
            </div>
          </div>

          {/* 7-Day Activity Rhythm */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 mb-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RealisticIcon name="Activity" theme="gold" size="xs" />
                <h4 className="text-sm font-bold text-white">7-Day Discipline Rhythm</h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">XP Activity</span>
            </div>

            <div className="flex items-end justify-between gap-2.5 h-28 pt-2 px-1">
              {last7Days.map((day, idx) => {
                const heightPercent = Math.max(8, Math.round((day.dayXp / maxDayXp) * 100));
                const isToday = day.dateStr === getTodayDateString();

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center h-20">
                      <div
                        className={`w-full max-w-[34px] rounded-t-lg transition-all duration-300 ${
                          isToday
                            ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                            : day.dayXp > 0
                            ? 'bg-gradient-to-t from-amber-600/60 to-amber-400/60'
                            : 'bg-white/[0.05]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${day.dateStr}: ${day.dayXp} XP`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isToday ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Mastery Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 mb-3.5">
              <RealisticIcon name="TrendingUp" theme="emerald" size="xs" />
              <h4 className="text-sm font-bold text-white">Category Mastery Breakdown</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const percent = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <RealisticIcon
                        name={cat.icon}
                        theme={categoryThemeMap[cat.id] || 'gold'}
                        size="xs"
                      />
                      <span className="text-xs font-semibold text-slate-300">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{count}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
