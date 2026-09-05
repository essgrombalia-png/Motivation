import React from 'react';
import * as LucideIcons from 'lucide-react';

export type RealisticIconTheme =
  | 'gold'
  | 'emerald'
  | 'sapphire'
  | 'ruby'
  | 'amber'
  | 'amethyst'
  | 'titanium'
  | 'cyan'
  | 'rose'
  | 'obsidian';

export type RealisticIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface RealisticIconProps {
  name: string;
  theme?: RealisticIconTheme;
  size?: RealisticIconSize;
  className?: string;
  glow?: boolean;
}

const THEME_STYLES: Record<
  RealisticIconTheme,
  {
    container: string;
    border: string;
    shadow: string;
    iconColor: string;
    iconShadow: string;
    highlight: string;
  }
> = {
  gold: {
    container: 'bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309]',
    border: 'border-[#fef9c3]/60 ring-1 ring-inset ring-white/40',
    shadow: 'shadow-[0_4px_12px_rgba(245,158,11,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#1c1204]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]',
    highlight: 'from-white/30 to-transparent',
  },
  emerald: {
    container: 'bg-gradient-to-b from-[#6ee7b7] via-[#10b981] to-[#047857]',
    border: 'border-[#a7f3d0]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(16,185,129,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#022414]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  sapphire: {
    container: 'bg-gradient-to-b from-[#93c5fd] via-[#3b82f6] to-[#1d4ed8]',
    border: 'border-[#bfdbfe]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(59,130,246,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#051838]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  ruby: {
    container: 'bg-gradient-to-b from-[#fca5a5] via-[#ef4444] to-[#b91c1c]',
    border: 'border-[#fecaca]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(239,68,68,0.4),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#350707]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  amber: {
    container: 'bg-gradient-to-b from-[#fdba74] via-[#f97316] to-[#c2410c]',
    border: 'border-[#ffedd5]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(249,115,22,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#2a0e02]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  amethyst: {
    container: 'bg-gradient-to-b from-[#d8b4fe] via-[#a855f7] to-[#6b21a8]',
    border: 'border-[#f3e8ff]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(168,85,247,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#230638]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  titanium: {
    container: 'bg-gradient-to-b from-[#e2e8f0] via-[#94a3b8] to-[#475569]',
    border: 'border-[#f8fafc]/70 ring-1 ring-inset ring-white/40',
    shadow: 'shadow-[0_4px_12px_rgba(148,163,184,0.25),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#0f172a]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]',
    highlight: 'from-white/40 to-transparent',
  },
  cyan: {
    container: 'bg-gradient-to-b from-[#67e8f9] via-[#06b6d4] to-[#0e7490]',
    border: 'border-[#cffafe]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(6,182,212,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#04242e]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  rose: {
    container: 'bg-gradient-to-b from-[#fda4af] via-[#f43f5e] to-[#be123c]',
    border: 'border-[#ffe4e6]/60 ring-1 ring-inset ring-white/35',
    shadow: 'shadow-[0_4px_12px_rgba(244,63,94,0.35),0_1px_2px_rgba(0,0,0,0.8)]',
    iconColor: 'text-[#33040e]',
    iconShadow: 'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
    highlight: 'from-white/30 to-transparent',
  },
  obsidian: {
    container: 'bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a]',
    border: 'border-slate-600/70 ring-1 ring-inset ring-white/10',
    shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.9)]',
    iconColor: 'text-amber-300',
    iconShadow: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
    highlight: 'from-white/15 to-transparent',
  },
};

const SIZE_STYLES: Record<
  RealisticIconSize,
  {
    container: string;
    icon: number;
  }
> = {
  xs: {
    container: 'w-6 h-6 rounded-lg p-1 border',
    icon: 13,
  },
  sm: {
    container: 'w-8 h-8 rounded-xl p-1.5 border-[1.5px]',
    icon: 16,
  },
  md: {
    container: 'w-10 h-10 rounded-2xl p-2 border-2',
    icon: 20,
  },
  lg: {
    container: 'w-13 h-13 rounded-2xl p-2.5 border-2',
    icon: 26,
  },
  xl: {
    container: 'w-16 h-16 rounded-3xl p-3 border-2',
    icon: 32,
  },
};

export const RealisticIcon: React.FC<RealisticIconProps> = ({
  name,
  theme = 'gold',
  size = 'md',
  className = '',
  glow = false,
}) => {
  const t = THEME_STYLES[theme] || THEME_STYLES.gold;
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;

  // Resolve Lucide Icon component safely
  const iconsMap = LucideIcons as Record<string, React.ComponentType<any>>;
  const IconComponent = iconsMap[name] || iconsMap.Sparkles || LucideIcons.Sparkles;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none transition-transform duration-200 active:scale-95 ${
        s.container
      } ${t.container} ${t.border} ${t.shadow} ${className}`}
    >
      {/* Specular gloss curved highlight on top edge */}
      <div
        className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b ${t.highlight} rounded-t-xl pointer-events-none`}
      />

      {/* Realistic Bevel Inner Rim */}
      <div className="absolute inset-0 rounded-[inherit] border border-black/15 pointer-events-none" />

      {/* Main Lucide Icon with realistic depth */}
      <div className={`relative z-10 ${t.iconColor} ${t.iconShadow} flex items-center justify-center`}>
        <IconComponent size={s.icon} strokeWidth={2.4} />
      </div>

      {/* Optional Ambient Aura */}
      {glow && (
        <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
