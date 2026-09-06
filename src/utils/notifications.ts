import { UserProfile } from '../types';
import { getTodayDateString } from './storage';

/**
 * Utility functions for Browser Notification API reminders
 */

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting Notification permission:', err);
    return Notification.permission;
  }
}

export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions,
  onClick?: () => void
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      ...options,
    } as NotificationOptions);

    notification.onclick = () => {
      window.focus();
      if (onClick) onClick();
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Error dispatching browser notification:', err);
    return false;
  }
}

export function sendSampleNotification(): boolean {
  return sendBrowserNotification('🔥 Daily Push Test Notification', {
    body: 'Daily Push reminders are active! You will be reminded if you havent completed your daily spin.',
    tag: 'daily-push-test',
  });
}

/**
 * Checks whether a reminder should be triggered based on local time and profile state.
 */
export function checkAndTriggerDailyReminder(
  profile: UserProfile,
  onProfileUpdated: (updated: UserProfile) => void
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  if (!profile.reminderNotificationsEnabled) {
    return false;
  }

  const today = getTodayDateString();

  // 1. If user already completed a spin or push today, no reminder needed
  const hasPushedToday =
    profile.lastActiveDate === today ||
    profile.completedPushes.some((p) => p.completedAt.startsWith(today));

  if (hasPushedToday) {
    return false;
  }

  // 2. Check if already sent a notification today
  if (profile.lastNotificationDate === today) {
    return false;
  }

  // 3. Compare current local HH:MM with user-specified reminderTime
  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  const targetTimeStr = profile.reminderTime || '20:00';

  if (currentTimeStr >= targetTimeStr) {
    // Trigger notification!
    const success = sendBrowserNotification('🔥 Daily Push Reminder', {
      body: `Don't break your ${profile.currentStreak}-day streak! Spin the wheel to conquer today's micro-push mission.`,
      tag: `daily-push-reminder-${today}`,
    });

    if (success) {
      const updatedProfile: UserProfile = {
        ...profile,
        lastNotificationDate: today,
      };
      onProfileUpdated(updatedProfile);
      return true;
    }
  }

  return false;
}
