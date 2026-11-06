import { useId } from 'react';
import type { CountryCode } from '../../data/sports';

const NAMES: Record<CountryCode, string> = {
  BD: 'Bangladesh',
  PT: 'Portugal',
  ES: 'Spain',
  GB: 'United Kingdom',
};

/** Small inline SVG flags — render the same on every OS (unlike emoji flags). */
export function Flag({ code, className = 'h-3.5' }: { code: CountryCode; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const common = {
    role: 'img' as const,
    'aria-label': `${NAMES[code]} flag`,
    className: `inline-block w-auto shrink-0 rounded-[3px] ring-1 ring-black/10 ${className}`,
  };

  switch (code) {
    case 'BD':
      return (
        <svg viewBox="0 0 30 20" {...common}>
          <rect width="30" height="20" fill="#006A4E" />
          <circle cx="13.5" cy="10" r="6" fill="#F42A41" />
        </svg>
      );
    case 'PT':
      return (
        <svg viewBox="0 0 30 20" {...common}>
          <rect width="30" height="20" fill="#DA291C" />
          <rect width="12" height="20" fill="#046A38" />
          <circle cx="12" cy="10" r="4.2" fill="none" stroke="#FFE900" strokeWidth="1.3" />
          <path d="M10.2 7.6h3.6v3.2a1.8 1.8 0 0 1-3.6 0z" fill="#fff" stroke="#DA291C" strokeWidth=".7" />
        </svg>
      );
    case 'ES':
      return (
        <svg viewBox="0 0 30 20" {...common}>
          <rect width="30" height="20" fill="#AA151B" />
          <rect y="5" width="30" height="10" fill="#F1BF00" />
        </svg>
      );
    case 'GB':
      return (
        <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" {...common} style={{ aspectRatio: '3 / 2' }}>
          <clipPath id={`gb-s-${uid}`}>
            <path d="M0 0v30h60V0z" />
          </clipPath>
          <clipPath id={`gb-t-${uid}`}>
            <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
          </clipPath>
          <g clipPath={`url(#gb-s-${uid})`}>
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
            <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#gb-t-${uid})`} stroke="#C8102E" strokeWidth="4" />
            <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );
  }
}
