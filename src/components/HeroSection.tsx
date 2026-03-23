import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';

export function HeroSection() {
  const { activeProduct, activeProductIndex, products, setActiveProductId, goToNextProduct, goToPreviousProduct } = useProductCatalog();
  const productWord = activeProduct.heroWord?.label ?? activeProduct.productName.toUpperCase();
  const backgroundWordStyle = {
    fontSize:
      activeProduct.heroWord?.fontSize ??
      (productWord.length <= 6
        ? 'min(31vw, 43vh)'
        : productWord.length <= 8
          ? 'min(27vw, 41vh)'
          : 'min(23vw, 38vh)'),
  };
  const formatSummary = activeProduct.technical.specs.slice(0, 3).map((spec) => spec.value).join('  •  ');
  const countLabel = `${String(activeProductIndex + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}`;

  return (
    <section id="hero" className="hero-shell pointer-events-none">
      <div className="slide-frame">
        <div className="slide-grid-overlay" />

        <div className="absolute inset-0 z-[10] flex items-center justify-center overflow-hidden pointer-events-none">
          <h1
            data-hero-word
            className="hero-word-layer hero-word-fill select-none"
            style={{
              ...backgroundWordStyle,
              transform: activeProduct.heroWord?.transform ?? 'translate(0.5%, -3.5%) scaleX(1.005)',
            }}
          >
            {productWord}
          </h1>
        </div>

        <div data-hero-motion="left" className="absolute bottom-16 left-6 z-20 max-w-[22rem] md:bottom-16 md:left-12 md:max-w-[24rem] xl:left-16">
          <div className="absolute -inset-x-8 -inset-y-8 -z-10 pointer-events-none bg-[radial-gradient(circle_at_18%_34%,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.26)_44%,transparent_80%)] blur-2xl" />
          <p className="mb-5 text-[10px] font-bold tracking-[0.34em] uppercase text-[#22c55e] md:text-xs">
            Brick Tile Shop Signature Finish
          </p>
          <h2 className="text-[3.5rem] leading-[0.92] font-bold tracking-tight text-[#f4f1eb] md:text-[4rem]">
            {activeProduct.productName}
          </h2>
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/72 md:text-xs">
            {activeProduct.category}
          </p>
          <p className="mt-5 max-w-[21rem] text-sm leading-relaxed text-white/72 md:max-w-[22rem] md:text-base">
            {activeProduct.heroDescription}
          </p>
          <div className="mt-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/34 md:text-[11px]">Selling Price</p>
            <p className="mt-2 text-[clamp(2.9rem,5.2vw,4.4rem)] font-semibold leading-none tracking-tight text-[#22c55e]">
              {activeProduct.pricing.amount}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.26em] text-white/58 md:text-[11px]">
              {activeProduct.pricing.detail}
            </p>
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.32em] text-white/62 md:text-xs">
            Format {formatSummary}
          </p>
        </div>

        <div data-hero-motion="up" className="pointer-events-auto absolute bottom-24 left-1/2 z-20 flex w-[calc(100%-3rem)] -translate-x-1/2 flex-col gap-3 md:bottom-16 md:w-auto md:flex-row md:items-center">
          <button className="w-full rounded-full bg-[#22c55e] px-9 py-4 text-xs font-bold uppercase tracking-[0.32em] text-white shadow-[0_0_40px_rgba(34,197,94,0.34)] transition-all hover:scale-[1.02] hover:bg-[#16a34a] md:w-auto">
            {activeProduct.primaryCta}
          </button>
          <SectionCartCta sectionLabel="Hero section" />
        </div>

        <div data-hero-motion="right" className="pointer-events-auto absolute bottom-7 right-6 z-20 flex items-center gap-3 md:bottom-16 md:right-12 xl:right-16">
          <div className="rounded-full border border-white/12 bg-black/45 px-4 py-2 backdrop-blur-md">
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/36">{countLabel}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72 md:text-[11px]">
              {activeProduct.productName}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/45 px-2 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2 px-1">
              {products.map((product) => {
                const isActive = product.id === activeProduct.id;

                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveProductId(product.id)}
                    aria-label={`Show ${product.productName} product`}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${isActive ? 'scale-125 bg-[#22c55e]' : 'bg-white/26 hover:bg-white/55'}`}
                  />
                );
              })}
            </div>
          <button
            onClick={goToPreviousProduct}
            aria-label="Show previous product"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10 md:h-12 md:w-12"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNextProduct}
            aria-label="Show next product"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10 md:h-12 md:w-12"
          >
            <ChevronRight size={18} />
          </button>
          </div>
        </div>
      </div>
    </section>
  );
}
