import { Plus } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/SectionHeader';
import { skillGroups } from '../data/skills';
import type { Skill, SkillGroup } from '../data/types';

function SkillTile({ skill }: { skill: Skill }) {
  return (
    <li className="group relative flex items-center gap-4 rounded-xl border border-line/[0.07] bg-bg/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-raised/60">
      <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-accent/25 bg-gradient-to-br from-accent/20 to-cyan/5 font-mono text-[17px] font-medium text-ink">
        <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_50%_0%,rgb(var(--cyan)/.35),transparent_70%)]" aria-hidden />
        <span className="relative">{skill.glyph}</span>
      </span>
      <span>
        <span className="block font-display text-lg font-semibold tracking-[-0.01em]">{skill.name}</span>
        {skill.note && <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{skill.note}</span>}
      </span>
    </li>
  );
}

function Group({ group, featured, index }: { group: SkillGroup; featured: boolean; index: number }) {
  return (
    <Reveal delay={index * 0.07} className={`card flex flex-col p-6 md:p-8 ${featured ? 'lg:col-span-7 lg:row-span-3' : 'lg:col-span-5'}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">{group.title}</h3>
          <p className="mt-1 text-[14px] text-muted">{group.description}</p>
        </div>
        <span className="font-mono text-[11px] text-faint">{String(group.skills.length).padStart(2, '0')}</span>
      </div>

      {group.skills.length > 0 ? (
        <ul className={`grid gap-3 ${featured ? '' : 'sm:grid-cols-2'}`}>
          {group.skills.map((s) => (
            <SkillTile key={s.name} skill={s} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-dashed border-line/15 px-4 py-4 text-[13.5px] text-faint">
          <Plus size={16} aria-hidden />
          {group.emptyHint}
        </div>
      )}
    </Reveal>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative border-y hairline bg-surface/30 py-28 md:py-36">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Skills"
          title={
            <>
              Tools of the trade, <span className="text-muted">honestly listed.</span>
            </>
          }
          intro="These are the languages I currently work with. I’m adding to this list as I learn — no inflated percentages, just what I actually use."
        />
        <div className="grid gap-5 lg:grid-cols-12">
          {skillGroups.map((g, i) => (
            <Group key={g.id} group={g} featured={i === 0} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
