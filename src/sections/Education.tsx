import { CalendarClock, GraduationCap, MapPin } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { profile } from '../data/profile';

export function Education() {
  return (
    <section id="education" className="relative pb-28 md:pb-36" aria-labelledby="education-title">
      <div className="shell">
        <Reveal className="card group overflow-hidden p-0">
          <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent via-cyan to-transparent" />
          <div className="grid md:grid-cols-12">
            <div className="relative border-b hairline p-8 md:col-span-4 md:border-b-0 md:border-r md:p-10">
              <p className="eyebrow mb-6">
                <span className="text-faint">02</span> · Education
              </p>
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <GraduationCap size={26} aria-hidden />
              </span>
              <p className="mt-8 font-display text-5xl font-bold tracking-[-0.04em] text-ink/90">{profile.universityShort}</p>
            </div>
            <div className="p-8 md:col-span-8 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 text-[12px] text-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Undergraduate Student
              </span>
              <h2 id="education-title" className="mt-5 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-tight tracking-[-0.025em]">
                Bachelor of Science in Computer Science and Engineering
              </h2>
              <p className="mt-2 text-lg text-muted">{profile.university}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[12.5px] text-muted">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} className="text-cyan" aria-hidden /> {profile.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarClock size={14} className="text-cyan" aria-hidden /> In progress
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
