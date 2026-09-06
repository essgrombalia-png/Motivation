import React from 'react';
import { CircularWheelOfFortune } from './CircularWheelOfFortune';
import { CategoryId, SelectedPush, UserProfile } from '../types';
import { getTodayDateString } from '../utils/storage';
import { RealisticIcon } from './RealisticIcon';

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
      <div className="flex items-center gap-2 sm:gap-3.5 bg-gradient-to-r from-slate-900/95 via-amber-950/50 to-slate-900/95 border border-amber-500/40 px-4 sm:px-5 py-2 rounded-full shadow-[0_4px_24px_rgba(245,158,11,0.2)] backdrop-blur-md z-20 transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_4px_30px_rgba(245,158,11,0.35)]">
        {/* Flame Icon with Dynamic Fire Glow */}
        <RealisticIcon name="Flame" theme={currentStreak > 0 ? "amber" : "obsidian"} size="sm" glow={currentStreak > 0} />

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
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs shadow-inner">
          <RealisticIcon name="Trophy" theme="gold" size="xs" />
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
