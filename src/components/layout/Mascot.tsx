import {
  animate,
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import {
  type Activity,
  type AnchorId,
  anchorXY,
  ANCHORS_BY_TIER,
  CHATTER,
  isTop,
  type Layout,
  measure,
  MOODS,
  PERSISTENT,
  type Pose,
  POSES,
  SECTION_IDS,
  sideOf,
} from './mascot/config';
import { MascotEffects } from './mascot/MascotEffects';
import { bodyRect, chooseAnchor, obstruction } from './mascot/placement';

type Keyframes = Parameters<ReturnType<typeof useAnimationControls>['start']>[0];

/** One-shot body reactions (all pivot from the feet). */
const REACT: Record<'hop' | 'bounce' | 'land' | 'celebrate' | 'hover', Keyframes> = {
  hop: { y: [0, -28, 0, -8, 0], scaleY: [1, 1.04, 0.94, 1.02, 1], transition: { duration: 0.8, ease: 'easeOut' } },
  bounce: { scaleY: [1, 0.93, 1.05, 0.98, 1], scaleX: [1, 1.05, 0.97, 1.01, 1], transition: { duration: 0.6 } },
  land: { scaleY: [1, 0.95, 1.02, 1], scaleX: [1, 1.04, 0.99, 1], transition: { duration: 0.45 } },
  celebrate: {
    y: [0, -34, 0, -18, 0, -6, 0],
    rotate: [0, -4, 0, 4, 0, 0, 0],
    transition: { duration: 1.3, ease: 'easeOut' },
  },
  hover: { rotate: [0, -4, 3, 0], scale: [1, 1.05, 1.05, 1], transition: { duration: 0.6 } },
};

/** Looping gait per activity (applied on its own layer so it never fights reactions). */
function gait(activity: Activity, facing: number): { animate: TargetAndTransition; transition: Transition } {
  switch (activity) {
    case 'walk':
      return {
        animate: { y: [0, -5, 0], rotate: [facing * 3 - 2, facing * 3 + 2, facing * 3 - 2] },
        transition: { y: { duration: 0.34, repeat: Infinity, ease: 'easeOut' }, rotate: { duration: 0.68, repeat: Infinity, ease: 'easeInOut' } },
      };
    case 'glide':
      return {
        animate: { y: [0, -16, -4], rotate: facing * 2 },
        transition: { duration: 0.9, ease: 'easeOut' },
      };
    case 'laptop':
      // tiny typing jiggle
      return {
        animate: { y: [0, -1.2, 0, -0.8, 0], rotate: 0 },
        transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.6 },
      };
    default:
      // gentle hover + sway
      return {
        animate: { y: [0, -5, 0], rotate: [0, 0.8, 0, -0.8, 0] },
        transition: { y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 7.2, repeat: Infinity, ease: 'easeInOut' } },
      };
  }
}

const STORAGE_KEY = 'bappy-mascot-hidden';
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const viewport = () => measure(document.documentElement.clientWidth, window.innerHeight);

