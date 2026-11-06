import { type AnchorId, type Layout, ANCHORS_BY_TIER, anchorXY, isTop, POSES, type Pose } from './config';

/** How much each kind of page element "hurts" if the mascot sits on top of it. */
const WEIGHTS: [string, number][] = [
  ['a,button,input,textarea,select,label,[role="button"],header,nav,form', 6],
  ['h1,h2,h3,h4,p,li,blockquote,figcaption,dt,dd,span', 3],
  ['img,video,picture,figure,canvas,.card', 2],
];

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Rectangle the character's body actually occupies at an anchor. */
export function bodyRect(a: AnchorId, L: Layout, pose: Pose): Rect {
  const { x, y } = anchorXY(a, L);
  const h = POSES[pose].h * L.scale;
  const w = Math.min(L.W, h * POSES[pose].ar);
  return { x: x + (L.W - w) / 2, y: isTop(a) ? y : y + L.H - h, w, h };
}

/**
 * Samples a grid of points inside the rect and scores what is underneath.
 * Lower is better; 0 means empty space.
 */
export function obstruction(r: Rect, root: HTMLElement | null): number {
  let score = 0;
  const N = 4;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const px = r.x + r.w * (0.12 + (0.76 * i) / (N - 1));
      const py = r.y + r.h * (0.12 + (0.76 * j) / (N - 1));
      const el = document
        .elementsFromPoint(px, py)
        .find((e) => !(root && root.contains(e)) && e !== document.documentElement && e !== document.body);
      if (!el) continue;
      for (const [sel, w] of WEIGHTS) {
        if (el.closest(sel)) {
          score += w;
          break;
        }
      }
    }
  }
  return score;
}

interface ChooseOpts {
  layout: Layout;
  pose: Pose;
  prefer: AnchorId[];
  current: AnchorId | null;
  remembered?: AnchorId;
  /** true when a new section was entered — favour moving somewhere new */
  wantChange: boolean;
  root: HTMLElement | null;
}

/** Picks the most suitable anchor: preferred, clear of content, not jittery. */
export function chooseAnchor({ layout, pose, prefer, current, remembered, wantChange, root }: ChooseOpts) {
  const allowed = ANCHORS_BY_TIER[layout.tier];
  const list = [...new Set([remembered, ...prefer, ...allowed])].filter(
    (a): a is AnchorId => !!a && allowed.includes(a),
  );
  let best: AnchorId = list[0];
  let bestCost = Infinity;
  list.forEach((a, i) => {
    let cost = obstruction(bodyRect(a, layout, pose), root) + i * 0.6;
    if (a === remembered) cost -= 1.5;
    if (a === current) cost += wantChange && layout.tier !== 'sm' ? 3 : -2;
    if (cost < bestCost) {
      bestCost = cost;
      best = a;
    }
  });
  return best;
}
