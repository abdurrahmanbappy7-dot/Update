import { HandHeart, Megaphone, CalendarRange, Sprout, UsersRound, Flag } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { leadership } from '../data/experience';

const icons = [Flag, UsersRound, Megaphone, CalendarRange, HandHeart, Sprout];

export function Leadership() {
  return (
    <section id="leadership" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Leadership & Activities"
          title={
            <>
              Skills built <span className="text-muted">outside the classroom.</span>
            </>
          }
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((l, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal as="li" key={l.title} delay={(i % 3) * 0.07} className="card group overflow-hidden p-7 transition-all duration-500 hover:-translate-y-1 hover:border-cyan/30">
                <span aria-hidden className="absolute -right-6 -top-6 font-display text-[7rem] font-bold leading-none text-line/[0.035] transition-colors duration-500 group-hover:text-cyan/[0.08]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan/10 text-cyan">
                  <Icon size={19} aria-hidden />
                </span>
                <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.01em]">{l.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{l.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
