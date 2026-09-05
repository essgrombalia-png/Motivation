import React from 'react';
import { Check } from 'lucide-react';
import { UserProfile } from '../types';
import { getTodayDateString } from '../utils/storage';
import { RealisticIcon } from './RealisticIcon';

interface DailyStreakTrackerProps {
  profile: UserProfile;
}

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({ profile }) => {
  // Generate past 7 days
  const days = React.useMemo(() => {
    const list = [];
    const today = new Date();
    const todayStr = getTodayDateString();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();

      const isCompleted = profile.completedPushes.some((p) => p.completedAt.startsWith(dateStr));
      const isToday = dateStr === todayStr;

      list.push({
        dateStr,
        dayName,
        dayNum,
        isCompleted,
        isToday,
      });
    }
    return list;
  }, [profile.completedPushes]);

  const completedCountLast7 = days.filter((d) => d.isCompleted).length;

  return (
    <div className="w-full max-w-3xl mx-auto my-3 p-3.5 sm:p-4 rounded-2xl bg-[#0d1322]/90 border border-slate-800/90 shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-3.5 backdrop-blur-xl">
      {/* Left Info */}
      <div className="flex items-center gap-3">
        <RealisticIcon name="Calendar" theme="gold" size="sm" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              7-Day Momentum Grid
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              {completedCountLast7}/7 Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Daily consistency compounds into unbreakable willpower.
          </p>
        </div>
      </div>

      {/* 7-Day Dots Grid */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {days.map((day) => (
          <div key={day.dateStr} className="flex flex-col items-center gap-1">
            <span
              className={`text-[9px] font-mono uppercase font-bold ${
                day.isToday ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {day.dayName.slice(0, 2)}
            </span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                day.isCompleted
                  ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-bold shadow-[0_2px_8px_rgba(245,158,11,0.4)] border border-amber-200 ring-1 ring-inset ring-white/30'
                  : day.isToday
                  ? 'bg-amber-400/10 border-2 border-amber-400/80 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
              }`}
              title={`${day.dayName} (${day.dateStr}): ${day.isCompleted ? 'Completed' : 'Pending'}`}
            >
              {day.isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3] text-slate-950" />
              ) : (
                <span className="text-[10px] font-mono font-medium">{day.dayNum}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

