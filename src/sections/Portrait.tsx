import { Camera, Code2, GraduationCap } from 'lucide-react';
import { profile } from '../data/profile';

/** Viewfinder-style portrait frame. Set `profile.photo` to show a real photo. */
export function Portrait() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      {/* orbit rings */}
      <div aria-hidden className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-line/10" />
      <div aria-hidden className="absolute inset-[9%] rounded-full border border-line/[0.06]" />
      <div aria-hidden className="absolute inset-0 animate-spin-slow [animation-duration:22s]">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_rgb(var(--cyan))]" />
      </div>

      {/* frame */}
      <div className="absolute inset-[15%] overflow-hidden rounded-full bg-raised ring-1 ring-line/10">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.fullName}`}
            width={600}
            height={600}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="relative grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_25%,rgb(var(--accent)/.35),transparent_60%),radial-gradient(circle_at_75%_80%,rgb(var(--cyan)/.22),transparent_55%)]">
            <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
            <div className="relative text-center">
              <span className="block font-display text-[clamp(4rem,11vw,6.5rem)] font-bold leading-none tracking-[-0.06em] text-ink/90">
                AB
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                <Camera size={12} aria-hidden /> Photo placeholder
              </span>
            </div>
          </div>
        )}
      </div>

      {/* viewfinder corners */}
      <div aria-hidden className="pointer-events-none absolute inset-[11%]">
        {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(
          (c) => (
            <span key={c} className={`absolute h-6 w-6 border-accent/70 ${c}`} />
          ),
        )}
      </div>

      {/* floating chips */}
      <div className="glass absolute -left-2 top-[18%] flex animate-drift items-center gap-2.5 rounded-xl px-3 py-2 sm:-left-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
          <GraduationCap size={16} aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[12.5px] font-medium">CSE @ {profile.universityShort}</span>
          <span className="block font-mono text-[10px] text-faint">Undergraduate</span>
        </span>
      </div>

      <div className="glass absolute -right-1 bottom-[14%] animate-drift rounded-xl px-3.5 py-2.5 font-mono text-[11.5px] leading-relaxed [animation-delay:-3.5s] sm:-right-4">
        <span className="mb-1 flex items-center gap-1.5 text-faint">
          <Code2 size={12} aria-hidden /> stack.txt
        </span>
        <span className="text-cyan">C</span>
        <span className="text-faint"> · </span>
        <span className="text-accent">C++</span>
        <span className="text-faint"> · </span>
        <span className="text-ink">Python</span>
      </div>
    </div>
  );
}
