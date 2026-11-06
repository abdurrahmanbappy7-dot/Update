import { Award, BookOpen, ExternalLink, HeartHandshake, Presentation, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { achievements } from '../data/achievements';

const icons: Record<string, typeof Award> = {
  certificates: Award,
  workshops: Presentation,
  competitions: Trophy,
  academic: BookOpen,
  volunteer: HeartHandshake,
};

export function Achievements() {
  const [active, setActive] = useState(achievements[0].id);
  const current = achievements.find((a) => a.id === active)!;
  const Icon = icons[current.id] ?? Award;

  return (
    <section id="achievements" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="08"
          label="Achievements & Certifications"
          title={
            <>
              Milestones, <span className="text-muted">added as they’re earned.</span>
            </>
          }
          intro="Certificates, workshops, competitions, and recognitions will appear here as I complete them."
        />

        <Reveal className="card overflow-hidden">
          <div role="tablist" aria-label="Achievement categories" className="flex gap-1 overflow-x-auto border-b hairline p-2">
            {achievements.map((a) => {
              const I = icons[a.id] ?? Award;
              const selected = a.id === active;
              return (
                <button
                  key={a.id}
                  role="tab"
                  id={`tab-${a.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${a.id}`}
                  onClick={() => setActive(a.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] transition ${
                    selected ? 'bg-raised text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <I size={15} aria-hidden className={selected ? 'text-accent' : ''} />
                  {a.title}
                  <span className="font-mono text-[10.5px] text-faint">{a.items.length}</span>
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`} className="p-6 md:p-10">
            {current.items.length ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {current.items.map((it) => (
                  <li key={it.title} className="flex items-start gap-4 rounded-xl border border-line/[0.07] p-5">
                    <Icon className="mt-0.5 shrink-0 text-accent" size={18} aria-hidden />
                    <div className="flex-1">
                      <p className="font-medium">{it.title}</p>
                      <p className="mt-1 text-[13.5px] text-muted">
                        {it.issuer} · {it.date}
                      </p>
                    </div>
                    {it.link && (
                      <a href={it.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${it.title}`} className="text-muted hover:text-ink">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border border-dashed border-line/20 text-faint">
                  <Icon size={24} strokeWidth={1.5} aria-hidden />
                </span>
                <p className="mt-5 font-display text-lg font-semibold">No {current.title.toLowerCase()} listed yet</p>
                <p className="mt-1.5 max-w-sm text-[14px] text-muted">{current.description} will be added here.</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
