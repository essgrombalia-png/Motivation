import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  History,
  Bookmark,
  Clock,
  Download,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { UserProfile } from '../types';
import { CATEGORIES, CHALLENGES } from '../data/challenges';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectFavoritePush?: (challengeId: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectFavoritePush,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredHistory = profile.completedPushes.filter((p) => {
    if (selectedCategoryFilter === 'all') return true;
    return p.categoryId === selectedCategoryFilter;
  });

  const favoriteChallenges = CHALLENGES.filter((ch) =>
    profile.favoriteChallengeIds.includes(ch.id)
  );

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(profile.completedPushes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `daily_push_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0d121f] p-6 sm:p-8 border border-white/[0.09] shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Logbook & Favorites
                </h2>
                <p className="text-xs text-slate-400">Archived actions and saved micro-pushes</p>
              </div>
            </div>

            {profile.completedPushes.length > 0 && (
              <button
                onClick={handleExport}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-colors mr-8"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 mb-4 p-1 rounded-2xl bg-black/50 border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Completed Log ({profile.completedPushes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-display font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Favorites ({favoriteChallenges.length})</span>
            </button>
          </div>

          {/* Tab 1: Completed History */}
          {activeTab === 'history' && (
            <>
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold shrink-0 border transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-black/40 text-slate-400 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 border transition-all ${
                      selectedCategoryFilter === c.id
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-black/40 text-slate-400 border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 rounded-2xl bg-black/30 border border-white/[0.06] my-4">
                    <p className="font-semibold text-sm text-slate-400">No completed pushes logged yet.</p>
                    <p className="text-xs mt-1 text-slate-500">Spin the wheels and conquer your first daily challenge!</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const catObj = CATEGORIES.find((c) => c.id === item.categoryId);
                    const formattedDate = new Date(item.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] hover:border-white/[0.14] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-display font-bold text-white leading-snug">
                            {item.title}
                          </h4>
                          <span className="shrink-0 text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/25">
                            +{item.xpEarned} XP
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          {catObj && (
                            <span
                              className="font-semibold"
                              style={{ color: catObj.color }}
                            >
                              {catObj.label}
                            </span>
                          )}
                          <span>·</span>
                          <span className="capitalize">{item.difficultyId}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {item.durationMinutes} min
                          </span>
                          <span>·</span>
                          <span className="text-slate-500 font-mono">{formattedDate}</span>
                        </div>

                        {item.reflectionNote && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 italic flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>"{item.reflectionNote}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Tab 2: Favorites */}
          {activeTab === 'favorites' && (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {favoriteChallenges.length === 0 ? (
                <div className="p-8 text-center text-slate-500 rounded-2xl bg-black/30 border border-white/[0.06] my-4">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="font-semibold text-sm text-slate-400">No saved favorite challenges yet.</p>
                  <p className="text-xs mt-1 text-slate-500">Tap the bookmark icon on any challenge card to save it here for fast loading!</p>
                </div>
              ) : (
                favoriteChallenges.map((ch) => {
                  const catObj = CATEGORIES.find((c) => c.id === ch.categoryId);

                  return (
                    <div
                      key={ch.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/[0.07] hover:border-white/[0.14] transition-all flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-display font-bold text-white">{ch.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          {catObj && (
                            <span style={{ color: catObj.color }} className="font-semibold">
                              {catObj.label}
                            </span>
                          )}
                          <span>·</span>
                          <span>{ch.impactTag}</span>
                        </div>
                      </div>

                      {onSelectFavoritePush && (
                        <button
                          onClick={() => {
                            onSelectFavoritePush(ch.id);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1 shrink-0 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                        >
                          <span>Load Push</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
