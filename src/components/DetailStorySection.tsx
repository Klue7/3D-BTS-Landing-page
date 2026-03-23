import React from 'react';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';

export function DetailStorySection() {
  const { activeProduct } = useProductCatalog();
  const { detailStory } = activeProduct;

  return (
    <section id="detail-story" data-section="detail" className="slide-shell story-section pointer-events-none">
      <div className="slide-frame">
        <div className="absolute inset-x-0 top-[18%] hidden h-px border-t border-dashed border-white/10 md:block" />
        <div className="absolute inset-x-0 top-[34%] hidden h-px border-t border-dashed border-white/10 md:block" />
        <div className="absolute inset-x-0 top-[50%] hidden h-px border-t border-dashed border-white/10 md:block" />
        <div className="absolute inset-x-0 top-[66%] hidden h-px border-t border-dashed border-white/10 md:block" />
        <div className="absolute inset-x-0 top-[82%] hidden h-px border-t border-dashed border-white/10 md:block" />

        <div data-motion="right" className="ml-auto flex h-full max-w-xl flex-col justify-center pt-20 md:mr-[6%] md:w-[42%] md:pt-0">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/62">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            {detailStory.badge}
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e] md:text-xs">
            {detailStory.eyebrow}
          </p>

          <h2 className="mt-5 whitespace-pre-line font-['Anton'] text-5xl uppercase leading-[0.86] tracking-[-0.08em] text-white md:text-[6.5rem]">
            {detailStory.title}
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/62 md:text-base">
            {detailStory.description}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {detailStory.metrics.map((metric) => (
              <div key={metric.label} className="border-l border-white/12 pl-5">
                <p className="text-4xl font-bold leading-none text-white md:text-5xl">{metric.value}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/52">{metric.label}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/48">{metric.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-md text-sm leading-relaxed text-white/46">
            {detailStory.footerNote}
          </p>

        </div>

        <div data-motion="up" className="pointer-events-auto absolute bottom-14 left-1/2 z-20 -translate-x-1/2 md:left-[32%]">
          <SectionCartCta sectionLabel="Detail section" />
        </div>
      </div>
    </section>
  );
}
