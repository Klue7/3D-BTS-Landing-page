import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSectionProps {
  onReturnToTop: () => void;
}

export function ShowcaseSection({ onReturnToTop }: ShowcaseSectionProps) {
  const { activeProduct, activeProductIndex, products, setActiveProductId, goToNextProduct, goToPreviousProduct } =
    useProductCatalog();
  const { installationShowcase } = activeProduct;
  const [surfaceNote, , proofNote] = installationShowcase.editorialNotes;
  const countLabel = `${String(activeProductIndex + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}`;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const topButtonRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const productNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      gsap.set(headingRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(leftPanelRef.current, { autoAlpha: 0, x: -52, y: 12 });
      gsap.set(rightPanelRef.current, { autoAlpha: 0, x: 52, y: 12 });
      gsap.set(topButtonRef.current, { autoAlpha: 0, x: -40, y: 18 });
      gsap.set(ctaRef.current, { autoAlpha: 0, y: 26, scale: 0.96 });
      gsap.set(productNavRef.current, { autoAlpha: 0, x: 40, y: 18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 26%',
          scrub: 0.5,
        },
      });

      timeline
        .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.18, ease: 'none' }, 0.06)
        .to(leftPanelRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.18, ease: 'none' }, 0.16)
        .to(rightPanelRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.18, ease: 'none' }, 0.2)
        .to(topButtonRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.16, ease: 'none' }, 0.24)
        .to(ctaRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.16, ease: 'none' }, 0.24)
        .to(productNavRef.current, { autoAlpha: 1, x: 0, y: 0, duration: 0.16, ease: 'none' }, 0.28)
        .to(headingRef.current, { autoAlpha: 0, y: -20, duration: 0.16, ease: 'none' }, 0.64)
        .to(leftPanelRef.current, { autoAlpha: 0, x: -24, y: -10, duration: 0.14, ease: 'none' }, 0.68)
        .to(rightPanelRef.current, { autoAlpha: 0, x: 24, y: -10, duration: 0.14, ease: 'none' }, 0.72)
        .to(topButtonRef.current, { autoAlpha: 0, x: -18, y: -10, duration: 0.12, ease: 'none' }, 0.72)
        .to(ctaRef.current, { autoAlpha: 0, y: -12, scale: 0.98, duration: 0.12, ease: 'none' }, 0.72)
        .to(productNavRef.current, { autoAlpha: 0, x: 18, y: -10, duration: 0.12, ease: 'none' }, 0.74);
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, [activeProduct.id]);

  return (
    <section ref={sectionRef} id="showcase" data-section="showcase" className="slide-shell story-section pointer-events-none">
      <div className="slide-frame overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.018),transparent_22%),radial-gradient(circle_at_center,rgba(0,0,0,0.24),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(0,0,0,0))]" />

        <div
          ref={headingRef}
          className="absolute left-1/2 top-[13.2%] z-20 w-[min(62vw,620px)] -translate-x-1/2 text-center md:top-[13.5%] xl:top-[13.2%]"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/45 md:text-xs">
            {installationShowcase.eyebrow}
          </p>
          <h2
            className="mt-3 whitespace-pre-line font-['Anton'] text-[2.7rem] uppercase leading-[0.95] tracking-[0.05em] text-white md:text-[3.5rem] xl:text-[3.82rem]"
            style={{ transform: 'scaleX(1.09)', wordSpacing: '0.12em' }}
          >
            {installationShowcase.title}
          </h2>
        </div>

        <div ref={leftPanelRef} className="absolute left-6 top-[35.5%] z-20 hidden max-w-[250px] md:block lg:left-[7.25%]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#22c55e]">{surfaceNote.label}</p>
          <div className="mt-3.5 h-px w-[4.75rem] bg-white/14" />
          <h3 className="mt-4 text-[2.8rem] font-semibold leading-[0.92] tracking-tight text-white">{installationShowcase.surfaceHeading}</h3>
          <p className="mt-4 max-w-[14.75rem] text-[0.98rem] leading-relaxed text-white/58">{surfaceNote.value}</p>
        </div>

        <div ref={rightPanelRef} className="absolute right-6 top-[35.5%] z-20 hidden max-w-[260px] text-right md:block lg:right-[7.25%]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#22c55e]">{proofNote.label}</p>
          <div className="mt-3.5 ml-auto h-px w-[4.75rem] bg-white/14" />
          <h3 className="mt-4 text-[2.8rem] font-semibold leading-[0.92] tracking-tight text-white">{installationShowcase.proofHeading}</h3>
          <p className="mt-4 ml-auto max-w-[14.75rem] text-[0.98rem] leading-relaxed text-white/58">{proofNote.value}</p>
        </div>

        <div ref={topButtonRef} className="pointer-events-auto absolute bottom-10 left-6 z-20 max-w-[16rem] md:bottom-14 md:left-10 xl:left-[7.25%]">
          <div className="rounded-[1.6rem] border border-white/10 bg-black/32 px-4 py-3 backdrop-blur-md">
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-white/34">Selling Price</p>
            <p className="mt-2 text-[clamp(2.6rem,4.4vw,3.7rem)] font-semibold leading-none tracking-tight text-[#22c55e]">
              {activeProduct.pricing.amount}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/54">
              {activeProduct.pricing.detail}
            </p>
          </div>

          <button
            type="button"
            onClick={onReturnToTop}
            aria-label="Return to the top hero section"
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/45 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/72 backdrop-blur-md transition-all duration-300 hover:border-[#22c55e]/55 hover:bg-[#22c55e]/10 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white">
              <ArrowUp size={16} />
            </span>
            <span className="hidden sm:inline">Back To Top</span>
          </button>
        </div>

        <div ref={ctaRef} className="pointer-events-auto absolute bottom-14 left-1/2 z-20 -translate-x-1/2">
          <SectionCartCta sectionLabel="Showcase section" />
        </div>

        <div
          ref={productNavRef}
          className="pointer-events-auto absolute bottom-10 right-6 z-20 flex flex-col items-end gap-3 md:bottom-14 md:right-10 xl:right-[7.25%]"
        >
          <div className="rounded-full border border-white/12 bg-black/45 px-4 py-2 text-right backdrop-blur-md">
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
                    type="button"
                    onClick={() => setActiveProductId(product.id)}
                    aria-label={`Show ${product.productName} in the signature showcase`}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      isActive ? 'scale-125 bg-[#22c55e]' : 'bg-white/26 hover:bg-white/55'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToPreviousProduct}
              aria-label="Show previous showcase product"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToNextProduct}
              aria-label="Show next showcase product"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/16 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
