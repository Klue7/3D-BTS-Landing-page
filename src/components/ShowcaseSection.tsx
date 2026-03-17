import React from 'react';
import { productData } from '../data/mockData';

export function ShowcaseSection() {
  const { installationShowcase } = productData;

  return (
    <section id="showcase" className="relative w-full min-h-screen bg-[#0a0a0a] py-24 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.07),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))]" />
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-[0.92fr_1.08fr] gap-14 md:gap-20 items-center relative">
        <div className="flex flex-col z-20 order-2 md:order-1">
          <p className="text-[#22c55e] text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase mb-4">
            {installationShowcase.eyebrow}
          </p>
          <h2 className="text-4xl md:text-6xl font-['Anton'] text-white uppercase tracking-[-0.06em] leading-[0.95] mb-6">
            {installationShowcase.title}
          </h2>
          <p className="text-sm md:text-base text-white/64 mb-10 max-w-xl leading-relaxed">
            {installationShowcase.description}
          </p>

          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-8 max-w-xl">
            {installationShowcase.editorialNotes.map((note) => (
              <div key={note.label} className="flex gap-4 items-start border-b border-white/6 pb-4 last:border-b-0 last:pb-0">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#22c55e] shrink-0" />
                <div>
                  <p className="text-[10px] text-white/45 tracking-[0.3em] uppercase mb-2">{note.label}</p>
                  <p className="text-sm text-white/78 leading-relaxed">{note.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-0 order-1 md:order-2">
          <div className="grid grid-cols-[1.1fr_0.72fr] gap-4 md:gap-5">
            <div className="relative col-span-2 md:col-span-1 aspect-[4/4.7] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
              <img
                src={installationShowcase.primaryImage}
                alt="Reference brick-tile wall surface"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              <div className="absolute left-5 bottom-5 right-5">
                <p className="text-[10px] text-[#22c55e] tracking-[0.32em] uppercase mb-2">Material Read</p>
                <p className="text-sm text-white/82 leading-relaxed">
                  Long horizontal coursing keeps the clay texture visible without turning the elevation into a busy pattern.
                </p>
              </div>
            </div>

            <div className="aspect-[1/1.15] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111]">
              <img
                src={installationShowcase.secondaryImage}
                alt="Reference pallets of clay brick material"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="aspect-[1/1.15] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111]">
              <img
                src={installationShowcase.detailImage}
                alt="Reference detail of fired-clay brick texture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="hidden md:flex absolute -bottom-10 left-8 items-center gap-6 rounded-full border border-white/10 bg-black/75 px-6 py-4 backdrop-blur-sm">
            <div>
              <p className="text-[10px] text-white/45 tracking-[0.28em] uppercase">Material focus</p>
              <p className="text-sm text-white">Tonal variation and crisp modular rhythm</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[10px] text-white/45 tracking-[0.28em] uppercase">Reference set</p>
              <p className="text-sm text-white">Local BTS image library</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
