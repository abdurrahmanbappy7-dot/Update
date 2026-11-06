/**
 * Static configuration for the Bappy mascot: sprites, per-section behaviour,
 * screen anchors and speech lines.
 */

export type Pose = 'stand' | 'laptop' | 'sit' | 'gaming' | 'study' | 'campus' | 'music' | 'chill' | 'dream';

/** What the character is doing right now. Drives body motion + effect overlays. */
export type Activity =
  | 'idle'
  | 'walk' // moving sideways between anchors
  | 'glide' // mostly vertical move — a floaty hop
  | 'wave'
  | 'think'
  | 'laptop'
  | 'celebrate'
  | 'point'
  | 'look';

/** Activities that keep going while the visitor stays in the section. */
export const PERSISTENT: ReadonlySet<Activity> = new Set(['think', 'laptop', 'point']);

export type AnchorId =
  | 'top-left'
  | 'top-right'
  | 'left-mid'
  | 'right-mid'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';

interface Eye {
  /** centre, in % of the sprite box */
  x: number;
  y: number;
  /** width in % of sprite width */
  w: number;
  /** eyelid tone sampled from the artwork */
  c: string;
}

export interface PoseDef {
  src: string;
  /** width / height of the artwork */
  ar: number;
  /** rendered height on desktop (px) — scaled down on smaller screens */
  h: number;
  /** Head layer: clip region of the artwork + neck pivot, for subtle head turns. */
  head: { clip: string; origin: string } | null;
  eyes: Eye[];
  /** Where the hand / laptop / face sits (in %) — used to anchor effect overlays. */
  spots: { head: [number, number]; hand: [number, number] };
}

export const POSES: Record<Pose, PoseDef> = {
  stand: {
    src: '/mascot/bappy-stand.webp',
    ar: 199 / 560,
    h: 345,
    head: { clip: 'inset(0 6% 83.4% 40%)', origin: '68% 16.4%' },
    eyes: [
      { x: 62.3, y: 8.9, w: 6.6, c: '#a06a54' },
      { x: 73.4, y: 9.8, w: 6.2, c: '#7f5040' },
    ],
    spots: { head: [70, 6], hand: [80, 46] },
  },
  laptop: {
    src: '/mascot/bappy-think.webp',
    ar: 575 / 560,
    h: 245,
    head: null, // hand rests on the chin — keep the head locked to it
    eyes: [
      { x: 45.9, y: 27.0, w: 4.4, c: '#95614e' },
      { x: 55.8, y: 29.5, w: 4.0, c: '#7a4c3c' },
    ],
    spots: { head: [52, 12], hand: [62, 78] },
  },
  sit: {
    src: '/mascot/bappy-sit.webp',
    ar: 498 / 560,
    h: 255,
    head: { clip: 'inset(0 18% 57% 38.5%)', origin: '53% 43%' },
    eyes: [
      { x: 52.6, y: 23.9, w: 5.2, c: '#9b654e' },
      { x: 63.5, y: 27.5, w: 4.8, c: '#7a4c3c' },
    ],
    spots: { head: [58, 10], hand: [30, 40] },
  },
  // Activity poses (from the six activity references). No eyelid/head layers — the artwork stays untouched.
  gaming: { src: '/mascot/bappy-gaming.webp', ar: 402 / 560, h: 250, head: null, eyes: [], spots: { head: [52, 8], hand: [55, 45] } },
  study: { src: '/mascot/bappy-study.webp', ar: 429 / 560, h: 250, head: null, eyes: [], spots: { head: [48, 8], hand: [70, 55] } },
  campus: { src: '/mascot/bappy-campus.webp', ar: 298 / 560, h: 330, head: null, eyes: [], spots: { head: [55, 6], hand: [40, 38] } },
  music: { src: '/mascot/bappy-music.webp', ar: 416 / 560, h: 250, head: null, eyes: [], spots: { head: [45, 8], hand: [72, 25] } },
  chill: { src: '/mascot/bappy-chill.webp', ar: 436 / 560, h: 250, head: null, eyes: [], spots: { head: [42, 8], hand: [55, 60] } },
  dream: { src: '/mascot/bappy-dream.webp', ar: 435 / 560, h: 250, head: null, eyes: [], spots: { head: [48, 8], hand: [50, 50] } },
};

export interface Mood {
  pose: Pose;
  act: Activity;
  /** Line shown the first time the visitor reaches this section. */
  say: string;
  /** Preferred anchors, best first. The placement engine still avoids content. */
  prefer: AnchorId[];
}

