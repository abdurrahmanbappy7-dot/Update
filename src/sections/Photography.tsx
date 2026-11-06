import { AnimatePresence, motion } from 'framer-motion';
import { Aperture, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { gallery } from '../data/gallery';
import type { GalleryItem } from '../data/types';

const shapeClass: Record<GalleryItem['shape'], string> = {
  tall: 'aspect-[3/4]',
  wide: 'aspect-[4/3]',
  square: 'aspect-square',
};

function EmptyFrame({ item, n }: { item: GalleryItem; n: number }) {
  return (
    <div className="relative grid h-full w-full place-items-center bg-[linear-gradient(135deg,rgb(var(--raised)),rgb(var(--surface)))]">
      <div aria-hidden className="absolute inset-3 border border-line/[0.06]" />
      <div className="text-center">
        <Aperture className="mx-auto text-faint transition-transform duration-700 group-hover:rotate-90" size={26} strokeWidth={1.25} aria-hidden />
        <p className="mt-3 font-serif text-lg italic text-muted">{item.caption}</p>
      </div>
      <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-faint">
        №{String(n).padStart(2, '0')}
      </span>
    </div>
  );
}

export function Photography() {
  const [open, setOpen] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);

  return (
    <section id="photography" className="relative overflow-hidden border-y hairline bg-surface/40 py-28 md:py-36">
      <div className="shell">
        <Reveal className="mb-16 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-faint">07 — Off the keyboard</p>
            <h2 className="font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] tracking-[-0.02em]">
              Photography <br />
              <em className="text-muted">&amp; visual stories.</em>
            </h2>
          </div>
          <p className="text-[15.5px] leading-relaxed text-muted md:col-span-4">
            When I’m not writing code, I like to look at the world through a lens — paying attention to light, framing,
            and the small moments that tell a story.
          </p>
        </Reveal>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {gallery.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <figure className="group">
                <button
                  type="button"
                  disabled={!item.src}
                  onClick={() => item.src && setOpen(item)}
                  aria-label={item.src ? `Open photo: ${item.alt || item.caption}` : `Empty photo frame ${i + 1}`}
                  className={`relative block w-full overflow-hidden ${shapeClass[item.shape]} ${item.src ? 'cursor-zoom-in' : 'cursor-default'}`}
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover grayscale-[30%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <EmptyFrame item={item} n={i + 1} />
                  )}
                </button>
                {item.src && (
                  <figcaption className="mt-3 flex justify-between font-mono text-[11px] text-faint">
                    <span>{item.caption}</span>
                    <span>№{String(i + 1).padStart(2, '0')}</span>
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={open.alt || open.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-bg/90 p-6 backdrop-blur-xl"
            onClick={() => setOpen(null)}
          >
            <button type="button" autoFocus aria-label="Close" className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-xl border border-line/15 text-ink">
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              src={open.src}
              alt={open.alt}
              className="max-h-[85vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
