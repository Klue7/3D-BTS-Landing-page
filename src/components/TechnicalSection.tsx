import React from 'react';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';

function findTechnicalSpec(
  specs: Array<{ label: string; value: string }>,
  label: string
) {
  return specs.find((spec) => spec.label === label);
}

export function TechnicalSection() {
  const { activeProduct } = useProductCatalog();
  const { technical } = activeProduct;
  const lengthSpec = findTechnicalSpec(technical.specs, 'LENGTH');
  const heightSpec = findTechnicalSpec(technical.specs, 'HEIGHT');
  const thicknessSpec = findTechnicalSpec(technical.specs, 'THICKNESS');
  const selectionSpec = findTechnicalSpec(technical.specs, 'SELECTION');

  return (
    <section id="technical-spotlight" data-section="technical" className="slide-shell story-section pointer-events-none">
      <div className="slide-frame flex items-center justify-center overflow-hidden">
        <div className="slide-grid-overlay" />

        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="relative h-[52vw] w-[52vw] max-h-[760px] max-w-[760px] rounded-full border border-white/10">
            <div className="absolute inset-[12%] rounded-full border border-white/[0.08]" />
            <div className="absolute inset-[24%] rounded-full border border-white/[0.06]" />
            <div className="absolute inset-[35%] rounded-full border border-white/[0.05]" />
            <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/[0.08]" />
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.08]" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute left-1/2 top-0 h-4 w-px origin-bottom bg-[#22c55e]/45 md:h-5"
                style={{ transform: `translateX(-50%) rotate(${deg}deg) translateY(-26vw)` }}
              />
            ))}
          </div>
        </div>

        <div data-motion="up" className="absolute left-8 top-8 text-[10px] uppercase tracking-[0.34em] text-white/45 md:left-12 md:top-12">
          {technical.eyebrow}
        </div>

        <div data-motion="up" className="absolute left-1/2 top-[10.5%] hidden -translate-x-1/2 text-center md:block">
          <p className="text-[10px] uppercase tracking-[0.38em] text-white/32">{technical.title}</p>
        </div>

        <div
          data-motion="up"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[min(17vw,10.5rem)] w-[min(40vw,35rem)] -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0.005))]" />
          <div className="absolute inset-[14px] rounded-[1.5rem] border border-white/[0.06]" />

          <div className="absolute left-[10%] top-0 h-4 w-px -translate-y-full bg-[#22c55e]/55" />
          <div className="absolute right-[10%] top-0 h-4 w-px -translate-y-full bg-[#22c55e]/55" />
          <div className="absolute bottom-0 left-[10%] h-4 w-px translate-y-full bg-[#22c55e]/55" />
          <div className="absolute bottom-0 right-[10%] h-4 w-px translate-y-full bg-[#22c55e]/55" />

          <div className="absolute left-0 top-[24%] h-px w-7 -translate-x-full bg-white/[0.08]" />
          <div className="absolute left-0 top-[76%] h-px w-7 -translate-x-full bg-white/[0.08]" />
          <div className="absolute right-0 top-[24%] h-px w-7 translate-x-full bg-white/[0.08]" />
          <div className="absolute right-0 top-[76%] h-px w-7 translate-x-full bg-white/[0.08]" />
        </div>

        <div data-motion="left" className="absolute left-8 top-[24%] z-20 hidden max-w-[18rem] md:block lg:left-[10.5%]">
          <div className="relative rounded-[1.5rem] border border-white/10 bg-black/22 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/42">
              <span className="h-px w-8 bg-[#22c55e]/55" />
              {technical.microTextureLabel}
            </div>
            <p className="mt-4 text-[4.2rem] font-semibold leading-none tracking-tight text-white">
              {technical.microTextureValue}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/58">{technical.microTextureCaption}</p>
            <div className="absolute right-[-5.5rem] top-[4.3rem] h-px w-[5.5rem] bg-white/[0.08]" />
            <div className="absolute right-[-5.5rem] top-[3.55rem] h-6 w-px bg-[#22c55e]/45" />
          </div>
        </div>

        {lengthSpec && (
          <div data-motion="up" className="absolute left-1/2 top-[18%] z-20 hidden -translate-x-1/2 text-center md:block">
            <div className="mx-auto flex w-[min(28vw,24rem)] items-center gap-3">
              <span className="h-px flex-1 bg-white/[0.1]" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-white/42">{lengthSpec.label}</span>
              <span className="h-px flex-1 bg-white/[0.1]" />
            </div>
            <p className="mt-4 text-[3.4rem] font-semibold leading-none tracking-tight text-white">{lengthSpec.value}</p>
            <div className="mx-auto mt-4 h-10 w-px bg-white/[0.08]" />
            <div className="mx-auto h-3 w-px bg-[#22c55e]/55" />
          </div>
        )}

        {thicknessSpec && (
          <div data-motion="right" className="absolute right-8 top-[24%] z-20 hidden w-[15rem] text-right md:block lg:right-[10.5%]">
            <div className="relative rounded-[1.5rem] border border-white/10 bg-black/22 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center justify-end gap-3 text-[10px] uppercase tracking-[0.32em] text-white/42">
                {thicknessSpec.label}
                <span className="h-px w-8 bg-[#22c55e]/55" />
              </div>
              <p className="mt-4 text-[3.15rem] font-semibold leading-none tracking-tight text-white">{thicknessSpec.value}</p>
              <div className="absolute left-[-5.5rem] top-[4.3rem] h-px w-[5.5rem] bg-white/[0.08]" />
              <div className="absolute left-[-5.5rem] top-[3.55rem] h-6 w-px bg-[#22c55e]/45" />
            </div>
          </div>
        )}

        {heightSpec && (
          <div data-motion="left" className="absolute bottom-[22%] left-8 z-20 hidden w-[15rem] md:block lg:left-[10.5%]">
            <div className="relative rounded-[1.5rem] border border-white/10 bg-black/22 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/42">
                <span className="h-px w-8 bg-[#22c55e]/55" />
                {heightSpec.label}
              </div>
              <p className="mt-4 text-[3.15rem] font-semibold leading-none tracking-tight text-white">{heightSpec.value}</p>
              <div className="absolute right-[-5.5rem] top-[4.3rem] h-px w-[5.5rem] bg-white/[0.08]" />
              <div className="absolute right-[-5.5rem] top-[3.55rem] h-6 w-px bg-[#22c55e]/45" />
            </div>
          </div>
        )}

        <div data-motion="left" className="absolute left-[17%] top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.34em] text-white/26 md:block">
          Surface axis
        </div>
        <div data-motion="right" className="absolute right-[15%] top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.34em] text-white/26 md:block">
          Module axis
        </div>

        <div data-motion="right" className="absolute bottom-[17.5%] right-8 z-20 hidden max-w-[18rem] text-right md:block lg:right-[10.5%]">
          <div className="relative rounded-[1.5rem] border border-white/10 bg-black/22 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center justify-end gap-3 text-[10px] uppercase tracking-[0.32em] text-white/42">
              {selectionSpec?.label ?? 'SELECTION'}
              <span className="h-px w-8 bg-[#22c55e]/55" />
            </div>
            <p className="mt-4 text-[3rem] font-semibold leading-[0.92] tracking-tight text-white">
              {technical.coatingDisplay}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-white/58">{technical.coatingCaption}</p>
            <div className="absolute left-[-5.5rem] top-[4.3rem] h-px w-[5.5rem] bg-white/[0.08]" />
            <div className="absolute left-[-5.5rem] top-[3.55rem] h-6 w-px bg-[#22c55e]/45" />
          </div>
        </div>

        <div className="relative z-20 flex h-full w-full flex-col justify-between px-5 pb-24 pt-24 md:hidden">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">{technical.eyebrow}</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold uppercase tracking-[0.16em] text-white">{technical.title}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{technical.microTextureLabel}</p>
              <p className="mt-3 text-3xl font-bold text-white">{technical.microTextureValue}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/58">{technical.microTextureCaption}</p>
            </div>
            {technical.specs.slice(0, 1).map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{spec.label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {technical.specs.slice(1, 3).map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{spec.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">{selectionSpec?.label ?? 'SELECTION'}</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-white">{technical.coatingDisplay}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/58">{technical.coatingCaption}</p>
          </div>
        </div>

        <div data-motion="up" className="pointer-events-auto absolute bottom-14 left-1/2 z-20 -translate-x-1/2">
          <SectionCartCta sectionLabel="Technical section" />
        </div>
      </div>
    </section>
  );
}