/** Section-by-section behaviour — alternates sides so it feels like a journey. */
export const MOODS: Record<string, Mood> = {
  home: { pose: 'stand', act: 'wave', say: "Hey! I'm Bappy 👋 Welcome to my digital space!", prefer: ['right-mid', 'bottom-right', 'top-right', 'bottom-left'] },
  about: { pose: 'dream', act: 'think', say: 'A little about me — code, create, innovate.', prefer: ['left-mid', 'bottom-left', 'top-left'] },
  education: { pose: 'campus', act: 'look', say: 'CSE at ULAB — always learning something new.', prefer: ['right-mid', 'top-right', 'bottom-right'] },
  skills: { pose: 'laptop', act: 'laptop', say: 'React, Python, C, C++… my toolbox 🧰', prefer: ['bottom-left', 'left-mid', 'bottom-center'] },
  projects: { pose: 'laptop', act: 'laptop', say: 'Check these out — I built them!', prefer: ['bottom-right', 'right-mid', 'top-right'] },
  experience: { pose: 'study', act: 'celebrate', say: 'Learn. Build. Grow. ✅', prefer: ['top-left', 'left-mid', 'bottom-left'] },
  leadership: { pose: 'music', act: 'wave', say: 'Teamwork makes the dream work.', prefer: ['right-mid', 'top-right', 'bottom-right'] },
  photography: { pose: 'chill', act: 'look', say: 'I love capturing moments too 📸', prefer: ['bottom-center', 'bottom-left', 'left-mid'] },
  achievements: { pose: 'gaming', act: 'celebrate', say: 'Some wins I’m proud of 👑', prefer: ['top-right', 'right-mid', 'bottom-right'] },
  contact: { pose: 'sit', act: 'point', say: "Let's build something together — say hi!", prefer: ['bottom-left', 'left-mid', 'bottom-right'] },
};

export const SECTION_IDS = Object.keys(MOODS);

/** Lines for clicks and the occasional unprompted bubble. */
export const CHATTER = [
  'Hey! Still exploring? 👋',
  'Let’s build something awesome!',
  'Curious about my projects?',
  'Thanks for visiting my portfolio!',
];

export type Tier = 'sm' | 'md' | 'lg';

export interface Layout {
  vw: number;
  vh: number;
  tier: Tier;
  scale: number;
  /** fixed box the character lives in */
  W: number;
  H: number;
}

export const SCALE: Record<Tier, number> = { sm: 0.6, md: 0.85, lg: 1 };

/** Unscaled size of the box the character lives in (fits every pose). */
const BOX_W = 255;
const BOX_H = 345;
/** Space kept above the character's head for the speech bubble. */
const BUBBLE_ROOM = 80;

export const ANCHORS_BY_TIER: Record<Tier, AnchorId[]> = {
  // On smartphones the mascot always stays on the LEFT side of the screen.
  sm: ['bottom-left'],
  md: ['bottom-left', 'bottom-right', 'left-mid', 'right-mid', 'top-left', 'top-right'],
  lg: ['bottom-left', 'bottom-right', 'left-mid', 'right-mid', 'top-left', 'top-right', 'bottom-center'],
};

export function measure(vw: number, vh: number): Layout {
  const tier: Tier = vw < 640 ? 'sm' : vw < 1024 ? 'md' : 'lg';
  const nav = tier === 'sm' ? 76 : 88;
  const m = tier === 'sm' ? 6 : 16;
  // Shrink on short / narrow windows so the character (and its bubble) always fit on screen.
  const fit = Math.min((vh - nav - m - BUBBLE_ROOM) / BOX_H, (vw - 2 * m) / BOX_W);
  const scale = Math.max(0.3, Math.min(SCALE[tier], fit));
  return { vw, vh, tier, scale, W: Math.round(BOX_W * scale), H: Math.round(BOX_H * scale) };
}

export const isTop = (a: AnchorId) => a.startsWith('top');
export const sideOf = (a: AnchorId): 'left' | 'right' | 'center' =>
  a.endsWith('left') ? 'left' : a.endsWith('right') ? 'right' : 'center';

/** Top-left corner of the mascot box for an anchor. */
export function anchorXY(a: AnchorId, L: Layout): { x: number; y: number } {
  const { vw, vh, W, H, tier } = L;
  const m = tier === 'sm' ? 6 : 16;
  const nav = tier === 'sm' ? 76 : 88;
  // Content lives in a 1200px column with 20/32px padding. Use the gutter when it fits.
  const contentLeft = Math.max(0, (vw - 1200) / 2) + (vw >= 640 ? 32 : 20);
  const gutter = contentLeft >= W + 8;
  const leftX = gutter ? Math.max(m, (contentLeft - W) / 2) : m;
  const rightX = vw - W - leftX;
  // Keep clear of the back-to-top button in the bottom-right corner.
  const backToTop = tier === 'sm' ? 74 : 92;
  const brX = Math.min(rightX, vw - W - backToTop);

  const midY = Math.max(nav, (vh - H) / 2);
  const bottomY = vh - H - (tier === 'sm' ? 4 : m);
  const topY = nav;

  let p: { x: number; y: number };
  switch (a) {
    case 'top-left': p = { x: leftX, y: topY }; break;
    case 'top-right': p = { x: rightX, y: topY }; break;
    case 'left-mid': p = { x: leftX, y: midY }; break;
    case 'right-mid': p = { x: rightX, y: midY }; break;
    case 'bottom-left': p = { x: leftX, y: bottomY }; break;
    case 'bottom-right': p = { x: brX, y: bottomY }; break;
    case 'bottom-center': p = { x: (vw - W) / 2, y: bottomY + 6 }; break;
  }
  // Never leave the viewport.
  return { x: Math.round(Math.min(Math.max(p.x, 0), vw - W)), y: Math.round(Math.min(Math.max(p.y, 0), vh - H)) };
}
