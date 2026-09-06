import React from 'react';

interface ProLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const ProLogo: React.FC<ProLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const sizeConfig = {
    sm: {
      emblemSize: 'w-7 h-7',
      svgDim: 28,
      titleText: 'text-sm',
      badgeText: 'text-[9px] px-1 py-0.5',
      subText: 'text-[10px]',
    },
    md: {
      emblemSize: 'w-9 h-9',
      svgDim: 36,
      titleText: 'text-base sm:text-lg',
      badgeText: 'text-[10px] px-1.5 py-0.5',
      subText: 'text-[11px]',
    },
    lg: {
      emblemSize: 'w-12 h-12',
      svgDim: 48,
      titleText: 'text-xl sm:text-2xl',
      badgeText: 'text-xs px-2 py-0.5',
      subText: 'text-xs',
    },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Precision 3D Metallic Emblem */}
      <div className={`relative ${sizeConfig.emblemSize} shrink-0 group cursor-pointer`}>
        {/* Ambient Outer Aura Glow */}
        <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/20 to-emerald-400/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Precision SVG Vector Emblem */}
        <svg
          className="relative w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Titanium Metallic Rim */}
            <linearGradient id="logoRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Inner Dark Obsidian Core */}
            <radialGradient id="logoObsidianCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#070a12" />
            </radialGradient>

            {/* Precision Star Blades Gold Gradient */}
            <linearGradient id="logoBladesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Glowing Emerald Core Jewel */}
            <radialGradient id="logoEmeraldJewel" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
          </defs>

          {/* Outer Bezel Circle with Metallic Gradient */}
          <circle cx="24" cy="24" r="22" fill="url(#logoRimGrad)" />

          {/* Inner Inset Trench */}
          <circle cx="24" cy="24" r="19.5" fill="#090d16" stroke="#fbbf24" strokeWidth="0.75" strokeOpacity="0.6" />

          {/* Obsidian Core Base */}
          <circle cx="24" cy="24" r="18" fill="url(#logoObsidianCore)" />

          {/* Micro Rivets on Rim */}
          <circle cx="24" cy="3.5" r="1" fill="#fef08a" />
          <circle cx="44.5" cy="24" r="1" fill="#fef08a" />
          <circle cx="24" cy="44.5" r="1" fill="#fef08a" />
          <circle cx="3.5" cy="24" r="1" fill="#fef08a" />

          {/* 8-Point Precision Momentum Wheel Blades */}
          <g transform="rotate(0 24 24)">
            <path d="M24 8 L27 20 L24 24 L21 20 Z" fill="url(#logoBladesGrad)" opacity="0.95" />
            <path d="M24 40 L27 28 L24 24 L21 28 Z" fill="url(#logoBladesGrad)" opacity="0.95" />
            <path d="M8 24 L20 21 L24 24 L20 27 Z" fill="url(#logoBladesGrad)" opacity="0.95" />
            <path d="M40 24 L28 21 L24 24 L28 27 Z" fill="url(#logoBladesGrad)" opacity="0.95" />
          </g>
          <g transform="rotate(45 24 24)">
            <path d="M24 10 L26.5 21 L24 24 L21.5 21 Z" fill="url(#logoBladesGrad)" opacity="0.8" />
            <path d="M24 38 L26.5 27 L24 24 L21.5 27 Z" fill="url(#logoBladesGrad)" opacity="0.8" />
            <path d="M10 24 L21 21.5 L24 24 L21 26.5 Z" fill="url(#logoBladesGrad)" opacity="0.8" />
            <path d="M38 24 L27 21.5 L24 24 L27 26.5 Z" fill="url(#logoBladesGrad)" opacity="0.8" />
          </g>

          {/* Inner Golden Ring Divider */}
          <circle cx="24" cy="24" r="8.5" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 1.5" />

          {/* Center Glowing Emerald Core Jewel */}
          <circle cx="24" cy="24" r="5.5" fill="url(#logoEmeraldJewel)" />
          <circle cx="22.5" cy="22.5" r="1.8" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>

      {/* Brand Text & Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-black tracking-tight text-white ${sizeConfig.titleText}`}>
            DAILY PUSH
          </span>
          <span
            className={`font-mono font-extrabold rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.35)] tracking-wider ${sizeConfig.badgeText}`}
          >
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-mono font-semibold text-amber-300/90 tracking-wide ${sizeConfig.subText}`}>
            MOMENTUM & DISCIPLINE SYSTEM
          </span>
        )}
      </div>
    </div>
  );
};
