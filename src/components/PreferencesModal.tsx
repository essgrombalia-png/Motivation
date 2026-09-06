import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Sparkles, Moon, Sun, Bell, Clock, Send, AlertTriangle } from 'lucide-react';
import { CategoryId, UserProfile } from '../types';
import { CATEGORIES } from '../data/challenges';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  sendSampleNotification,
} from '../utils/notifications';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateFocusAreas: (areas: CategoryId[]) => void;
  onUpdateWheelTheme: (theme: 'classic' | 'neon' | 'minimalist') => void;
  onToggleSound: (val: boolean) => void;
  onToggleReminderNotifications: (enabled: boolean) => void;
  onUpdateReminderTime: (time: string) => void;
  onResetData: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateFocusAreas,
  onUpdateWheelTheme,
  onToggleSound,
  onToggleReminderNotifications,
  onUpdateReminderTime,
  onResetData,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermissionStatus()
  );
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const currentTheme = profile.wheelTheme || 'classic';
  const reminderEnabled = Boolean(profile.reminderNotificationsEnabled);
  const reminderTime = profile.reminderTime || '20:00';

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      onToggleReminderNotifications(true);
    }
  };

  const handleTestNotification = () => {
    const ok = sendSampleNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

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

  const toggleCategory = (catId: CategoryId) => {
    let nextAreas: CategoryId[];
    if (profile.focusAreas.includes(catId)) {
      if (profile.focusAreas.length <= 1) return;
      nextAreas = profile.focusAreas.filter((id) => id !== catId);
    } else {
      nextAreas = [...profile.focusAreas, catId];
    }
    onUpdateFocusAreas(nextAreas);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-white/[0.09] shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <RealisticIcon name="SlidersHorizontal" theme="sapphire" size="md" glow />
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Focus Areas & Settings
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            Configure the categories you wish to calibrate. The roller wheel biases toward your chosen focus areas during randomized selections.
          </p>

          {/* Categories Multi-Select Chips */}
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {CATEGORIES.map((cat) => {
              const isSelected = profile.focusAreas.includes(cat.id);
              const theme = categoryThemeMap[cat.id] || 'gold';
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-950/60 border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <RealisticIcon name={cat.icon} theme={theme} size="xs" />
                    <span className="text-xs sm:text-sm font-semibold truncate">{cat.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Wheel Visual Theme Selector */}
          <div className="pt-4 border-t border-white/[0.07] mb-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400 mb-3 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>WHEEL VISUAL THEME</span>
            </h4>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Classic Gold Theme */}
              <button
                type="button"
                onClick={() => onUpdateWheelTheme('classic')}
                className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  currentTheme === 'classic'
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border border-amber-300 shadow-sm" />
                  {currentTheme === 'classic' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-display">Classic</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Machined Gold & Slate</div>
                </div>
              </button>

              {/* Neon Cyberpunk Theme */}
              <button
                type="button"
                onClick={() => onUpdateWheelTheme('neon')}
                className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  currentTheme === 'neon'
                    ? 'bg-cyan-500/10 border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-emerald-400 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  {currentTheme === 'neon' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-cyan-300 font-display">Neon</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Cyber Glow</div>
                </div>
              </button>

              {/* Minimalist Theme */}
              <button
                type="button"
                onClick={() => onUpdateWheelTheme('minimalist')}
                className={`relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  currentTheme === 'minimalist'
                    ? 'bg-slate-800/80 border-slate-300/60 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-zinc-900 via-slate-700 to-zinc-200 border border-slate-400" />
                  {currentTheme === 'minimalist' && <Check className="w-3.5 h-3.5 text-slate-200" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 font-display">Minimalist</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Monochrome Obsidian</div>
                </div>
              </button>
            </div>
          </div>

          {/* Push Notification Daily Reminder Section */}
          <div className="pt-4 border-t border-white/[0.07] mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>DAILY SPIN PUSH REMINDERS</span>
              </h4>

              {/* Browser Permission Badge */}
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : permissionStatus === 'denied'
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                {permissionStatus === 'granted'
                  ? 'Permission Active'
                  : permissionStatus === 'denied'
                  ? 'Permission Blocked'
                  : 'Permission Required'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.08] flex flex-col gap-3.5">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RealisticIcon
                    name={reminderEnabled ? 'BellRing' : 'BellOff'}
                    theme={reminderEnabled ? 'gold' : 'obsidian'}
                    size="sm"
                    glow={reminderEnabled}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Daily Spin Reminder</div>
                    <div className="text-[11px] text-slate-400">
                      Alerts you via browser push if you haven't spun today
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (permissionStatus !== 'granted') {
                      handleRequestPermission();
                    } else {
                      onToggleReminderNotifications(!reminderEnabled);
                    }
                  }}
                  className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                    reminderEnabled && permissionStatus === 'granted'
                      ? 'bg-amber-400 justify-end'
                      : 'bg-white/[0.1] justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5 h-5 rounded-full ${
                      reminderEnabled && permissionStatus === 'granted' ? 'bg-slate-950' : 'bg-slate-400'
                    }`}
                  />
                </button>
              </div>

              {/* Time Picker & Control Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                {/* Time Input */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300">Remind Me At:</span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => onUpdateReminderTime(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 text-amber-300 font-mono text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                  />
                </div>

                {/* Request Permission or Test Button */}
                <div className="flex items-center gap-2">
                  {permissionStatus !== 'granted' ? (
                    <button
                      type="button"
                      onClick={handleRequestPermission}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition-all flex items-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Allow Notifications</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTestNotification}
                      disabled={testSent}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testSent ? 'Test Sent!' : 'Test Notification'}</span>
                    </button>
                  )}
                </div>
              </div>

              {permissionStatus === 'denied' && (
                <div className="text-[11px] text-rose-300/90 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Browser notifications are blocked in your site settings. Please click the lock icon in your address bar to allow notifications.</span>
                </div>
              )}
            </div>
          </div>

          {/* Sound & Sensory Settings */}
          <div className="pt-4 border-t border-white/[0.07] mb-6">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
              ACOUSTIC & TACTILE FEEDBACK
            </h4>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <RealisticIcon
                  name={profile.soundEnabled ? 'Volume2' : 'VolumeX'}
                  theme={profile.soundEnabled ? 'gold' : 'obsidian'}
                  size="sm"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Mechanical Sound Synthesizer</div>
                  <div className="text-[11px] text-slate-400">Tactile clicks, cylinder locks, and celebratory fanfares</div>
                </div>
              </div>
              <button
                onClick={() => onToggleSound(!profile.soundEnabled)}
                className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                  profile.soundEnabled ? 'bg-amber-400 justify-end' : 'bg-white/[0.1] justify-start'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full ${
                    profile.soundEnabled ? 'bg-slate-950' : 'bg-slate-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset App State */}
          <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-300">Reset Local Profile</div>
              <div className="text-[11px] text-slate-500">Purge streaks, completions, and accumulated XP</div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress, streaks, and XP?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5"
            >
              <RealisticIcon name="RotateCcw" theme="ruby" size="xs" />
              <span>Reset Data</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
