import { PencilLine } from 'lucide-react';

/** Small tag that marks content which still needs to be filled in. */
export function PlaceholderTag({ children = 'Editable placeholder' }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
      <PencilLine size={11} aria-hidden />
      {children}
    </span>
  );
}
