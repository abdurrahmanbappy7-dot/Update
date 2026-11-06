import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface Props {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'split';
}

export function SectionHeader({ index, label, title, intro, align = 'split' }: Props) {
  return (
    <Reveal
      className={
        align === 'split'
          ? 'mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end'
          : 'mb-14 max-w-2xl md:mb-20'
      }
    >
      <div className={align === 'split' ? 'md:col-span-7' : ''}>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-faint">{index}</span>
          <span className="h-px w-8 bg-cyan/50" aria-hidden />
          {label}
        </p>
        <h2 className="font-display text-[clamp(2.1rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      {intro && (
        <p className={`text-[15.5px] leading-relaxed text-muted ${align === 'split' ? 'md:col-span-5 md:pb-2' : 'mt-6'}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
