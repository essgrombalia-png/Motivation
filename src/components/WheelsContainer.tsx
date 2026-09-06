import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { CircularWheelOfFortune } from './CircularWheelOfFortune';
import { CategoryId, SelectedPush, UserProfile } from '../types';
import { getTodayDateString } from '../utils/storage';

interface WheelsContainerProps {
  onChallengeSelected: (push: SelectedPush) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  preferredCategories?: CategoryId[];
  profile?: UserProfile;
}

export const WheelsContainer: React.FC<WheelsContainerProps> = ({
  onChallengeSelected,
  isSpinning,
  setIsSpinning,
  preferredCategories = [],
  profile,
}) => {
  const currentStreak = profile?.currentStreak || 0;
  const bestStreak = profile?.bestStreak || 0;
  const today = getTodayDateString();
  const isActiveToday = profile?.lastActiveDate === today;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2 sm:gap-3">
      {/* Visual Flame Streak Counter & Daily Engagement Indicator */}
      <div className="flex items-center gap-2 sm:gap-3.5 bg-gradient-to-r from-slate-900/90 via-amber-950/40 to-slate-900/90 border border-amber-500/35 px-4 sm:px-5 py-2 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.18)] backdrop-blur-md z-20 transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)]">
        {/* Flame Icon with Dynamic Fire Glow */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full bg-amber-500/35 blur-md animate-pulse" />
          <div
            className={`p-1.5 sm:p-2 rounded-full transition-transform duration-300 ${
              currentStreak > 0
                ? 'bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 text-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.85)] scale-105'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Flame
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                currentStreak > 0 ? 'fill-yellow-300 stroke-amber-950 animate-bounce' : ''
              }`}
              style={{ animationDuration: '2.2s' }}
            />
          </div>
        </div>

        {/* Streak Counter Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-display font-black text-amber-300 tracking-tight leading-none">
              {currentStreak}
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-100 font-display">
              {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            {isActiveToday ? 'Momentum Protected Today' : 'Spin & conquer to ignite streak!'}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-800/80 mx-1 hidden sm:block" />

        {/* Best Streak Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-300 font-mono text-[11px] font-semibold">
            Best: <strong className="text-amber-300">{bestStreak}d</strong>
          </span>
        </div>
      </div>

      {/* Authentic Circular Wheel of Fortune */}
      <CircularWheelOfFortune
        onChallengeSelected={onChallengeSelected}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        preferredCategories={preferredCategories}
        profile={profile}
      />
    </div>
  );
};
