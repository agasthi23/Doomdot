import React from 'react';

interface DoomLogoProps {
  variant?: 'badge' | 'lockup' | 'icon' | 'emblem';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const DoomLogo: React.FC<DoomLogoProps> = ({
  variant = 'lockup',
  size = 'md',
  className = '',
  glow = true,
}) => {
  const iconPixelSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const px = iconPixelSizes[size];

  // SVG Graphic of the Official Chiseled "D." Logo from user's image
  const renderLogoMark = (pixelSize: number, uniqueId: string) => (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible shrink-0"
    >
      <defs>
        {/* Cyber Lime Glow Filter */}
        <filter id={`glow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#B8E351" floodOpacity="0.85" />
        </filter>

        {/* White Dot Glow */}
        <filter id={`dot-glow-${uniqueId}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFFFFF" floodOpacity="0.8" />
        </filter>

        {/* Acid Cyber Lime Gradient */}
        <linearGradient id={`lime-grad-${uniqueId}`} x1="18%" y1="24%" x2="74%" y2="76%">
          <stop offset="0%" stopColor="#C9F94A" />
          <stop offset="50%" stopColor="#B4E834" />
          <stop offset="100%" stopColor="#96D01E" />
        </linearGradient>

        {/* Grunge Speckle Pattern to simulate weathered distressed print */}
        <pattern id={`speckle-${uniqueId}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="0.6" fill="#040802" opacity="0.6" />
          <circle cx="9" cy="8" r="0.8" fill="#040802" opacity="0.75" />
          <circle cx="16" cy="4" r="0.5" fill="#040802" opacity="0.5" />
          <circle cx="5" cy="14" r="0.9" fill="#040802" opacity="0.7" />
          <circle cx="12" cy="17" r="0.7" fill="#040802" opacity="0.6" />
          <circle cx="18" cy="12" r="0.8" fill="#040802" opacity="0.65" />
          <circle cx="8" cy="19" r="0.5" fill="#040802" opacity="0.4" />
        </pattern>
      </defs>

      {/* Main Chiseled Monogram "D" in Cyber Lime */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 18 24 L 58 24 L 74 40 L 74 60 L 58 76 L 18 76 L 18 62 L 34 50 L 18 38 L 18 24 Z M 36 38 L 50 38 L 62 50 L 50 62 L 36 62 L 46 50 L 36 38 Z"
        fill={`url(#lime-grad-${uniqueId})`}
        filter={glow ? `url(#glow-${uniqueId})` : undefined}
      />

      {/* Grunge Distress Texture Overlay */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 18 24 L 58 24 L 74 40 L 74 60 L 58 76 L 18 76 L 18 62 L 34 50 L 18 38 L 18 24 Z M 36 38 L 50 38 L 62 50 L 50 62 L 36 62 L 46 50 L 36 38 Z"
        fill={`url(#speckle-${uniqueId})`}
        opacity="0.85"
      />

      {/* Architectural Chisel Facet Seam Lines (As seen in the official logo) */}
      <path d="M 34 50 L 46 50" stroke="#050a02" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
      <path d="M 50 38 L 58 24" stroke="#050a02" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M 50 62 L 58 76" stroke="#050a02" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <path d="M 62 50 L 74 50" stroke="#050a02" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />

      {/* The White Dot (Completing "D." for DoomDot) */}
      <circle
        cx="84"
        cy="68"
        r="8.5"
        fill="#FFFFFF"
        filter={glow ? `url(#dot-glow-${uniqueId})` : undefined}
      />
      {/* Subtle speckle on the white dot */}
      <circle cx="84" cy="68" r="8.5" fill={`url(#speckle-${uniqueId})`} opacity="0.5" />
    </svg>
  );

  // Variant 1: Pure Icon / Emblem
  if (variant === 'icon' || variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        {renderLogoMark(px, `icon-${size}`)}
      </div>
    );
  }

  // Variant 2: Full Badge / Dark Card Frame (as in user's image with black card texture)
  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl border border-[#23430C] bg-[#070906] p-4 shadow-2xl lime-glow select-none group ${className}`}
      >
        <div className="flex items-center gap-3">
          {renderLogoMark(px, `badge-${size}`)}
          <div className="flex flex-col text-left">
            <span className={`font-display font-black tracking-wider text-white uppercase ${textSizes[size]}`}>
              DOOM<span className="text-[#B8E351]">DOT</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
              Digital Builds
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Variant 3: Default 'lockup' for Navbar, Footer, and Header
  return (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official Chiseled "D." Emblem */}
      <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-200">
        {renderLogoMark(px, `lockup-${size}`)}
      </div>

      {/* Typography: DOOMDOT with Unbounded / Space Grotesk */}
      <div className="flex items-baseline font-display font-extrabold tracking-tight text-xl text-white">
        <span className="text-white">DOOM</span>
        <span className="text-[#B8E351]">DOT</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] shadow-[0_0_8px_#B8E351] ml-1 self-center animate-pulse" />
      </div>
    </div>
  );
};
