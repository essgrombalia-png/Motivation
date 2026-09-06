import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Trophy,
  BarChart3,
  History,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/challenges';
import { soundEngine } from '../utils/sound';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';

interface TimeGreeting {
  title: string;
  subtitle: string;
  icon: string;
  theme: RealisticIconTheme;
}

const getTimeGreeting = (): TimeGreeting => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Morning Momentum',
      subtitle: 'Ignite your daily drive',
      icon: 'Sun',
      theme: 'gold',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      title: 'Afternoon Hustle',
      subtitle: 'Break through the resistance',
      icon: 'Flame',
      theme: 'amber',
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      title: 'Evening Reflection',
      subtitle: 'Compound your daily wins',
      icon: 'Sparkles',
      theme: 'amethyst',
    };
  } else {
    return {
      title: 'Night Vanguard',
      subtitle: 'Deep focus & discipline',
      icon: 'Shield',
      theme: 'sapphire',
    };
  }
};

interface MotivationDeckProps {
  profile: UserProfile;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenHistory: () => void;
  onOpenPreferences: () => void;
  onOpenMotivationEmergency: () => void;
  onOpenProfile: () => void;
  onToggleSound: () => void;
}

export const MotivationDeck: React.FC<MotivationDeckProps> = ({
  profile,
  onOpenStats,
  onOpenAchievements,
  onOpenHistory,
  onOpenPreferences,
  onOpenMotivationEmergency,
  onOpenProfile,
  onToggleSound,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );
  const [quoteAnimating, setQuoteAnimating] = useState(false);
  const [greeting, setGreeting] = useState<TimeGreeting>(() => getTimeGreeting());

  useEffect(() => {
    setGreeting(getTimeGreeting());
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  const handleNextQuote = () => {
    soundEngine.playTick(1.4);
    setQuoteAnimating(true);
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setQuoteAnimating(false);
    }, 120);
  };

  // Streak multiplier calculation
  const streakMultiplier =
    profile.currentStreak >= 30
      ? '3.0×'
      : profile.currentStreak >= 14
      ? '2.5×'
      : profile.currentStreak >= 7
      ? '2.0×'
      : profile.currentStreak >= 3
      ? '1.5×'
      : '1.0×';

  // Calculate Level XP progress
  const currentLevelXp = profile.xp % 500;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  return (
    <header className="w-full max-w-5xl mx-auto mb-6 flex flex-col gap-3">
      {/* Top Main Command Bar */}
      <div className="relative rounded-2xl bg-[#0d1322]/95 border border-slate-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.55)] p-3 sm:p-4 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Branding & Core Player Metrics */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full lg:w-auto">
            {/* App Icon & Badge with Personalized Time Greeting */}
            <div className="flex items-center gap-3">
              <RealisticIcon name={greeting.icon} theme={greeting.theme} size="sm" glow />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-base text-white tracking-tight leading-none">
                    DAILY PUSH
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/25 font-semibold tracking-wider">
                    PRO
                  </span>
                </div>
                {/* Dynamic Personalized Hour Greeting */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium mt-0.5 text-amber-300/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span className="font-semibold text-white tracking-tight">{greeting.title}</span>
                  <span className="text-slate-600 hidden sm:inline">·</span>
                  <span className="text-slate-400 font-sans hidden sm:inline text-[10px]">{greeting.subtitle}</span>
                </div>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

            {/* Streak Status Capsule */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 shadow-inner">
              <RealisticIcon name="Flame" theme="amber" size="xs" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-sm text-white">
                  {profile.currentStreak}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {profile.currentStreak === 1 ? 'day streak' : 'days streak'}
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold ml-0.5">
                {streakMultiplier}
              </span>
            </div>

            {/* Level & XP Capsule */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-800 shadow-inner">
              <RealisticIcon name="Crown" theme="gold" size="xs" />
              <div className="flex flex-col min-w-[75px]">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-300 font-medium">Rank {profile.level}</span>
                  <span className="text-amber-400 font-semibold">{profile.xp} XP</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 p-[1px] border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full lg:w-auto">
            {/* User Profile Badge & Calibration Button */}
            <button
              onClick={onOpenProfile}
              title="Personalize Profile & Calibration"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border border-amber-400/35 transition-all flex items-center gap-1.5 active:scale-98 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
            >
              <RealisticIcon name="User" theme="gold" size="xs" />
              <span className="text-xs font-bold truncate max-w-[90px] sm:max-w-[120px]">
                {profile.userName || 'Profile'}
              </span>
            </button>

            {/* Focus Emergency Protocol */}
            <button
              onClick={onOpenMotivationEmergency}
              title="Anti-Procrastination Quick Protocol"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-950/60 to-rose-950/40 hover:from-red-900/70 hover:to-rose-900/50 text-red-300 hover:text-red-200 font-display font-bold text-xs tracking-wider border border-red-700/50 transition-all flex items-center gap-2 shadow-[0_2px_12px_rgba(239,68,68,0.2)] active:scale-98"
            >
              <RealisticIcon name="Zap" theme="ruby" size="xs" />
              <span>SOS PROTOCOL</span>
            </button>

            {/* Achievements */}
            <button
              onClick={onOpenAchievements}
              title="Milestones & Trophies"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 active:scale-98"
            >
              <RealisticIcon name="Trophy" theme="gold" size="xs" />
              <span className="hidden sm:inline text-xs font-medium">Trophies</span>
            </button>

            {/* Stats */}
            <button
              onClick={onOpenStats}
              title="Discipline Analytics"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 active:scale-98"
            >
              <RealisticIcon name="BarChart3" theme="emerald" size="xs" />
              <span className="hidden sm:inline text-xs font-medium">Analytics</span>
            </button>

            {/* Logs */}
            <button
              onClick={onOpenHistory}
              title="Push History & Favorites"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 active:scale-98"
            >
              <RealisticIcon name="History" theme="sapphire" size="xs" />
              <span className="hidden sm:inline text-xs font-medium">Logbook</span>
            </button>

            {/* Preferences */}
            <button
              onClick={onOpenPreferences}
              title="Focus Categories & Settings"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all active:scale-98"
            >
              <RealisticIcon name="SlidersHorizontal" theme="titanium" size="xs" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={profile.soundEnabled ? 'Mute acoustic clicks' : 'Enable acoustic clicks'}
              className={`p-1.5 rounded-xl border transition-all active:scale-98 ${
                profile.soundEnabled
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                  : 'bg-slate-900/80 text-slate-500 border-slate-800'
              }`}
            >
              <RealisticIcon
                name={profile.soundEnabled ? 'Volume2' : 'VolumeX'}
                theme={profile.soundEnabled ? 'gold' : 'obsidian'}
                size="xs"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Motivational Live Oracle Strip */}
      <div className="rounded-xl bg-[#0c111e]/90 border border-slate-800/90 px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 min-w-0">
          <RealisticIcon name="Sparkles" theme="gold" size="xs" />
          <div
            className={`min-w-0 transition-opacity duration-150 ${
              quoteAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="text-xs sm:text-[13px] text-slate-200 font-normal truncate sm:whitespace-normal leading-relaxed">
              “{currentQuote.text}”
              <span className="text-amber-400 font-mono text-[11px] ml-2 font-medium not-italic">
                — {currentQuote.author}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          title="Next wisdom insight"
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 shrink-0 transition-all active:scale-90"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};


