import React from 'react';
import { useLanguage } from '../lib/i18n.tsx';

interface LogoProps {
  className?: string;
  showText?: boolean;
  lightText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showText = true, lightText = false, size = 'md' }: LogoProps) {
  const { translate } = useLanguage();
  const sizeClasses = {
    sm: {
      container: 'h-8 gap-2',
      icon: 'w-8 h-8 shrink-0',
      text: 'text-sm font-black',
      sub: 'text-[6.5px] tracking-[0.05em]'
    },
    md: {
      container: 'h-10 md:h-12 gap-2.5',
      icon: 'w-10 h-10 md:w-11 md:h-11 shrink-0',
      text: 'text-base lg:text-lg font-black',
      sub: 'text-[7px] lg:text-[8px] tracking-[0.06em]'
    },
    lg: {
      container: 'h-14 md:h-16 gap-3',
      icon: 'w-14 h-14 md:w-16 md:h-16 shrink-0',
      text: 'text-xl md:text-2xl font-black',
      sub: 'text-[9px] md:text-[10px] tracking-[0.08em]'
    }
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${selectedSize.container} ${className}`}>
      {/* Visual Icon (SVG representation of the custom logo) */}
      <svg
        viewBox="0 0 100 100"
        className={`${selectedSize.icon} select-none shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer squircle base with rounded corners & clipping */}
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B0FF" />
            <stop offset="60%" stopColor="#0091EA" />
            <stop offset="100%" stopColor="#0077C2" />
          </linearGradient>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0091EA" stopOpacity="0.1" />
          </linearGradient>
          <clipPath id="squircleClip">
            <circle cx="50" cy="50" r="45" />
          </clipPath>
        </defs>

        {/* Squircle base */}
        <circle cx="50" cy="50" r="45" fill="url(#blueGrad)" />

        {/* Inner white circle base for background contrast */}
        <circle cx="50" cy="50" r="41" fill="#FFFFFF" />

        {/* Outer frame trim - recreate the left-side thicker border */}
        <path
          d="M 12 50 A 38 38 0 1 1 88 50 A 38 38 0 0 1 12 50"
          stroke="url(#blueGrad)"
          strokeWidth="6"
          fill="none"
        />

        {/* Golden/Orange Sun */}
        <circle cx="65" cy="58" r="11" fill="#FF9100" />

        {/* Palm Tree on the Left */}
        {/* Trunk */}
        <path
          d="M 23 82 Q 33 65 31 46 C 30.5 42 29.5 39 30 38 C 30.5 37 32 40 32.5 44 Q 35 63 26 82 Z"
          fill="#0D1B2A"
        />
        {/* Leaves */}
        {/* Leaf 1 (Left-top) */}
        <path
          d="M 31 43 Q 19 38 12 45 C 15 48 18 48 24 46 C 27 45 30 43 31 43 Z"
          fill="#0D1B2A"
        />
        {/* Leaf 2 (Top) */}
        <path
          d="M 31 43 Q 29 28 35 21 C 36 26 36 30 34 37 C 33.5 39 32 42 31 43 Z"
          fill="#0D1B2A"
        />
        {/* Leaf 3 (Right-top) */}
        <path
          d="M 31 43 Q 44 34 49 41 C 45 44 42 44 36 44 C 33 44 32 43 31 43 Z"
          fill="#0D1B2A"
        />
        {/* Leaf 4 (Right-down) */}
        <path
          d="M 31 43 Q 43 49 45 57 C 41 57 37 54 34 50 C 32 47 31.5 45 31 43 Z"
          fill="#0D1B2A"
        />
        {/* Leaf 5 (Left-down) */}
        <path
          d="M 31 43 Q 19 50 16 57 C 18 53 22 51 26 48 C 29 46 30.5 44 31 43 Z"
          fill="#0D1B2A"
        />

        {/* Swooping ocean wave from bottom-left to bottom-right */}
        <path
          d="M 9 72 Q 35 60 55 68 T 91 66 L 91 85 L 9 85 Z"
          fill="url(#blueGrad)"
        />
        <path
          d="M 8 74 Q 35 64 55 71 T 92 68 L 92 84 L 8 84 Z"
          fill="#FFFFFF"
          opacity="0.8"
        />
        <path
          d="M 8 77 Q 35 68 55 74 T 92 71 L 92 84 L 8 84 Z"
          fill="url(#blueGrad)"
        />

        {/* Small airplane soaring with a tail wave */}
        {/* Flight arc line */}
        <path
          d="M 50 78 Q 78 78 81 48"
          stroke="#0091EA"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Airplane body */}
        <g transform="translate(73, 38) rotate(-22)">
          {/* Main wing */}
          <path d="M 0 -1 L 8 -12 L 11 -12 L 5 0 Z" fill="#0D1B2A" />
          <path d="M 0 1 L 8 12 L 11 12 L 5 0 Z" fill="#0D1B2A" />
          {/* Fuselage */}
          <path d="M -10 0 C -10 -2 15 -3 18 0 C 15 3 -10 2 -10 0 Z" fill="#0D1B2A" />
          {/* Tail fin */}
          <path d="M -8 0 L -12 -5 L -10 -5 L -5 0 Z" fill="#0D1B2A" />
        </g>
      </svg>

      {/* Brand Label & Subtitle Text */}
      {showText && (
        <div className="flex flex-col leading-none justify-center min-w-0 flex-1">
          <div className={`${selectedSize.text} font-black tracking-tight flex items-center gap-1.5 whitespace-nowrap`}>
            <span className={lightText ? 'text-white' : 'text-[#0D1B2A] dark:text-white'}>Premier</span>
            <span className="text-[#0091EA] whitespace-nowrap">Tour Booking</span>
          </div>
          <span className={`${selectedSize.sub} font-bold mt-1 uppercase block ${lightText ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'} whitespace-nowrap`}>
            {translate('Discover the World, Perfected For You')}
          </span>
        </div>
      )}
    </div>
  );
}
