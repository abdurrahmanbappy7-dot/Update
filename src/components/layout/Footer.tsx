import { navLinks, profile } from '../../data/profile';
import { SocialLinks } from '../ui/SocialLinks';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t hairline bg-surface/30">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-[clamp(3rem,9vw,6rem)] font-bold leading-none tracking-[-0.04em] text-ink/90">
            {profile.displayName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-5 max-w-sm text-[15px] text-muted">
            CSE undergraduate at {profile.universityShort}, learning in public and looking for the next opportunity to grow.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-5 text-faint">Navigate</p>
          <ul className="grid grid-cols-2 gap-y-2.5 text-[15px] md:grid-cols-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-muted transition hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="eyebrow mb-5 text-faint">Connect</p>
          <a href={`mailto:${profile.email}`} className="break-all text-[15px] text-ink underline decoration-line/20 underline-offset-4 transition hover:decoration-accent">
            {profile.email}
          </a>
          <a href={profile.phoneHref} className="mt-2 block text-[15px] text-muted transition hover:text-ink">
            {profile.phone}
          </a>
          <div className="mt-6">
            <SocialLinks size="sm" />
          </div>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="shell flex flex-col gap-2 py-6 font-mono text-[12px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>Designed &amp; Built by Bappy.</p>
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
