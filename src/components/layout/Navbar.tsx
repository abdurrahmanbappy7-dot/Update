import { AnimatePresence, motion } from 'framer-motion';
import { FileDown, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks, profile } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import type { Theme } from '../../hooks/useTheme';

const ids = navLinks.map((l) => l.id);

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: Props) {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div
        className={`transition-all duration-500 ${
          scrolled ? 'glass border-x-0 border-t-0 py-3' : 'border-b border-transparent py-5'
        }`}
      >
        <nav className="shell flex items-center justify-between" aria-label="Primary">
          <a href="#home" className="group flex items-center gap-2.5" aria-label={`${profile.displayName} — back to top`}>
            <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-[13px] font-medium text-accent transition-transform duration-500 group-hover:rotate-[8deg]">
              B
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="font-display text-[17px] font-bold tracking-[0.18em]">{profile.displayName}</span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-line/[0.07] bg-surface/40 p-1 backdrop-blur md:flex">
            {navLinks.map((l) => (
              <li key={l.id} className="relative">
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13.5px] transition-colors ${
                    active === l.id ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {l.label}
                  {l.id === 'travel' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88] shadow-[0_0_6px_#00FF88]" />
                  )}
                </a>
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-raised ring-1 ring-line/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line/10 text-muted transition hover:border-accent/50 hover:text-ink"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <a
              href={profile.resume}
              download={profile.resumeFileName}
              className="hidden items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-bg transition hover:-translate-y-0.5 sm:inline-flex"
            >
              <FileDown size={15} aria-hidden /> Resume
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line/10 md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass fixed inset-x-3 top-[76px] rounded-2xl p-3 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] ${
                      active === l.id ? 'bg-raised text-ink' : 'text-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {l.label}
                      {l.id === 'travel' && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-[#00FF88]">
                          33/64 🇧🇩
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={profile.resume}
              download={profile.resumeFileName}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-medium text-white"
            >
              <FileDown size={16} aria-hidden /> Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