export function Mascot() {
  const reduce = useReducedMotion() ?? false;
  const active = useActiveSection(SECTION_IDS);
  const rootRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [layout, setLayout] = useState<Layout>(viewport);
  const [anchor, setAnchor] = useState<AnchorId>('bottom-left');
  const [pose, setPose] = useState<Pose>('stand');
  const [activity, setActivity] = useState<Activity>('idle');
  const [facing, setFacing] = useState(0);
  const [bubble, setBubble] = useState<{ id: number; text: string } | null>(null);
  const [blink, setBlink] = useState(0);
  const [poke, setPoke] = useState(0);

  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const fade = useMotionValue(1);
  const head = useSpring(0, { stiffness: 90, damping: 14 });
  const reaction = useAnimationControls();

  // Follow the scroll: lag behind fast scrolling, lean into the direction of travel.
  const { scrollY } = useScroll();
  const smoothV = useSpring(useVelocity(scrollY), { stiffness: 60, damping: 22, mass: 0.6 });
  const lagY = useTransform(smoothV, [-3000, 0, 3000], [-22, 0, 22], { clamp: true });
  const lean = useTransform(smoothV, [-3000, 0, 3000], [-5, 0, 5], { clamp: true });

  // ── mutable behaviour state (kept in refs so timers never see stale values) ──
  const s = useRef({
    layout,
    anchor: null as AnchorId | null,
    pose: 'stand' as Pose,
    activity: 'idle' as Activity,
    section: null as string | null,
    pending: null as string | null,
    token: 0,
    busy: false,
    lastScroll: 0,
    lastMove: 0,
    lastScrollY: 0,
    dir: 1,
    needsSettle: false,
    nextMicro: 0,
    nextBlink: 0,
    nextChat: 0,
    lastBubble: 0,
    lastHover: 0,
    lastChatter: -1,
    bubbleId: 0,
    bubbleTimer: 0,
    hidden,
    reduce,
    memory: {} as Record<string, AnchorId>,
    seen: new Set<string>(),
    timers: new Set<number>(),
  }).current;
  s.hidden = hidden;
  s.reduce = reduce;

  const later = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = window.setTimeout(() => {
        s.timers.delete(t);
        resolve();
      }, ms);
      s.timers.add(t);
    });

  const setPoseS = (p: Pose) => {
    s.pose = p;
    setPose(p);
  };
  const setAct = (a: Activity) => {
    s.activity = a;
    setActivity(a);
  };
  const react = (k: keyof typeof REACT) => {
    if (!s.reduce && !s.hidden) reaction.start(REACT[k]);
  };

  const say = (text: string, ms = 4800) => {
    window.clearTimeout(s.bubbleTimer);
    s.bubbleId += 1;
    setBubble({ id: s.bubbleId, text });
    s.lastBubble = performance.now();
    s.bubbleTimer = window.setTimeout(() => setBubble(null), ms);
  };

  /** +1 = content is to the right of the mascot, -1 = to the left. */
  const contentDir = () => {
    const side = s.anchor ? sideOf(s.anchor) : 'left';
    return side === 'left' ? 1 : side === 'right' ? -1 : Math.random() < 0.5 ? -1 : 1;
  };

  /** Walk / glide (or fade, with reduced motion) to an anchor. Resolves false if interrupted. */
  const goTo = async (target: AnchorId, token: number) => {
    const L = s.layout;
    const p = anchorXY(target, L);
    const first = s.anchor === null;
    s.anchor = target;
    setAnchor(target);
    const dx = p.x - x.get();
    const dy = p.y - y.get();
    const dist = Math.hypot(dx, dy);

    if (first || dist < 6) {
      x.stop();
      y.stop();
      x.set(p.x);
      y.set(p.y);
      return true;
    }

    setBubble(null);
    if (s.reduce) {
      await animate(fade, 0, { duration: 0.2 });
      x.set(p.x);
      y.set(p.y);
      await animate(fade, 1, { duration: 0.25 });
      return token === s.token;
    }

    const horizontal = Math.abs(dx) > Math.abs(dy) * 0.6;
    setPoseS('stand');
    setFacing(Math.sign(dx));
    setAct(horizontal ? 'walk' : 'glide');
    head.set(Math.sign(dx) * 3);
    const d = clamp(dist / (L.tier === 'sm' ? 360 : 420), 0.8, 2.4);
    await Promise.all([
      animate(x, p.x, { type: 'spring', visualDuration: d, bounce: 0 }),
      animate(y, p.y, { type: 'spring', visualDuration: d, bounce: 0 }),
    ]);
    if (token !== s.token) return false;
    setFacing(0);
    head.set(0);
    setAct('idle');
    react('land');
    return true;
  };

  /** Section entrance: wave hello, then settle into that section's pose. */
  const perform = async (id: string, token: number) => {
    const mood = MOODS[id];
    if (!s.reduce && mood.act !== 'wave') {
      setPoseS('stand');
      setAct('wave');
      await later(1300);
      if (token !== s.token) return;
    }
    setPoseS(mood.pose);
    setAct(s.reduce ? 'idle' : mood.act);
    if (s.reduce) return;
    if (mood.act === 'celebrate') react('celebrate');
    if (mood.act === 'look') head.set(contentDir() * 4);
    if (!PERSISTENT.has(mood.act)) {
      await later(mood.act === 'wave' ? 1500 : mood.act === 'celebrate' ? 1900 : 2400);
      if (token !== s.token) return;
      head.set(0);
      setAct('idle');
    }
  };

  const relocate = async (id: string, reason: 'section' | 'settle') => {
    const token = ++s.token;
    s.busy = true;
    try {
      const mood = MOODS[id];
      const target = chooseAnchor({
        layout: s.layout,
        pose: mood.pose,
        prefer: mood.prefer,
        current: s.anchor,
        remembered: s.dir < 0 ? s.memory[id] : undefined,
        wantChange: reason === 'section',
        root: rootRef.current,
      });
      if (!(await goTo(target, token))) return;
      s.memory[id] = target;
      s.lastMove = performance.now();
      if (reason === 'section') {
        await later(260); // a small breath before acting
        if (token !== s.token) return;
        if (!s.seen.has(id)) {
          s.seen.add(id);
          say(mood.say);
        }
        await perform(id, token);
      } else {
        setPoseS(mood.pose);
        setAct(!s.reduce && PERSISTENT.has(mood.act) ? mood.act : 'idle');
      }
    } finally {
      if (token === s.token) s.busy = false;
    }
  };

  const micro = () => {
    const r = Math.random();
    if (r < 0.4) {
      // glance toward the page content
      head.set(contentDir() * 4);
      const t = window.setTimeout(() => head.set(0), 1900);
      s.timers.add(t);
    } else if (r < 0.58 && s.pose === 'stand') react('hop');
    else if (r < 0.85) react('bounce');
  };

  const tick = () => {
    if (s.hidden || document.hidden) return;
    const now = performance.now();
    const quiet = now - s.lastScroll > 420;

    if (s.pending && quiet && now - s.lastMove > 1600) {
      const id = s.pending;
      s.pending = null;
      if (id !== s.section) {
        s.section = id;
        s.needsSettle = false;
        void relocate(id, 'section');
        return;
      }
    }

    if (s.busy || !quiet) return;

    // Scrolled into a spot where we now cover something important? Step aside.
    if (s.needsSettle && s.anchor && s.section && now - s.lastMove > 2200) {
      s.needsSettle = false;
      if (obstruction(bodyRect(s.anchor, s.layout, s.pose), rootRef.current) >= 9) {
        void relocate(s.section, 'settle');
        return;
      }
    }

    if (s.reduce) return;

    if (now > s.nextBlink) {
      setBlink((b) => b + 1);
      s.nextBlink = now + (Math.random() < 0.2 ? 260 : rand(2600, 6000));
    }
    if (now > s.nextMicro) {
      if (now - s.lastMove > 3000) micro();
      s.nextMicro = now + rand(6500, 11000);
    }
    if (now > s.nextChat) {
      if (now - s.lastBubble > 20000) {
        let i = Math.floor(Math.random() * CHATTER.length);
        if (i === s.lastChatter) i = (i + 1) % CHATTER.length;
        s.lastChatter = i;
        say(CHATTER[i], 4200);
      }
      s.nextChat = now + rand(40000, 70000);
    }
  };

  // Remember which section the visitor is in; the scheduler acts when scrolling pauses.
  useEffect(() => {
    s.pending = active;
  }, [active, s]);

  // Scheduler, scroll + resize listeners.
  useEffect(() => {
    if (hidden) return;
    const now = performance.now();
    s.anchor = null; // snap into place on (re)appear
    s.section = null;
    s.pending = s.pending ?? active;
    s.lastMove = 0;
    s.lastScrollY = window.scrollY;
    s.nextBlink = now + 2000;
    s.nextMicro = now + 7000;
    s.nextChat = now + rand(35000, 55000);

    const onScroll = () => {
      const yy = window.scrollY;
      if (Math.abs(yy - s.lastScrollY) > 2) s.dir = yy > s.lastScrollY ? 1 : -1;
      s.lastScrollY = yy;
      s.lastScroll = performance.now();
      s.needsSettle = true;
    };
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const L = viewport();
        s.layout = L;
        setLayout(L);
        if (!s.anchor) return;
        if (!ANCHORS_BY_TIER[L.tier].includes(s.anchor)) {
          s.anchor = ANCHORS_BY_TIER[L.tier][0];
          setAnchor(s.anchor);
        }
        const p = anchorXY(s.anchor, L);
        x.stop();
        y.stop();
        x.set(p.x);
        y.set(p.y);
        s.needsSettle = true;
      });
    };

    const id = window.setInterval(tick, 300);
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      s.timers.forEach((t) => window.clearTimeout(t));
      s.timers.clear();
      s.token += 1; // cancel any running sequence
      s.busy = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  useEffect(() => () => window.clearTimeout(s.bubbleTimer), [s]);

  const onHover = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - s.lastHover < 1400 || s.activity === 'walk' || s.activity === 'glide') return;
    s.lastHover = now;
    setPoke((n) => n + 1);
    react('hover');
    const r = e.currentTarget.getBoundingClientRect();
    head.set(e.clientX < r.left + r.width / 2 ? -3 : 3);
    setBlink((b) => b + 1);
  };

  const onClick = () => {
    let i = (s.lastChatter + 1) % CHATTER.length;
    if (s.lastChatter < 0) i = Math.floor(Math.random() * CHATTER.length);
    s.lastChatter = i;
    say(CHATTER[i]);
    setPoke((n) => n + 1);
    if (s.activity !== 'walk' && s.activity !== 'glide') react(s.pose === 'stand' ? 'hop' : 'bounce');
  };

  const getCentre = useCallback(() => {
    const L = s.layout;
    return { x: x.get() + L.W / 2, y: y.get() + L.H / 2 };
  }, [s, x, y]);

  const dismiss = () => {
    setBubble(null);
    setHidden(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const restore = () => {
    setHidden(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  // ── render ──
  const { W, H, scale } = layout;
  const def = POSES[pose];
  const ph = Math.round(def.h * scale);
  const pw = Math.min(W, Math.round(ph * def.ar));
  const top = isTop(anchor);
  const side = sideOf(anchor);
  const g = reduce ? null : gait(activity, facing);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-40 overflow-hidden print:hidden">
      <AnimatePresence>
        {hidden && (
          <motion.button
            key="restore"
            type="button"
            onClick={restore}
            aria-label="Show Bappy mascot"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass pointer-events-auto absolute bottom-5 left-5 grid h-12 w-12 place-items-center overflow-hidden rounded-2xl transition hover:border-accent/60"
          >
            <img src={POSES.stand.src} alt="" className="mt-5 h-16 w-auto" draggable={false} />
          </motion.button>
        )}
      </AnimatePresence>

      {!hidden && (
        <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y, opacity: fade, width: W, height: H }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.4 }}
            className="group/m relative h-full w-full"
          >
            {/* Speech bubble */}
            <AnimatePresence>
              {bubble && (
                <motion.div
                  key={bubble.id}
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: top ? -8 : 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  style={{
                    ...(top ? { top: ph + 8 } : { bottom: ph + 8 }),
                    ...(side === 'left' ? { left: W * 0.3 } : side === 'right' ? { right: W * 0.3 } : { left: W / 2 - 100 }),
                    originX: side === 'right' ? 1 : side === 'left' ? 0 : 0.5,
                    originY: top ? 0 : 1,
                  }}
                  className={`glass pointer-events-auto absolute z-10 w-max max-w-[170px] rounded-2xl px-3.5 py-2.5 text-[12.5px] font-medium leading-snug text-ink shadow-[0_8px_30px_-10px_rgb(var(--accent)/0.5)] sm:max-w-[230px] sm:text-[13px] ${
                    side === 'center' ? 'max-w-[200px] text-center sm:max-w-[200px]' : ''
                  } ${side === 'right' ? (top ? 'rounded-tr-sm' : 'rounded-br-sm') : top ? 'rounded-tl-sm' : 'rounded-bl-sm'}`}
                >
                  {bubble.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ground shadow */}
            <motion.div
              aria-hidden
              className="absolute left-1/2 h-2.5 rounded-[50%] bg-accent/40 blur-md"
              style={{ width: pw * 0.75, marginLeft: -pw * 0.375, top: (top ? ph : H) - 6 }}
              animate={
                reduce
                  ? undefined
                  : activity === 'walk'
                    ? { scaleX: [1, 0.9, 1], opacity: 0.4 }
                    : { scaleX: [1, 0.82, 1], opacity: [0.45, 0.28, 0.45] }
              }
              transition={{ duration: activity === 'walk' ? 0.34 : 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Character */}
            <div
              className="absolute left-1/2"
              style={{ width: pw, height: ph, marginLeft: -pw / 2, ...(top ? { top: 0 } : { bottom: 0 }) }}
            >
              {/* scroll lag + lean */}
              <motion.div style={reduce ? undefined : { y: lagY, rotate: lean }} className="h-full w-full origin-bottom">
                {/* gait (walk / float / typing) */}
                <motion.div
                  animate={g?.animate}
                  transition={g?.transition}
                  className="h-full w-full origin-bottom"
                >
                  {/* one-shot reactions */}
                  <motion.div animate={reaction} className="h-full w-full origin-bottom">
                    {/* breathing */}
                    <motion.div
                      animate={reduce ? undefined : { scaleY: [1, 1.014, 1], scaleX: [1, 0.996, 1] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative h-full w-full origin-bottom"
                    >
                      <button
                        type="button"
                        onClick={onClick}
                        onPointerEnter={onHover}
                        onPointerLeave={() => head.set(0)}
                        aria-label="Bappy mascot — say hi"
                        className="pointer-events-auto absolute inset-0 block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        <AnimatePresence initial={false}>
                          <Sprite key={pose} pose={pose} head={head} blink={reduce ? 0 : blink} />
                        </AnimatePresence>
                      </button>
                      {!reduce && (
                        <MascotEffects
                          activity={activity}
                          pose={def}
                          pokeKey={poke}
                          getCentre={getCentre}
                          reach={Math.max(pw, ph) * 0.5 + 10}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <button
              type="button"
              onClick={dismiss}
              aria-label="Hide Bappy mascot"
              style={{ left: Math.max(0, (W - pw) / 2 - 6), top: top ? -4 : H - ph - 4 }}
              className="glass pointer-events-auto absolute z-10 grid h-6 w-6 place-items-center rounded-full text-muted opacity-0 transition hover:text-ink hover:opacity-100 focus-visible:opacity-100 group-hover/m:opacity-80 [@media(hover:none)]:opacity-70"
            >
              <X size={12} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/** The artwork itself, plus a head layer (subtle turns) and eyelids (blinks). */
function Sprite({ pose, head, blink }: { pose: Pose; head: MotionValue<number>; blink: number }) {
  const def = POSES[pose];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      style={{ originY: 1 }}
    >
      <img
        src={def.src}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_10px_18px_rgb(var(--accent)/0.28)]"
      />
      <motion.div className="absolute inset-0" style={def.head ? { rotate: head, transformOrigin: def.head.origin } : undefined}>
        {def.head && (
          <img
            src={def.src}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{ clipPath: def.head.clip }}
          />
        )}
        {blink > 0 &&
          def.eyes.map((e, i) => (
            <motion.span
              key={`${blink}-${i}`}
              className="absolute rounded-[50%]"
              style={{
                left: `${e.x - e.w / 2}%`,
                top: `${e.y - e.w * def.ar * 0.32}%`,
                width: `${e.w}%`,
                height: `${e.w * def.ar * 0.62}%`,
                background: e.c,
                boxShadow: `inset 0 -1px 0 rgb(30 15 10 / .55)`,
                filter: 'blur(0.3px)',
                originY: 0,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 0.18, times: [0, 0.35, 0.6, 1] }}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}
