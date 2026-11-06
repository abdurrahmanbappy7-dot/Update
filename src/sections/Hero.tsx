import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, FileDown, MapPin, Send } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { profile } from '../data/profile';
import { ButtonLink } from '../components/ui/Button';
import { SocialLinks } from '../components/ui/SocialLinks';
import { Portrait } from './Portrait';

const ease = [0.22, 1, 0.36, 1] as const;

function RotatingIdentity() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % profile.identities.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <span className="relative inline-flex h-6 overflow-hidden align-bottom" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="text-ink"
        >
          {profile.identities[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgb(var(--accent) / 0.09), transparent 70%)`;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const line = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      id="home"
      onMouseMove={onMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 md:pt-36"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="absolute -top-40 right-[-10%] h-[560px] w-[560px] animate-drift rounded-full bg-accent/[0.13] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] animate-drift rounded-full bg-cyan/[0.08] blur-[120px] [animation-delay:-3s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="shell grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.div {...line(0.05)} className="mb-8 flex flex-wrap items-center gap-3">
            <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[12.5px]">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ok" />
              {profile.availability}
            </span>
            <a
              href="#travel"
              className="glass inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-[12.5px] font-medium text-emerald-400 transition hover:border-emerald-500 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              <span>🇧🇩</span>
              <span>Travel Map: 33/64 Districts</span>
              <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">52%</span>
            </a>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-faint">
              <MapPin size={13} aria-hidden /> {profile.location}
            </span>
          </motion.div>

          <h1>
            <motion.span {...line(0.15)} className="block font-display text-[clamp(1.4rem,3vw,2rem)] font-medium tracking-[-0.02em] text-muted">
              Hi, I’m <span className="text-ink">Bappy</span>.
            </motion.span>
            <motion.span
              {...line(0.28)}
              className="mt-3 block font-display text-[clamp(2.9rem,8vw,6.2rem)] font-bold leading-[0.95] tracking-[-0.045em]"
            >
              Building Ideas Into <span className="text-gradient">Digital Experiences.</span>
            </motion.span>
          </h1>

          <motion.p {...line(0.42)} className="mt-8 max-w-xl text-[16.5px] leading-relaxed text-muted">
            I’m a Computer Science and Engineering student at the University of Liberal Arts Bangladesh, passionate about
            programming, technology, and building meaningful digital experiences.
          </motion.p>

          <motion.p {...line(0.5)} className="mt-5 font-mono text-[13px] text-faint">
            <span className="text-cyan">~/</span>bappy <span className="text-accent">❯</span> <RotatingIdentity />
          </motion.p>

          <motion.div {...line(0.6)} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#projects">
              View Projects
              <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:rotate-[-45deg]" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#travel" variant="secondary" className="border-emerald-500/40 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10">
              <span className="inline-block" role="img" aria-label="Bangladesh flag">🇧🇩</span> Travel Map (33/64)
            </ButtonLink>
            <ButtonLink href={profile.resume} download={profile.resumeFileName} variant="secondary">
              <FileDown size={16} aria-hidden /> Download Resume
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">
              <Send size={15} aria-hidden /> Contact Me
            </ButtonLink>
          </motion.div>

          <motion.div {...line(0.7)} className="mt-10 flex items-center gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Find me</span>
            <span className="h-px w-10 bg-line/15" aria-hidden />
            <SocialLinks include={['linkedin', 'github', 'facebook', 'instagram']} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease }}
          className="lg:col-span-5"
        >
          <Portrait />
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-faint transition hover:text-ink md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-cyan"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </a>
    </section>
  );
}
