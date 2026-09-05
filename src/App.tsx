import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight,
  Sun,
  Moon,
  RotateCw,
  Clock,
  Check,
} from 'lucide-react';
import { SelectedPush, UserProfile, CategoryId } from './types';
import {
  loadProfile,
  saveProfile,
  recordPushCompletion,
  DEFAULT_PROFILE,
  getTodayDateString,
} from './utils/storage';
import { soundEngine } from './utils/sound';
import { WheelsContainer } from './components/WheelsContainer';
import { PushResultCard } from './components/PushResultCard';
import { FocusTimerModal } from './components/FocusTimerModal';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HistoryModal } from './components/HistoryModal';
import { PreferencesModal } from './components/PreferencesModal';
import { MotivationEmergencyModal } from './components/MotivationEmergencyModal';
import { CATEGORIES, CHALLENGES, DIFFICULTIES, DURATIONS, MOTIVATIONAL_QUOTES } from './data/challenges';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [selectedPush, setSelectedPush] = useState<SelectedPush | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Modals state
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [statsOpen, setStatsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [motivationEmergencyOpen, setMotivationEmergencyOpen] = useState(false);

  // Completion toast celebration
  const [celebration, setCelebration] = useState<{
    show: boolean;
    title: string;
    xp: number;
    leveledUp: boolean;
  } | null>(null);

  // Keep soundEngine in sync with profile
  useEffect(() => {
    soundEngine.setEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Handle Challenge selection from wheels
  const handleChallengeSelected = useCallback((push: SelectedPush) => {
    setSelectedPush(push);
  }, []);

  // Complete Challenge action
  const handleCompleteChallenge = (push: SelectedPush, note?: string) => {
    soundEngine.playTriumph();
    soundEngine.vibrate([40, 30, 80]);

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#f59e0b', '#fbbf24', '#10b981', '#38bdf8', '#c084fc'],
    });

    const result = recordPushCompletion(profile, push, note);
    setProfile(result.updatedProfile);

    setCelebration({
      show: true,
      title: push.challenge.title,
      xp: result.xpEarned,
      leveledUp: result.leveledUp,
    });

    setTimeout(() => {
      setCelebration(null);
    }, 4500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (challengeId: string) => {
    let nextFavorites = [...profile.favoriteChallengeIds];
    if (nextFavorites.includes(challengeId)) {
      nextFavorites = nextFavorites.filter((id) => id !== challengeId);
    } else {
      nextFavorites.push(challengeId);
      soundEngine.playTick(1.5);
    }
    const updated = { ...profile, favoriteChallengeIds: nextFavorites };
    setProfile(updated);
    saveProfile(updated);
  };

  // Start Focus Timer
  const handleStartTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimerOpen(true);
  };

  // Emergency Challenge selection
  const handleSelectEmergencyChallenge = (title: string, categoryId: string) => {
    const cat = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
    const matchedChallenge =
      CHALLENGES.find((ch) => ch.title === title) || {
        id: `emerg_${Date.now()}`,
        title,
        description: 'Take immediate direct action right now to shatter inertia and regain command.',
        categoryId: cat.id,
        defaultDifficulty: 'medium' as const,
        defaultDuration: '5m' as const,
        impactTag: 'Emergency Micro-Push',
      };

    const dif = DIFFICULTIES[1];
    const dur = DURATIONS[0];

    const pushObj: SelectedPush = {
      id: `push_emerg_${Date.now()}`,
      category: cat,
      challenge: matchedChallenge,
      difficulty: dif,
      duration: dur,
      quote: {
        text: "Action cures fear. Indecision, postponement on the other hand, fertilize fear.",
        author: "David J. Schwartz",
      },
      totalXp: 200,
      timestamp: Date.now(),
    };

    setSelectedPush(pushObj);
  };

  // Load Favorite from history modal
  const handleSelectFavoritePush = (challengeId: string) => {
    const ch = CHALLENGES.find((c) => c.id === challengeId);
    if (!ch) return;

    const cat = CATEGORIES.find((c) => c.id === ch.categoryId) || CATEGORIES[0];
    const dif = DIFFICULTIES.find((d) => d.id === ch.defaultDifficulty) || DIFFICULTIES[0];
    const dur = DURATIONS.find((d) => d.id === ch.defaultDuration) || DURATIONS[1];

    const pushObj: SelectedPush = {
      id: `push_fav_${Date.now()}`,
      category: cat,
      challenge: ch,
      difficulty: dif,
      duration: dur,
      quote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)],
      totalXp: Math.round(dif.baseXp * (1 + (dur.minutes / 60) * 0.5)),
      timestamp: Date.now(),
    };

    setSelectedPush(pushObj);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: nextVal };
    setProfile(updated);
    saveProfile(updated);
  };

  // Focus areas update
  const handleUpdateFocusAreas = (focusAreas: CategoryId[]) => {
    const updated = { ...profile, focusAreas };
    setProfile(updated);
    saveProfile(updated);
  };

  // Reset all data
  const handleResetData = () => {
    setProfile(DEFAULT_PROFILE);
    saveProfile(DEFAULT_PROFILE);
    soundEngine.playLock(0);
  };

  // Check if current push is already completed today
  const isCurrentPushCompleted = Boolean(
    selectedPush &&
      profile.completedPushes.some(
        (p) =>
          p.title === selectedPush.challenge.title &&
          p.completedAt.startsWith(getTodayDateString())
      )
  );

  return (
    <div className="min-h-screen bg-[#080b11] text-[#e5e9f0] flex flex-col justify-between selection:bg-amber-400/25 selection:text-amber-100">
      {/* Background Subtle Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-b from-amber-500/[0.08] via-orange-500/[0.03] to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[450px] h-[300px] bg-blue-500/[0.03] blur-3xl" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 py-4 sm:py-6">
        {/* Motivational Greeting Banner */}
        <div className="text-center mb-6 max-w-xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-[-0.03em] leading-tight">
            Spin Your Next Breakthrough.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal leading-relaxed">
            Spin the wheel or swipe directly to select today’s high-impact micro-discipline.
          </p>
        </div>

        {/* The Main Roller Wheels Assembly */}
        <main className="w-full flex-1 flex flex-col justify-center items-center">
          <WheelsContainer
            onChallengeSelected={handleChallengeSelected}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            preferredCategories={profile.focusAreas}
          />

          {/* Today's Push Selected Card */}
          <PushResultCard
            push={selectedPush}
            isSpinning={isSpinning}
            onComplete={handleCompleteChallenge}
            onSpinAgain={() => {
              const spinBtn = document.getElementById('main-spin-button');
              if (spinBtn) spinBtn.click();
            }}
            onStartTimer={handleStartTimer}
            isFavorite={
              selectedPush ? profile.favoriteChallengeIds.includes(selectedPush.challenge.id) : false
            }
            onToggleFavorite={handleToggleFavorite}
            isCompletedToday={isCurrentPushCompleted}
          />
        </main>
      </div>

      {/* Footer Branding & Motivational Tagline */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-5 sm:py-6 mt-8 sm:mt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-mono gap-2.5 sm:gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)] shrink-0" />
          <span className="tracking-wider">DAILY PUSH · PRECISION HABIT ARCHITECTURE</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          <span>{profile.completedPushes.length} Total Pushes</span>
          <span>·</span>
          <span>{profile.currentStreak} Day Streak</span>
          <span>·</span>
          <span>{profile.xp.toLocaleString()} Total XP</span>
        </div>
      </footer>

      {/* Modals */}
      <FocusTimerModal
        isOpen={timerOpen}
        initialMinutes={timerMinutes}
        challengeTitle={selectedPush?.challenge.title || 'Focus Push'}
        onClose={() => setTimerOpen(false)}
        onCompleteFromTimer={() => {
          if (selectedPush) {
            handleCompleteChallenge(selectedPush, 'Completed via built-in Focus Sprint Timer');
          }
        }}
      />

      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        profile={profile}
      />

      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        profile={profile}
      />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        profile={profile}
        onSelectFavoritePush={handleSelectFavoritePush}
      />

      <PreferencesModal
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        profile={profile}
        onUpdateFocusAreas={handleUpdateFocusAreas}
        onToggleSound={handleToggleSound}
        onResetData={handleResetData}
      />

      <MotivationEmergencyModal
        isOpen={motivationEmergencyOpen}
        onClose={() => setMotivationEmergencyOpen(false)}
        onSelectEmergencyChallenge={handleSelectEmergencyChallenge}
      />

      {/* Floating Success Celebration Toast */}
      {celebration && celebration.show && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-bounce sm:max-w-sm">
          <div className="p-4 rounded-2xl bg-[#0d121f] text-white shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center gap-3.5 border border-emerald-400/40">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)] shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                {celebration.leveledUp ? '🔥 LEVEL UP CONQUERED!' : 'PUSH CONQUERED!'}
              </div>
              <div className="text-sm font-display font-extrabold text-white truncate">
                +{celebration.xp} XP Earned
              </div>
              {celebration.leveledUp && (
                <div className="text-xs text-amber-300 font-semibold mt-0.5">
                  Congratulations! You unlocked a new Rank!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
