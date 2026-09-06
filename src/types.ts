export type CategoryId =
  | 'health'
  | 'fitness'
  | 'mindset'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'discipline'
  | 'finance'
  | 'self-care'
  | 'creativity';

export type DifficultyId = 'easy' | 'medium' | 'hard' | 'beast';

export type DurationId = '5m' | '10m' | '15m' | '30m' | '45m' | '60m';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  gradient: string;
  badgeBg: string;
  description: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  categoryId: CategoryId;
  defaultDifficulty: DifficultyId;
  defaultDuration: DurationId;
  impactTag: string;
}

export interface DifficultyItem {
  id: DifficultyId;
  label: string;
  xpMultiplier: number;
  baseXp: number;
  color: string;
  textColor: string;
  borderColor: string;
}

export interface DurationItem {
  id: DurationId;
  label: string;
  minutes: number;
}

export interface SelectedPush {
  id: string;
  category: CategoryItem;
  challenge: ChallengeItem;
  difficulty: DifficultyItem;
  duration: DurationItem;
  quote: {
    text: string;
    author: string;
  };
  totalXp: number;
  timestamp: number;
}

export interface CompletedPush {
  id: string;
  pushId: string;
  title: string;
  categoryId: CategoryId;
  difficultyId: DifficultyId;
  durationMinutes: number;
  xpEarned: number;
  completedAt: string; // ISO string
  reflectionNote?: string;
  rating?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'streaks' | 'xp' | 'completion' | 'mastery';
  condition: (profile: UserProfile) => boolean;
}

export interface UserProfile {
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  activeDates: string[]; // list of YYYY-MM-DD
  completedPushes: CompletedPush[];
  favoriteChallengeIds: string[];
  focusAreas: CategoryId[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  todayOfficialPush: SelectedPush | null;
  todayOfficialCompleted: boolean;
  // Personalized profile fields
  userName?: string;
  userAge?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced' | 'beast';
  occupation?: string;
  personalGoal?: string;
  onboardingCompleted?: boolean;
  wheelTheme?: 'classic' | 'neon' | 'minimalist';
  // Browser Notification settings
  reminderNotificationsEnabled?: boolean;
  reminderTime?: string; // HH:MM 24-hour format
  lastNotificationDate?: string | null;
}
