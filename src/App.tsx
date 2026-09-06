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
import { checkAndTriggerDailyReminder } from './utils/notifications';
import { WheelsContainer } from './components/WheelsContainer';
import { FocusTimerModal } from './components/FocusTimerModal';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HistoryModal } from './components/HistoryModal';
import { PreferencesModal } from './components/PreferencesModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MotivationEmergencyModal } from './components/MotivationEmergencyModal';
import { MotivationDeck } from './components/MotivationDeck';
import { PushNotificationOverlay } from './components/PushNotificationOverlay';
import { CATEGORIES, CHALLENGES, DIFFICULTIES, DURATIONS, MOTIVATIONAL_QUOTES } from './data/challenges';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [selectedPush, setSelectedPush] = useState<SelectedPush | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);

  // Modals state
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [statsOpen, setStatsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [motivationEmergencyOpen, setMotivationEmergencyOpen] = useState(false);

  // Save profile updates from UserProfileModal
  const handleSaveUserProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    soundEngine.playLock(1);
  };

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
    setNotificationOpen(true);
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

  // Emergency SOS completion XP reward
  const handleConquerEmergency = (xpGain: number) => {
    const nextXp = profile.xp + xpGain;
    const nextLevel = Math.floor(nextXp / 500) + 1;
    const leveledUp = nextLevel > profile.level;
    const updated = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
    };
    setProfile(updated);
    saveProfile(updated);

    setCelebration({
      show: true,
      title: 'Anti-Procrastination Shock Completed',
      xp: xpGain,
      leveledUp,
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f59e0b', '#10b981'],
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
    setNotificationOpen(true);
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
    setNotificationOpen(true);
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

  // Wheel theme update
  const handleUpdateWheelTheme = (wheelTheme: 'classic' | 'neon' | 'minimalist') => {
    const updated = { ...profile, wheelTheme };
    setProfile(updated);
    saveProfile(updated);
    soundEngine.playLock(1);
  };

  // Toggle Reminder Notifications
  const handleToggleReminderNotifications = (enabled: boolean) => {
    const updated = { ...profile, reminderNotificationsEnabled: enabled };
    setProfile(updated);
    saveProfile(updated);
    if (enabled) {
      soundEngine.playLock(1);
    }
  };

  // Update Reminder Time
  const handleUpdateReminderTime = (time: string) => {
    const updated = { ...profile, reminderTime: time };
    setProfile(updated);
    saveProfile(updated);
    soundEngine.playTick(1.1);
  };

  // Background reminder checker interval
  useEffect(() => {
    const checkReminder = () => {
      checkAndTriggerDailyReminder(profile, (updated) => {
        setProfile(updated);
        saveProfile(updated);
      });
    };

    checkReminder();
    const interval = setInterval(checkReminder, 30000); // check every 30s
    return () => clearInterval(interval);
  }, [profile]);

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
    <div className="min-h-screen bg-[#070a12] text-[#e5e9f0] flex flex-col justify-between selection:bg-amber-400/25 selection:text-amber-100">
      {/* Background Subtle Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-amber-500/[0.12] via-orange-500/[0.05] to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[550px] h-[350px] bg-blue-500/[0.04] blur-3xl" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto w-full">
        {/* Dynamic Motivation & Command Deck */}
        <MotivationDeck
          profile={profile}
          onOpenStats={() => setStatsOpen(true)}
          onOpenAchievements={() => setAchievementsOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenPreferences={() => setPreferencesOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenMotivationEmergency={() => setMotivationEmergencyOpen(true)}
          onToggleSound={handleToggleSound}
        />

        {/* The Main Wheel Stage with Floating Result Notification Card */}
        <main className="relative w-full flex-1 flex flex-col justify-center items-center my-auto py-2">
          <div className="relative w-full max-w-2xl flex items-center justify-center">
            <WheelsContainer
              onChallengeSelected={handleChallengeSelected}
              isSpinning={isSpinning}
              setIsSpinning={(spinning) => {
                if (spinning) setNotificationOpen(false);
                setIsSpinning(spinning);
              }}
              preferredCategories={profile.focusAreas}
              profile={profile}
            />

            {/* Floating Notification Card directly over the wheel */}
            <PushNotificationOverlay
              isOpen={notificationOpen && !isSpinning}
              push={selectedPush}
              onClose={() => setNotificationOpen(false)}
              onComplete={handleCompleteChallenge}
              onSpinAgain={() => {
                setNotificationOpen(false);
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
          </div>
        </main>
      </div>

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
        onUpdateWheelTheme={handleUpdateWheelTheme}
        onToggleSound={handleToggleSound}
        onToggleReminderNotifications={handleToggleReminderNotifications}
        onUpdateReminderTime={handleUpdateReminderTime}
        onResetData={handleResetData}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveUserProfile}
      />

      <MotivationEmergencyModal
        isOpen={motivationEmergencyOpen}
        onClose={() => setMotivationEmergencyOpen(false)}
        onConquerEmergency={handleConquerEmergency}
      />

      {/* Floating Success Celebration Toast */}
      {celebration && celebration.show && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm transition-all duration-300">
          <div className="p-4 rounded-xl bg-[#0f172a] text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex items-center gap-3.5 border border-slate-700/80">
            <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                {celebration.leveledUp ? 'LEVEL UP!' : 'MISSION ACCOMPLISHED'}
              </div>
              <div className="text-sm font-display font-bold text-white truncate">
                +{celebration.xp} XP Earned
              </div>
              {celebration.leveledUp && (
                <div className="text-xs text-amber-300 font-medium mt-0.5">
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
