import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Flag } from '../components/icons/Flags';
import { cricket, football, formula1, sportsIntro } from '../data/sports';
import type { FavouritePlayer, FavouriteTeam, SportImage } from '../data/sports';

const hoverCard =
  'group transition duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_60px_-30px_rgb(var(--accent)/0.45)]';

/** Shows an uploaded image whole, at its original aspect ratio — never cropped or stretched. */
function Photo({ img, className = '' }: { img: SportImage; className?: string }) {
  return (
    <img
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  );
}

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-line/10 px-3 py-1 font-mono text-[11px] text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}

function SubHeader({
  n,
  emoji,
  title,
  tagline,
  id,
}: {
  n: string;
  emoji: string;
  title: string;
  tagline: string;
  id: string;
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end gap-x-5 gap-y-2 md:mb-10">
      <span className="font-mono text-[11px] tracking-[0.2em] text-faint">{n}</span>
      <h3
        id={id}
        className="font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold leading-none tracking-[-0.03em]"
      >
        <span aria-hidden className="mr-3 inline-block transition-transform duration-500 hover:rotate-12">
          {emoji}
        </span>
        {title}
      </h3>
      <span className="font-serif text-lg italic text-muted">{tagline}</span>
      <span aria-hidden className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-line/10 to-transparent sm:block" />
    </Reveal>
  );
}

function PlayerCard({ p, className = '', delay = 0 }: { p: FavouritePlayer; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <article className={`card h-full overflow-hidden ${hoverCard}`}>
        <div className="relative bg-raised">
          <Photo img={p.photo} className="transition duration-700 group-hover:brightness-110" />
          <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white backdrop-blur">
            {p.role}
          </span>
        </div>
        <div className="p-6 md:p-7">
          <p className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[-0.02em]">
            {p.name}
            <Flag code={p.country} className="h-4" />
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{p.description}</p>
          <Tags tags={p.tags} />
        </div>
      </article>
    </Reveal>
  );
}

