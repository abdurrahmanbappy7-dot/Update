import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Activity, PoseDef } from './config';

const CONFETTI = ['rgb(var(--accent))', 'rgb(var(--cyan))', 'rgb(var(--ok))', '#ffc857', '#ff6b9a'];
const GLYPHS = ['</>', '{ }', '( )', ';', '=>', '#'];

interface Props {
  activity: Activity;
  pose: PoseDef;
  /** Bumps every time a hover / click reaction plays. */
  pokeKey: number;
  /** Centre of the mascot box in viewport coords (for aiming the contact arrow). */
  getCentre: () => { x: number; y: number };
  /** Distance (px) from the body centre at which the contact arrow floats. */
  reach: number;
}

/** Decorative overlays (emoji, thought dots, code glyphs, confetti…). Purely visual. */
export function MascotEffects({ activity, pose, pokeKey, getCentre, reach }: Props) {
  const [hx, hy] = pose.spots.head;
  const [kx, ky] = pose.spots.hand;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
      <AnimatePresence>
        {activity === 'wave' && (
          <motion.span
            key="wave"
            className="absolute text-[22px] sm:text-[26px]"
            style={{ left: `${Math.min(hx + 22, 92)}%`, top: `${hy}%`, originX: 0.7, originY: 0.9 }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 22, -8, 22, -8, 14, 0] }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ rotate: { duration: 1.3, ease: 'easeInOut' }, default: { duration: 0.25 } }}
          >
            👋
          </motion.span>
        )}

        {activity === 'think' && (
          <motion.div key="think" className="absolute" style={{ left: `${hx + 18}%`, top: `${hy - 4}%` }} exit={{ opacity: 0 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-line/20 bg-surface/80 backdrop-blur"
                style={{ width: 5 + i * 4, height: 5 + i * 4, left: i * 9, top: -i * 11 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8] }}
                transition={{ duration: 3.2, delay: i * 0.35, repeat: Infinity, repeatDelay: 2.4, times: [0, 0.15, 0.8, 1] }}
              />
            ))}
            <motion.span
              className="absolute text-[18px]"
              style={{ left: 22, top: -46 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.15, 1, 0.9], y: [6, 0, -2, -6] }}
              transition={{ duration: 2.2, delay: 1.2, repeat: Infinity, repeatDelay: 3.4 }}
            >
              💡
            </motion.span>
          </motion.div>
        )}

        {activity === 'laptop' && (
          <motion.div key="laptop" className="absolute inset-0" exit={{ opacity: 0 }}>
            {/* screen glow */}
            <motion.span
              className="absolute h-1/3 w-1/2 rounded-full bg-accent/40 blur-xl"
              style={{ left: '38%', top: '62%' }}
              animate={{ opacity: [0.25, 0.55, 0.3, 0.5, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {GLYPHS.map((g, i) => (
              <motion.span
                key={g}
                className="absolute font-mono text-[11px] font-semibold text-cyan sm:text-[12px]"
                style={{ left: `${kx - 10 + ((i * 17) % 34)}%`, top: `${ky - 18}%` }}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, -46] }}
                transition={{ duration: 2.4, delay: i * 0.9, repeat: Infinity, repeatDelay: 4.6, ease: 'easeOut' }}
              >
                {g}
              </motion.span>
            ))}
          </motion.div>
        )}

        {activity === 'celebrate' && (
          <motion.div key="celebrate" className="absolute inset-0" exit={{ opacity: 0 }}>
            <motion.span
              className="absolute text-[24px] sm:text-[28px]"
              style={{ left: `${Math.min(hx + 20, 90)}%`, top: `${hy + 4}%` }}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: [0, 1.3, 1], rotate: [-30, 10, 0] }}
              transition={{ duration: 0.6, ease: 'backOut' }}
            >
              👍
            </motion.span>
            {Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2;
              const r = 46 + (i % 3) * 16;
              return (
                <motion.span
                  key={i}
                  className="absolute h-2 w-1 rounded-sm"
                  style={{ left: `${hx}%`, top: `${hy + 6}%`, background: CONFETTI[i % CONFETTI.length] }}
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  animate={{ opacity: [1, 1, 0], x: Math.cos(a) * r, y: [0, Math.sin(a) * r - 10, Math.sin(a) * r + 30], rotate: 360 + i * 40 }}
                  transition={{ duration: 1.4, ease: 'easeOut', delay: 0.15 }}
                />
              );
            })}
          </motion.div>
        )}

        {activity === 'point' && <PointArrow key="point" getCentre={getCentre} reach={reach} />}
      </AnimatePresence>

      {/* Hover / click sparkle */}
      <AnimatePresence>
        {pokeKey > 0 && (
          <motion.span
            key={pokeKey}
            className="absolute text-[16px]"
            style={{ left: `${Math.max(hx - 30, 0)}%`, top: `${hy}%` }}
            initial={{ opacity: 0, scale: 0.3, y: 4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.1, 0.9], y: -18 }}
            transition={{ duration: 0.9 }}
          >
            ✨
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A small arrow chip that keeps aiming at the contact form. */
function PointArrow({ getCentre, reach }: { getCentre: () => { x: number; y: number }; reach: number }) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let raf = 0;
    const aim = () => {
      raf = 0;
      const target = document.querySelector('#contact form') ?? document.getElementById('contact');
      if (!target) return;
      const r = target.getBoundingClientRect();
      const c = getCentre();
      setAngle((Math.atan2(r.top + r.height / 2 - c.y, r.left + r.width / 2 - c.x) * 180) / Math.PI);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(aim);
    };
    aim();
    // the mascot may still be settling into place
    const t = window.setTimeout(aim, 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [getCentre]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, rotate: angle }}
      exit={{ opacity: 0 }}
      transition={{ rotate: { type: 'spring', stiffness: 120, damping: 18 } }}
    >
      <motion.span
        className="glass absolute -mt-3.5 grid h-7 w-7 place-items-center rounded-full text-accent shadow-[0_6px_20px_-6px_rgb(var(--accent)/0.6)]"
        style={{ left: reach }}
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowRight size={14} />
      </motion.span>
    </motion.div>
  );
}
