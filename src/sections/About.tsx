import { Compass, Lightbulb, RefreshCcw, Users } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { profile } from '../data/profile';

const values = [
  { icon: Lightbulb, title: 'Problem-solving', text: 'Breaking problems into smaller steps and working through them logically.' },
  { icon: RefreshCcw, title: 'Continuous learning', text: 'Treating every course, assignment, and mistake as something to learn from.' },
  { icon: Users, title: 'Teamwork', text: 'Shaped by years of working with volunteer teams and student organisations.' },
  { icon: Compass, title: 'Curiosity', text: 'Following how emerging technologies are changing the way we build and live.' },
];

const facts = [
  ['Name', profile.fullName],
  ['Studying', 'B.Sc. in CSE'],
  ['University', profile.universityShort],
  ['Based in', profile.location],
] as const;

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              A curious student, <span className="text-muted">learning to build software that matters.</span>
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-6 text-[17px] leading-[1.75] text-muted lg:col-span-7">
            <p>
              I’m <span className="text-ink">{profile.fullName}</span>, a Computer Science and Engineering undergraduate at
              the {profile.university}. My journey in CSE started with a simple curiosity about how software works, and it
              has grown into a genuine interest in programming and software development.
            </p>
            <p>
              Right now I’m building my foundations in <span className="text-ink">C</span>,{' '}
              <span className="text-ink">C++</span>, and <span className="text-ink">Python</span> — writing programs,
              working through problems, and learning how good code is structured. I’m especially curious about emerging
              technologies and how they shape the products people use every day.
            </p>
            <p>
              Outside the classroom, my time in volunteer organisations has taught me the value of teamwork, clear
              communication, and showing up for others. I enjoy creative work and collaborative problem-solving, and I’m
              committed to learning continuously.
            </p>
            <p className="text-ink">
              I’m currently looking for internship and entry-level opportunities where I can contribute, learn from
              experienced engineers, and grow as a developer.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <dl className="card divide-y divide-line/[0.07] overflow-hidden">
              {facts.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 px-6 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{k}</dt>
                  <dd className="text-right text-[14.5px]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border hairline bg-line/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.06} className="group bg-bg p-7 transition-colors hover:bg-surface">
              <v.icon size={20} className="text-accent transition-transform duration-500 group-hover:-translate-y-1" aria-hidden />
              <h3 className="mt-6 font-display text-lg font-semibold tracking-[-0.01em]">{v.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{v.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
