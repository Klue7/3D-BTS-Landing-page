import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavigationBar } from './NavigationBar';
import type { EntryCategoryDeck } from '../data/mockData';

interface BrandIntroSectionProps {
  pathname: string;
  navigate: (path: string) => void;
  activeCategory: EntryCategoryDeck;
  onPreviousCategory: () => void;
  onNextCategory: () => void;
  onSelectCategory: (categoryId: EntryCategoryDeck['id']) => void;
  categories: EntryCategoryDeck[];
}

export function BrandIntroSection({
  pathname,
  navigate,
  activeCategory,
  onPreviousCategory,
  onNextCategory,
  onSelectCategory,
  categories,
}: BrandIntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const statusLabel = activeCategory.id === 'cladding' ? 'Brick Tile Shop Tile' : 'Brick Tile Shop Brick';
  const statusMeta =
    activeCategory.id === 'cladding' ? 'Interactive branded gateway tile' : 'Interactive branded gateway brick';

  useEffect(() => {
    if (!sectionRef.current) return;

    const context = gsap.context(() => {
      const haloTween = gsap.to(haloRef.current, {
        scale: 1.08,
        opacity: 0.9,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const innerRingTween = gsap.to(innerRingRef.current, {
        scale: 1.03,
        opacity: 0.42,
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const outerRingTween = gsap.to(outerRingRef.current, {
        scale: 1.05,
        opacity: 0.18,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const beamTween = gsap.to(beamRef.current, {
        opacity: 0.24,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      return () => {
        haloTween.kill();
        innerRingTween.kill();
        outerRingTween.kill();
        beamTween.kill();
      };
    }, sectionRef);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brand-intro"
      data-section="intro"
      className="slide-shell pointer-events-none"
    >
      <div className="slide-frame overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.018),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))]" />
        <NavigationBar pathname={pathname} navigate={navigate} placement="hero" />

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative h-[min(80vh,780px)] w-[min(84vw,1080px)]">
            <div
              ref={beamRef}
              className="absolute left-1/2 top-[52%] h-[74%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/16 to-transparent"
            />

            <div
              className="absolute left-1/2 top-[52%] h-[1px] w-[62%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            <div
              ref={outerRingRef}
              className="absolute left-1/2 top-[52%] h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6"
              style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
            />

            <div
              ref={innerRingRef}
              className="absolute left-1/2 top-[52%] h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#22c55e]/18"
              style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
            />

            <div
              ref={haloRef}
              className="absolute left-1/2 top-[52%] h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),rgba(34,197,94,0.05)_42%,transparent_72%)] blur-3xl"
            />

            <div className="pointer-events-none absolute inset-x-0 top-[15%] z-20 mx-auto flex max-w-[22rem] flex-col items-center text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e] md:text-xs">
                Brick Tile Shop
              </p>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-[68%] z-20 mx-auto flex max-w-[22rem] flex-col items-center text-center">
              <div className="rounded-full border border-white/12 bg-black/44 px-4 py-2 backdrop-blur-md">
                <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/82 md:text-[11px]">
                  {statusLabel}
                </span>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/28">
                {statusMeta}
              </p>
            </div>

            <div className="pointer-events-auto absolute left-1/2 top-[74%] z-20 flex w-[min(88vw,760px)] -translate-x-1/2 flex-col gap-4">
              <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/32 px-3 py-3 backdrop-blur-md">
                <button
                  type="button"
                  onClick={onPreviousCategory}
                  aria-label="Show previous material category"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2">
                  {categories.map((category) => {
                    const isActive = category.id === activeCategory.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelectCategory(category.id)}
                        className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] transition-all md:px-5 ${
                          isActive
                            ? 'border-[#22c55e]/55 bg-[#22c55e]/12 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/56 hover:border-white/18 hover:text-white/82'
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={onNextCategory}
                  aria-label="Show next material category"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/34">
                Scroll to browse the {activeCategory.label.toLowerCase()} selection board
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
