import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useProductCatalog } from './ProductCatalogContext';
import { SectionCartCta } from './SectionCartCta';
import { SocialLinks } from './SocialLinks';
import { InstallationRevealFrame } from './InstallationRevealFrame';

interface RelatedProductsSectionProps {
  onUploadPreviewClick: () => void;
}

function FloatingShard({
  shardRef,
  className,
  clipPath,
  background,
}: {
  shardRef: React.RefObject<HTMLDivElement | null>;
  className: string;
  clipPath: string;
  background: string;
}) {
  return (
    <div
      ref={shardRef}
      className={className}
      style={{
        clipPath,
        background,
      }}
    />
  );
}

export function RelatedProductsSection({ onUploadPreviewClick }: RelatedProductsSectionProps) {
  const { activeProduct } = useProductCatalog();
  const dotRef = useRef<HTMLDivElement>(null);
  const darkShardRef = useRef<HTMLDivElement>(null);
  const clayShardPrimaryRef = useRef<HTMLDivElement>(null);
  const clayShardSecondaryRef = useRef<HTMLDivElement>(null);
  const clayShardTertiaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      dotRef.current,
      darkShardRef.current,
      clayShardPrimaryRef.current,
      clayShardSecondaryRef.current,
      clayShardTertiaryRef.current,
    ].filter(Boolean) as HTMLDivElement[];

    const loops = elements.map((element, index) =>
      gsap.to(element, {
        y: index % 2 === 0 ? -10 : 12,
        x: index % 3 === 0 ? 6 : -4,
        rotation: index % 2 === 0 ? 8 : -10,
        duration: 3.6 + index * 0.45,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    return () => {
      loops.forEach((loop) => loop.kill());
    };
  }, []);

  return (
    <section id="related-products" data-section="footer" className="slide-shell story-section pointer-events-none">
      <div className="slide-frame overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_55%)]" />

        <div
          ref={dotRef}
          data-motion="left"
          className="absolute left-[12%] top-[28%] z-10 h-8 w-8 rounded-full bg-white/58 md:h-10 md:w-10"
        />

        <FloatingShard
          shardRef={darkShardRef}
          className="absolute left-[37.5%] top-[13%] z-10 hidden h-12 w-9 bg-white/12 md:block"
          clipPath="polygon(28% 0%, 100% 76%, 0% 100%)"
          background="linear-gradient(160deg, rgba(33,37,42,0.9), rgba(12,13,15,0.94))"
        />
        <FloatingShard
          shardRef={clayShardPrimaryRef}
          className="absolute right-[18.5%] top-[22%] z-10 hidden h-26 w-18 opacity-55 md:block"
          clipPath="polygon(12% 0%, 100% 18%, 48% 100%)"
          background="linear-gradient(155deg, rgba(52,210,119,0.78) 0%, rgba(31,170,93,0.58) 52%, rgba(15,109,58,0.34) 100%)"
        />
        <FloatingShard
          shardRef={clayShardSecondaryRef}
          className="absolute right-[27%] top-[13%] z-10 hidden h-16 w-12 opacity-45 md:block"
          clipPath="polygon(18% 0%, 100% 22%, 58% 100%, 0% 72%)"
          background="linear-gradient(160deg, rgba(60,214,122,0.54), rgba(24,155,82,0.32))"
        />
        <FloatingShard
          shardRef={clayShardTertiaryRef}
          className="absolute right-[20.5%] top-[14.5%] z-10 hidden h-14 w-10 opacity-40 md:block"
          clipPath="polygon(0% 28%, 100% 0%, 58% 100%)"
          background="linear-gradient(155deg, rgba(190,248,215,0.52), rgba(58,201,115,0.28))"
        />

        <div className="absolute inset-x-0 top-[4.8%] z-20 flex flex-col items-center">
          <div data-motion="up" className="flex w-full max-w-[23rem] flex-col items-center px-6 text-center">
            <div className="rounded-full border border-[#22c55e]/55 px-5 py-[0.42rem] text-[9px] uppercase tracking-[0.34em] text-[#22c55e]">
              Signature BTS Selection
            </div>
            <div className="relative mt-3 flex w-full flex-col items-center">
              <span
                className="pointer-events-none absolute left-1/2 top-[10%] -translate-x-1/2 font-['Anton'] text-[clamp(3.6rem,7vw,5.7rem)] uppercase leading-[0.84] tracking-[-0.06em] text-transparent opacity-15"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}
              >
                DEVY
              </span>
              <h2 className="relative font-['Anton'] text-[clamp(3.15rem,6vw,4.95rem)] uppercase leading-[0.84] tracking-[-0.07em] text-white">
                DECOR<span className="text-[#22c55e]">.</span>
              </h2>
            </div>
            <p className="mt-1 max-w-[16.5rem] text-[0.8rem] leading-relaxed text-white/50">
              Built around {activeProduct.productName}, with finish-led selection, sample support, and a cleaner path back into the collection.
            </p>
          </div>

          <div data-motion="up" className="mt-3 flex w-full justify-center px-6">
            <InstallationRevealFrame
              key={`${activeProduct.id}-${activeProduct.finishAssets.decorRevealPresentation?.installedRoomImage ?? ''}`}
            />
          </div>
        </div>

        <div data-motion="up" className="absolute bottom-[8.85rem] left-1/2 z-20 w-[calc(100%-4rem)] max-w-[76rem] -translate-x-1/2 border-y border-white/10 px-4 py-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.34em] text-white/68 md:justify-start">
              {activeProduct.relatedProducts.badges.map((badge) => (
                <div key={badge} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            <SocialLinks
              className="flex flex-wrap items-center justify-center gap-3 text-white/78"
              itemClassName="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/72 transition-colors hover:border-[#22c55e]/55 hover:text-[#22c55e]"
              iconClassName="h-[17px] w-[17px]"
            />

            <p className="text-[10px] uppercase tracking-[0.34em] text-white/62">Secure checkout</p>
          </div>
        </div>

        <div
          data-motion="up"
          className="pointer-events-auto absolute bottom-[2.7rem] left-1/2 z-20 flex w-[calc(100%-4rem)] max-w-[31.5rem] -translate-x-1/2 flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center"
        >
          <SectionCartCta
            sectionLabel="Footer section"
            className="w-full sm:min-w-[12.75rem] sm:flex-1"
          />
          <button
            onClick={onUploadPreviewClick}
            className="inline-flex min-h-[3.55rem] w-full items-center justify-center rounded-full bg-white px-6 py-3 text-[0.74rem] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-[#22c55e] hover:text-white sm:min-w-[16rem] sm:flex-1"
          >
            Upload Your Space
          </button>
        </div>

        <p className="absolute bottom-4 left-5 z-20 text-xs font-medium tracking-[0.08em] text-white/24">ZA</p>
        <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.18em] text-white/18">
          © 2026 Brick Tile Shop. Finish-led spaces.
        </p>
      </div>
    </section>
  );
}
