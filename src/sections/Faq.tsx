import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { faq } from '@/content/content';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type Item = (typeof faq.items)[number];

function FaqRow({ item, open, onToggle, id }: { item: Item; open: boolean; onToggle: () => void; id: string }) {
  const blocks = 'blocks' in item ? item.blocks : undefined;
  return (
    <div className="border-b border-ea-petroleo/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="ea-display text-lg text-ea-petroleo sm:text-xl">{item.q}</span>
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ea-creme transition-all duration-300 ease-ea',
              open && 'rotate-45 bg-ea-neon',
            )}
          >
            <Plus className="h-4 w-4 text-ea-petroleo" aria-hidden />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pb-6 pr-10 text-base leading-relaxed text-ea-soft">
              <p>{item.a}</p>
              {blocks?.map((b) => (
                <div key={b.title} className="rounded-ea border border-ea-petroleo/10 bg-ea-creme p-4">
                  <p className="ea-kicker mb-1.5 text-ea-petroleo">{b.title}</p>
                  <p className="text-sm leading-relaxed text-ea-soft">{b.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" tone="coolgrey">
      <div className="mx-auto max-w-3xl">
        <SectionHeading kicker="Dúvidas" title={faq.title} align="center" className="mx-auto" />

        <Reveal className="mt-12">
          <div className="rounded-ea-lg border border-ea-petroleo/10 bg-white px-6 shadow-ea-sm sm:px-8">
            {faq.items.map((item, i) => (
              <FaqRow
                key={item.q}
                id={`faq-panel-${i}`}
                item={item}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="text-lg text-ea-petroleo">
            <span className="font-semibold">{faq.footerBold}</span>
            {faq.footerRest}
          </p>
          <Button href="#contato" size="lg">
            {faq.cta}
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
