import React from 'react';
import { productData } from '../data/mockData';

interface RelatedProductsSectionProps {
  onCustomizeClick: () => void;
}

export function RelatedProductsSection({ onCustomizeClick }: RelatedProductsSectionProps) {
  const { relatedProducts } = productData;

  return (
    <section id="related-products" className="relative w-full bg-[#050505] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 md:mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase text-[#22c55e]">
              {relatedProducts.eyebrow}
            </p>
            <h2 className="text-4xl md:text-6xl font-['Anton'] uppercase tracking-[-0.06em] leading-[0.95] text-white">
              {relatedProducts.title}
            </h2>
            <p className="mt-5 text-sm md:text-base text-white/64 leading-relaxed">
              {relatedProducts.description}
            </p>
          </div>

          <button
            onClick={onCustomizeClick}
            className="w-full md:w-auto border border-[#22c55e]/40 bg-[#22c55e]/10 px-7 py-4 text-xs font-bold tracking-[0.28em] uppercase text-white transition-colors hover:bg-[#22c55e] hover:text-black"
          >
            Open Customize Studio
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.products.map((product, index) => (
            <article
              key={product.name}
              className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b0b0b] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[1/1] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-[10px] text-[#22c55e] tracking-[0.3em] uppercase mb-3">
                  0{index + 1} Selected Finish
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm text-white/58 leading-relaxed">
                  Presented from the current local BTS reference set for quick comparison against the Zambezi hero finish.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
