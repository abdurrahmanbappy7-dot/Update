import { CalendarPlus, MapPin } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { experience } from '../data/experience';

export function Experience() {
  return (
    <section id="experience" className="relative border-y hairline bg-surface/30 py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Experience & Volunteering"
          title={
            <>
              Leading with people, <span className="text-muted">before leading with code.</span>
            </>
          }
          intro="My experience so far comes from youth organisations and community work. These roles taught me communication, responsibility, and how to get things done as a team."
        />

        <ol className="relative ml-2 border-l border-line/10 md:ml-0 md:border-l-0">
          {/* centre spine on desktop */}
          <span aria-hidden className="absolute bottom-0 left-[calc(33.333%-0.5px)] top-0 hidden w-px bg-gradient-to-b from-accent/60 via-line/10 to-transparent md:block" />
          {experience.map((x, i) => (
            <Reveal as="li" key={x.role + x.organization} delay={i * 0.06} className="relative grid gap-4 pb-12 pl-8 last:pb-0 md:grid-cols-3 md:gap-12 md:pl-0">
              <span
                aria-hidden
                className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent ring-4 ring-accent/15 md:left-[calc(33.333%-5px)]"
              />
              <div className="md:pr-12 md:text-right">
                {x.period ? (
                  <p className="font-mono text-[12.5px] text-cyan">{x.period}</p>
                ) : (
                  <p className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-faint">
                    <CalendarPlus size={12} aria-hidden /> Add dates
                  </p>
                )}
                {x.location && (
                  <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-faint md:flex md:justify-end">
                    <MapPin size={12} aria-hidden /> {x.location}
                  </p>
                )}
              </div>
              <div className="card p-6 transition-colors duration-300 hover:border-accent/30 md:col-span-2 md:p-7">
                <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">{x.role}</h3>
                <p className="mt-1 text-[15px] text-accent">{x.organization}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{x.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {x.focus.map((f) => (
                    <li key={f} className="rounded-full border border-line/10 px-3 py-1 text-[12px] text-muted">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
