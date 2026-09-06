import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Sparkles, Check, Dumbbell, Briefcase, Target, Calendar } from 'lucide-react';
import { CategoryId, UserProfile } from '../types';
import { CATEGORIES } from '../data/challenges';
import { RealisticIcon, RealisticIconTheme } from './RealisticIcon';
import { soundEngine } from '../utils/sound';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [userName, setUserName] = useState(profile.userName || '');
  const [userAge, setUserAge] = useState<string>(profile.userAge ? String(profile.userAge) : '');
  const [fitnessLevel, setFitnessLevel] = useState<
    'beginner' | 'intermediate' | 'advanced' | 'beast'
  >(profile.fitnessLevel || 'intermediate');
  const [occupation, setOccupation] = useState(profile.occupation || 'Discipline Seeker');
  const [personalGoal, setPersonalGoal] = useState(
    profile.personalGoal || 'Master micro-habits and elevate daily focus'
  );
  const [focusAreas, setFocusAreas] = useState<CategoryId[]>(
    profile.focusAreas && profile.focusAreas.length > 0
      ? profile.focusAreas
      : ['health', 'fitness', 'productivity', 'mindset', 'discipline']
  );

  if (!isOpen) return null;

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
    if (focusAreas.includes(catId)) {
      if (focusAreas.length <= 1) return;
      setFocusAreas(focusAreas.filter((id) => id !== catId));
    } else {
      setFocusAreas([...focusAreas, catId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTriumph();

    const parsedAge = userAge.trim() ? parseInt(userAge.trim(), 10) : undefined;

    const updatedProfile: UserProfile = {
      ...profile,
      userName: userName.trim(),
      userAge: isNaN(parsedAge as number) ? undefined : parsedAge,
      fitnessLevel,
      occupation: occupation.trim() || 'Discipline Seeker',
      personalGoal: personalGoal.trim() || 'Master micro-habits and elevate daily focus',
      focusAreas,
      onboardingCompleted: true,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  const presetRoles = [
    'Student',
    'Professional',
    'Creative',
    'Entrepreneur',
    'Athlete',
    'Busy Parent',
    'Freelancer',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0c1220] p-5 sm:p-7 border border-amber-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] max-h-[90vh] overflow-y-auto my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-2">
            <RealisticIcon name="User" theme="gold" size="md" glow />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                PERSONALIZED WHEEL ENGINE
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                Your Personal Profile
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Tell us about yourself. The Daily Push Wheel uses your age, name, fitness baseline, and daily goals to calibrate custom challenges adapted specifically for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Age Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Your Name / Callsign
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex, Jordan, Titan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Your Age
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  placeholder="e.g. 24"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all"
                />
              </div>
            </div>

            {/* Occupation / Life Context */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                Occupation / Primary Role
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Software Engineer, Student, Entrepreneur..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-all mb-1.5"
              />
              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-1.5">
                {presetRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setOccupation(role)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      occupation.toLowerCase() === role.toLowerCase()
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Baseline Level */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                Fitness Baseline Level (Adapts physical wheel wedges)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner', desc: 'Gentle mobility' },
                  { id: 'intermediate', label: 'Intermediate', desc: 'Balanced pushes' },
                  { id: 'advanced', label: 'Advanced', desc: 'High intensity' },
                  { id: 'beast', label: 'Beast Mode', desc: 'Max limit' },
                ].map((lvl) => {
                  const isSelected = fitnessLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        setFitnessLevel(lvl.id as 'beginner' | 'intermediate' | 'advanced' | 'beast')
                      }
                      className={`p-2.5 rounded-xl border text-left flex flex-col transition-all ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400/60 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{lvl.label}</span>
                      <span className="text-[10px] text-slate-400">{lvl.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Motivation & Focus Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                Personal Focus & Goal
              </label>
              <input
                type="text"
                value={personalGoal}
                onChange={(e) => setPersonalGoal(e.target.value)}
                placeholder="e.g. Build strong morning routine, boost stamina, eliminate procrastination..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-all"
              />
            </div>

            {/* Focus Categories Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>Tailored Focus Domains</span>
                <span className="text-[10px] text-amber-400 font-normal">
                  {focusAreas.length} Selected
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = focusAreas.includes(cat.id);
                  const theme = categoryThemeMap[cat.id] || 'gold';
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400/40 text-white'
                          : 'bg-slate-950/60 border-slate-800/60 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <RealisticIcon name={cat.icon} theme={theme} size="xs" />
                        <span className="text-[11px] font-semibold truncate">{cat.label}</span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-display font-extrabold text-sm uppercase tracking-wide hover:brightness-105 active:scale-98 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Save Profile & Calibrate Wheel</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
