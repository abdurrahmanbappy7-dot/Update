import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_8px_30px_-10px_rgb(var(--accent)/.7)] hover:shadow-[0_10px_40px_-8px_rgb(var(--accent)/.85)] hover:-translate-y-0.5',
  secondary:
    'border border-line/10 bg-surface/60 text-ink hover:border-accent/60 hover:-translate-y-0.5 backdrop-blur',
  ghost: 'text-muted hover:text-ink',
};

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <a
      {...rest}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
