import React from 'react';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';

export function MaterialStorySection() {
  const { activeProduct } = useProductCatalog();
  const { materialStory } = activeProduct;

  return (
    <section id="material-story" data-section="material" className="slide-shell story-section pointer-events-none">
      <div className="slide-frame grid items-center gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-0">
        <div className="slide-grid-overlay" />
        <div className="absolute inset-y-[22%] left-[36.5%] hidden w-px bg-white/8 md:block" />
        <div className="absolute left-[36.5%] top-1/2 hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/16 bg-white/8 md:block" />

        <div data-motion="left" className="relative z-20 max-w-xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e] md:text-xs">
              Performance metrics
            </span>
          </div>

          <h2 className="mb-12 font-['Anton'] text-5xl uppercase leading-[0.85] tracking-[-0.08em] text-white md:mb-16 md:text-[7rem]">
            {materialStory.title}
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)' }}>
              {materialStory.subtitle}
            </span>
          </h2>

          <div className="max-w-md space-y-8 md:space-y-12">
            {materialStory.metrics.map((metric, idx) => {
              const numericValue = metric.value.replace(/[^0-9.]/g, '');
              const unitValue = metric.value.replace(/[0-9.]/g, '');

              return (
                <div key={idx} className="border-l border-white/12 pl-5 md:pl-7">
                  <div className="mb-2 flex items-baseline gap-1 md:mb-3">
                    <span className="text-4xl font-bold text-white md:text-5xl">{numericValue}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-white/45 md:text-sm">{unitValue}</span>
                  </div>
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/72 md:text-xs">
                    {metric.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/48">
                    {metric.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        <div data-motion="right" className="relative hidden h-full md:block">
          <div className="absolute inset-y-[12%] right-[10%] w-px bg-white/6" />
          <div className="absolute right-[9.4%] top-[52%] h-4 w-4 rounded-full bg-white/60" />
        </div>

        <div data-motion="up" className="pointer-events-auto absolute bottom-14 left-1/2 z-20 -translate-x-1/2 md:left-[64%]">
          <SectionCartCta sectionLabel="Material section" />
        </div>
      </div>
    </section>
  );
}
