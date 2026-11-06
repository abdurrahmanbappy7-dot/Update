import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { GithubIcon } from '../components/icons/BrandIcons';
import { PlaceholderTag } from '../components/ui/Placeholder';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { projects } from '../data/projects';
import type { Project } from '../data/types';

/** Generated cover used when a project has no thumbnail yet. */
function GeneratedCover({ seed }: { seed: number }) {
  const widths = [[62, 38, 80, 24, 54], [44, 70, 30, 58, 36], [76, 28, 50, 66, 20]][seed % 3];
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_80%_10%,rgb(var(--accent)/.28),transparent_55%),radial-gradient(circle_at_10%_100%,rgb(var(--cyan)/.16),transparent_50%)]">
      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute inset-x-6 top-6 flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-line/20" />
        <span className="h-2 w-2 rounded-full bg-line/20" />
        <span className="h-2 w-2 rounded-full bg-line/20" />
      </div>
      <div className="absolute inset-x-6 bottom-6 space-y-2.5" aria-hidden>
        {widths.map((w, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full ${i === 1 ? 'bg-accent/60' : i === 3 ? 'bg-cyan/50' : 'bg-line/15'}`}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <FolderGit2 className="absolute right-6 top-5 text-line/25" size={22} aria-hidden />
    </div>
  );
}

function LinkBtn({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const cls = 'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] transition';
  if (!href)
    return (
      <span className={`${cls} cursor-not-allowed border-dashed border-line/15 text-faint`} title={`${label} — add a link`}>
        {children}
      </span>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} border-line/10 text-muted hover:border-accent/50 hover:text-ink`}>
      {children}
    </a>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(400px circle at ${gx}% ${gy}%, rgb(var(--accent) / 0.14), transparent 60%)`;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 6);
    rx.set(-(py - 0.5) * 6);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Reveal delay={index * 0.08} className={index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''}>
      <motion.article
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="card group flex h-full flex-col overflow-hidden transition-colors duration-300 hover:border-accent/30"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
        <div className={`relative overflow-hidden border-b hairline ${index === 0 ? 'aspect-[16/10] lg:aspect-auto lg:flex-1' : 'aspect-[16/9]'}`}>
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={`${project.title} preview`}
                loading="lazy"
                decoding="async"
                width={1280}
                height={800}
                className="h-full w-full object-cover"
              />
            ) : (
              <GeneratedCover seed={index} />
            )}
          </div>
        </div>

        <div className="relative z-20 flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, '0')}</span>
            {project.placeholder && <PlaceholderTag />}
          </div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">{project.title}</h3>
          <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{project.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
            {project.tech.map((t) => (
              <li key={t} className="rounded-md bg-accent/10 px-2 py-1 font-mono text-[11.5px] text-accent">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-2">
            <LinkBtn href={project.github} label="Source code">
              <GithubIcon size={14} /> Code
            </LinkBtn>
            <LinkBtn href={project.live} label="Live demo">
              <ArrowUpRight size={14} aria-hidden /> Live demo
            </LinkBtn>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Projects"
          title={
            <>
              Selected work, <span className="text-muted">in progress.</span>
            </>
          }
          intro="This space is reserved for the projects I’m building as I learn. Each card will link to its source code and a live demo once it’s ready."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr]">
          {projects.map((p, i) => (
            <ProjectCard key={`${p.title}-${i}`} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
