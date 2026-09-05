import { CompletedPush, SelectedPush, UserProfile } from '../types';

const STORAGE_KEY = 'daily_push_user_profile_v1';

export const LEVEL_TIERS = [
  { level: 1, xpReq: 0, title: 'Day One Rebel' },
  { level: 2, xpReq: 250, title: 'Momentum Builder' },
  { level: 3, xpReq: 600, title: 'Habit Pioneer' },
  { level: 4, xpReq: 1100, title: 'Relentless Focus' },
  { level: 5, xpReq: 1800, title: 'Discipline Master' },
  { level: 6, xpReq: 2700, title: 'Flow State Adept' },
  { level: 7, xpReq: 3800, title: 'Iron Mind' },
  { level: 8, xpReq: 5100, title: 'Self-Mastery Architect' },
  { level: 9, xpReq: 6600, title: 'Unstoppable Force' },
  { level: 10, xpReq: 8500, title: 'Apex Titan' },
];

export function calculateLevel(xp: number) {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].xpReq) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || {
        level: currentTier.level + 1,
        xpReq: currentTier.xpReq + 2500,
        title: 'Apex Legend',
      };
      break;
    }
  }

  const range = nextTier.xpReq - currentTier.xpReq;
  const currentInTier = Math.max(0, xp - currentTier.xpReq);
  const progressPercent = Math.min(100, Math.round((currentInTier / range) * 100));

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentLevelXp: currentInTier,
    nextLevelXp: range,
    progressPercent,
    totalXp: xp,
  };
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DEFAULT_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  activeDates: [],
  completedPushes: [],
  favoriteChallengeIds: [],
  focusAreas: ['health', 'fitness', 'productivity', 'mindset', 'discipline'],
  soundEnabled: true,
  hapticsEnabled: true,
  todayOfficialPush: null,
  todayOfficialCompleted: false,
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      focusAreas: parsed.focusAreas || DEFAULT_PROFILE.focusAreas,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function recordPushCompletion(
  prevProfile: UserProfile,
  push: SelectedPush,
  reflectionNote?: string
): { updatedProfile: UserProfile; xpEarned: number; leveledUp: boolean } {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let newStreak = prevProfile.currentStreak;
  if (prevProfile.lastActiveDate === today) {
    // already active today, streak remains active
  } else if (prevProfile.lastActiveDate === yesterday) {
    // consecutive day
    newStreak += 1;
  } else {
    // broken or first time
    newStreak = 1;
  }

  const bestStreak = Math.max(newStreak, prevProfile.bestStreak);
  const activeDates = prevProfile.activeDates.includes(today)
    ? prevProfile.activeDates
    : [...prevProfile.activeDates, today];

  const xpEarned = push.totalXp;
  const newTotalXp = prevProfile.xp + xpEarned;
  const oldLevel = calculateLevel(prevProfile.xp).level;
  const newLevelInfo = calculateLevel(newTotalXp);
  const leveledUp = newLevelInfo.level > oldLevel;

  const newCompletedPush: CompletedPush = {
    id: `push_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    pushId: push.id,
    title: push.challenge.title,
    categoryId: push.category.id,
    difficultyId: push.difficulty.id,
    durationMinutes: push.duration.minutes,
    xpEarned,
    completedAt: new Date().toISOString(),
    reflectionNote: reflectionNote?.trim() || undefined,
  };

  const updatedProfile: UserProfile = {
    ...prevProfile,
    xp: newTotalXp,
    level: newLevelInfo.level,
    currentStreak: newStreak,
    bestStreak,
    lastActiveDate: today,
    activeDates,
    completedPushes: [newCompletedPush, ...prevProfile.completedPushes],
    todayOfficialCompleted:
      prevProfile.todayOfficialPush?.id === push.id ? true : prevProfile.todayOfficialCompleted,
  };

  saveProfile(updatedProfile);

  return {
    updatedProfile,
    xpEarned,
    leveledUp,
  };
}