function TeamCard({
  t,
  size = 'md',
  layout = 'row',
  className = '',
  delay = 0,
  center = false,
}: {
  t: FavouriteTeam;
  center?: boolean;
  size?: 'md' | 'lg';
  layout?: 'row' | 'stack';
  className?: string;
  delay?: number;
}) {
  const tile = center ? 'w-40 sm:w-52 lg:w-64' : size === 'lg' ? 'w-28 sm:w-36 md:w-44' : 'w-24 sm:w-28';
  return (
    <Reveal delay={delay} className={className}>
      <article
        className={`card h-full p-6 md:p-7 ${hoverCard} ${
          layout === 'row' ? 'flex flex-col gap-6 sm:flex-row sm:items-center' : 'flex flex-col gap-6'
        } ${center ? 'items-center justify-center text-center' : ''}`}
      >
        <div
          className={`${tile} shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line/10 transition duration-500 group-hover:scale-[1.04] group-hover:ring-accent/40`}
        >
          <Photo img={t.logo} />
        </div>
        <div className="min-w-0">
          <p className="eyebrow mb-2.5">{t.role}</p>
          <p
            className={`flex items-center gap-3 font-display text-xl font-semibold tracking-[-0.02em] md:text-[1.4rem] ${center ? 'justify-center md:text-[1.75rem]' : ''}`}
          >
            {t.name}
            <Flag code={t.country} className="h-3.5" />
          </p>
          <p className={`mt-2.5 text-[14px] leading-relaxed text-muted ${center ? 'mx-auto max-w-md' : ''}`}>
            {t.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

function F1Card() {
  const d = formula1.driver;
  return (
    <Reveal>
      <article className={`card overflow-hidden ${hoverCard}`}>
        {/* chequered band */}
        <div
          aria-hidden
          className="h-3 w-full opacity-70"
          style={{
            background: 'repeating-conic-gradient(rgb(var(--ink)) 0 25%, transparent 0 50%) 0 0 / 12px 12px',
          }}
        />
        <div className="grid lg:grid-cols-12">
          <div className="relative bg-raised lg:col-span-7">
            <Photo img={d.photo} className="transition duration-700 group-hover:brightness-110" />
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white backdrop-blur">
              {d.role}
            </span>
          </div>

          <div className="relative flex flex-col justify-center overflow-hidden p-7 md:p-10 lg:col-span-5">
            {/* speed lines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07] transition-transform duration-[1200ms] ease-out group-hover:translate-x-6"
              style={{
                background:
                  'repeating-linear-gradient(-20deg, transparent 0 18px, rgb(var(--ink)) 18px 19px, transparent 19px 46px)',
              }}
            />
            {/* racing number */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-bold italic leading-none tracking-[-0.06em] text-transparent transition-transform duration-700 group-hover:-translate-x-2 md:text-[11rem]"
              style={{ WebkitTextStroke: '1.5px rgb(var(--line) / .14)' }}
            >
              {formula1.number}
            </span>

            <div className="relative">
              <span aria-hidden className="mb-6 block h-1 w-14 skew-x-[-24deg] bg-[#E10600]" />
              <p className="flex flex-wrap items-center gap-3 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold italic leading-none tracking-[-0.03em]">
                {d.name}
                <Flag code={d.country} className="h-5" />
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-muted">{d.description}</p>
              <Tags tags={d.tags} />

              {formula1.constructorTeam && (
                <div className="mt-6 border-t hairline pt-5">
                  <p className="eyebrow mb-1.5">Favourite Team</p>
                  <p className="font-display text-lg font-semibold">{formula1.constructorTeam}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

const jump = [
  { id: 'sports-football', label: football.title, emoji: football.emoji },
  { id: 'sports-cricket', label: cricket.title, emoji: cricket.emoji },
  { id: 'sports-f1', label: formula1.title, emoji: formula1.emoji },
];

export function Sports() {
  return (
    <section id="sports" aria-labelledby="sports-title" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="✦"
          label="Beyond the code"
          title={
            <span id="sports-title">
              My Favourite Sports
              <span className="mt-3 block font-serif text-[clamp(1.35rem,2.8vw,2rem)] font-normal italic leading-tight tracking-normal text-muted">
                The Teams, Players &amp; Moments That Inspire Me.
              </span>
            </span>
          }
          intro={sportsIntro}
        />

        <Reveal className="-mt-6 mb-16 flex flex-wrap gap-2 md:-mt-10 md:mb-20">
          {jump.map((j) => (
            <a
              key={j.id}
              href={`#${j.id}`}
              className="glass rounded-full px-4 py-2 text-[13.5px] text-muted transition hover:-translate-y-0.5 hover:text-ink"
            >
              <span aria-hidden className="mr-2">
                {j.emoji}
              </span>
              {j.label}
            </a>
          ))}
        </Reveal>

        <div className="space-y-24 md:space-y-28">
          {/* Football */}
          <div id="sports-football" className="scroll-mt-28">
            <SubHeader
              n="01"
              id="sports-football-title"
              emoji={football.emoji}
              title={football.title}
              tagline={football.tagline}
            />
            <div className="grid gap-5 lg:grid-cols-12">
              <PlayerCard p={football.player} className="lg:col-span-5" />
              <div className="flex flex-col gap-5 lg:col-span-7">
                <TeamCard t={football.club} size="lg" delay={0.08} />
                <div className="grid gap-5 sm:grid-cols-2">
                  {football.nationalTeams.map((t, i) => (
                    <TeamCard key={t.name} t={t} layout="stack" delay={0.12 + i * 0.06} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cricket */}
          <div id="sports-cricket" className="scroll-mt-28">
            <SubHeader
              n="02"
              id="sports-cricket-title"
              emoji={cricket.emoji}
              title={cricket.title}
              tagline={cricket.tagline}
            />
            <div className="grid gap-5 lg:grid-cols-12">
              <TeamCard t={cricket.team} size="lg" layout="stack" center className="lg:col-span-7" />
              <PlayerCard p={cricket.player} delay={0.08} className="lg:col-span-5" />
            </div>
          </div>

          {/* Formula 1 */}
          <div id="sports-f1" className="scroll-mt-28">
            <SubHeader
              n="03"
              id="sports-f1-title"
              emoji={formula1.emoji}
              title={formula1.title}
              tagline={formula1.tagline}
            />
            <F1Card />
          </div>
        </div>
      </div>
    </section>
  );
}
