import { socials } from '../../data/profile';
import type { SocialKey } from '../../data/types';
import { SocialIcon } from '../icons/BrandIcons';

interface Props {
  include?: SocialKey[];
  size?: 'sm' | 'md';
}

/** Renders social icons. Links without a URL are shown dimmed with a "coming soon" tooltip. */
export function SocialLinks({ include = ['github', 'linkedin', 'facebook', 'instagram', 'snapchat', 'email'], size = 'md' }: Props) {
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  return (
    <ul className="flex flex-wrap items-center gap-2.5">
      {socials
        .filter((s) => include.includes(s.key))
        .map((s) => {
          const ready = Boolean(s.href);
          const cls = `${dim} grid place-items-center rounded-xl border border-line/10 bg-surface/50 transition-all duration-300`;
          return (
            <li key={s.key}>
              {ready ? (
                <a
                  href={s.href}
                  target={s.key === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`${cls} text-muted hover:-translate-y-0.5 hover:border-accent/60 hover:text-ink`}
                >
                  <SocialIcon name={s.key} size={size === 'sm' ? 16 : 18} />
                </a>
              ) : (
                <span
                  role="img"
                  aria-label={`${s.label} — link coming soon`}
                  title={`${s.label} — coming soon`}
                  className={`${cls} cursor-not-allowed border-dashed text-faint`}
                >
                  <SocialIcon name={s.key} size={size === 'sm' ? 16 : 18} />
                </span>
              )}
            </li>
          );
        })}
    </ul>
  );
}
