/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        raised: v('raised'),
        line: v('line'),
        ink: v('ink'),
        muted: v('muted'),
        faint: v('faint'),
        accent: v('accent'),
        cyan: v('cyan'),
        ok: v('ok'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'ui-serif', 'serif'],
      },
      maxWidth: { shell: '1200px' },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        pulseDot: {
          '0%,100%': { boxShadow: '0 0 0 0 rgb(var(--ok) / .55)' },
          '50%': { boxShadow: '0 0 0 6px rgb(var(--ok) / 0)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 40s linear infinite',
        'pulse-dot': 'pulseDot 2.2s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
