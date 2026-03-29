import React, { useRef, useLayoutEffect } from 'react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { Package, Truck, Ruler } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PackagingDeliverySection() {
  const { activeCategory, selectedCatalogItem } = useVisualLab();
  const categoryData = productData[activeCategory];
  
  const itemName = selectedCatalogItem ? selectedCatalogItem.name : "Kalahari";

  const sectionRef = useRef<HTMLDivElement>(null);
  const clipWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyTopRef = useRef<HTMLDivElement>(null);
  const copyBottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop } = context.conditions as any;

        const startX = isDesktop ? -120 : 0;
        const startY = isDesktop ? 20 : 300;
        const startScale = isDesktop ? 0.25 : 0.2;
        const startClip = isDesktop ? "inset(35% 65% 35% 15%)" : "inset(50% 15% 15% 15%)";

        const midX = isDesktop ? -100 : 0;
        const midY = isDesktop ? 10 : 250;
        const midScale = isDesktop ? 0.35 : 0.3;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
          }
        });

        // Initial state
        gsap.set(clipWrapperRef.current, {
          clipPath: startClip
        });

        gsap.set(titleRef.current, {
          xPercent: startX, 
          yPercent: startY,
          scale: startScale, 
          rotationY: -45,
          rotationX: 30,
          rotationZ: -15,
          opacity: 0,
          transformOrigin: "center center"
        });

        gsap.set([copyTopRef.current, copyBottomRef.current], {
          opacity: 0,
          y: 20
        });

        // 1. MASKED TITLE PHASE (Emerging inside the box)
        tl.to(titleRef.current, {
          opacity: 1,
          scale: midScale,
          xPercent: midX,
          yPercent: midY,
          rotationY: -25,
          rotationX: 15,
          rotationZ: -5,
          duration: 1.2,
          ease: "power3.out"
        });

        // Hold briefly inside the box
        tl.to({}, { duration: 0.2 });

        // 2. RELEASE PHASE (Breaking out)
        tl.to(clipWrapperRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut"
        }, "release");

        tl.to(titleRef.current, {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          rotationZ: 0,
          duration: 1.2,
          ease: "power4.inOut"
        }, "release");

        // Copy fades in
        tl.to(copyTopRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "release+=0.2");

        tl.fromTo(".pkg-stagger", 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out" },
          "release+=0.4"
        );

      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="packaging-delivery" ref={sectionRef} className="relative w-full h-screen bg-[#050505] flex items-center overflow-hidden">
      
      {/* Animated Title - Single Masked Container */}
      <div 
        ref={clipWrapperRef}
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" 
        style={{ perspective: '1000px' }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center h-full pt-24 pb-12">
          <div className="w-full md:w-[40%] h-[400px] md:h-full order-2 md:order-1"></div>
          <div className="w-full md:w-[60%] flex flex-col justify-center h-full md:pl-12 order-1 md:order-2">
            <div className="space-y-8 w-full">
              {/* Invisible top copy to maintain spacing */}
              <div className="space-y-4 opacity-0">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 w-fit">
                    <Package size={12} />
                    <span className="text-[9px] font-bold tracking-widest uppercase">PACKAGING & DELIVERY</span>
                  </div>
                </div>
                <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                  SECURE & EFFICIENT
                </div>
              </div>

              {/* The actual animated title */}
              <h2 
                ref={titleRef} 
                className="text-6xl md:text-8xl font-['Anton'] text-white uppercase tracking-tighter leading-[0.85]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                BOXED<br/>
                <span className="text-white">& READY</span>
              </h2>

              {/* Invisible bottom copy to maintain spacing */}
              <div className="space-y-8 opacity-0">
                <p className="text-sm md:text-base leading-relaxed max-w-md pt-4">
                  Our {itemName} tiles are carefully packed to ensure they arrive in perfect condition. We've optimized our packaging for both protection and ease of handling on-site.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-3 bg-white/5 p-6 rounded-xl border border-white/10">
                    <Ruler className="w-6 h-6" />
                    <div className="text-3xl md:text-4xl font-bold">50</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase">TILES PER SQM</div>
                    <p className="text-[11px] leading-relaxed">
                      Calculated with a standard 10mm mortar joint for optimal coverage and aesthetic appeal.
                    </p>
                  </div>
                  
                  <div className="space-y-3 bg-white/5 p-6 rounded-xl border border-white/10">
                    <Package className="w-6 h-6" />
                    <div className="text-3xl md:text-4xl font-bold">36</div>
                    <div className="text-[9px] font-bold tracking-widest uppercase">TILES PER BOX</div>
                    <p className="text-[11px] leading-relaxed">
                      Each box covers approximately 0.72 square meters. Easy to carry and stack.
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6 flex items-start gap-4">
                  <Truck className="w-8 h-8 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold tracking-wide uppercase text-sm mb-2">Direct to Doorstep</h3>
                    <p className="text-xs leading-relaxed">
                      We partner with specialized couriers to deliver your tiles directly to your doorstep. Fully tracked and insured from our warehouse to your project site.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Normal Content */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center h-full z-30 relative pt-24 pb-12">
        {/* Left Content (3D Object space) - 40% */}
        <div className="w-full md:w-[40%] h-[400px] md:h-full relative flex items-center justify-center pointer-events-none order-2 md:order-1">
          {/* 3D object is rendered by ProductScene in a fixed canvas behind this section */}
        </div>

        {/* Right Content - 60% */}
        <div className="w-full md:w-[60%] flex flex-col justify-center h-full md:pl-12 order-1 md:order-2">
          <div className="space-y-8">
            <div className="space-y-4" ref={copyTopRef}>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2 w-fit">
                  <Package size={12} className="text-[#22c55e]" />
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/60">PACKAGING & DELIVERY</span>
                </div>
              </div>
              <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#22c55e]">
                SECURE & EFFICIENT
              </div>
            </div>

            {/* Invisible placeholder to maintain layout space for the absolute titles */}
            <h2 className="text-6xl md:text-8xl font-['Anton'] text-transparent uppercase tracking-tighter leading-[0.85] select-none pointer-events-none">
              BOXED<br/>
              <span>& READY</span>
            </h2>

            <div ref={copyBottomRef} className="space-y-8">
              <p className="pkg-stagger text-sm md:text-base text-white/50 leading-relaxed max-w-md pt-4">
                Our {itemName} tiles are carefully packed to ensure they arrive in perfect condition. We've optimized our packaging for both protection and ease of handling on-site.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="pkg-stagger space-y-3 bg-white/5 p-6 rounded-xl border border-white/10">
                  <Ruler className="text-[#22c55e] w-6 h-6" />
                  <div className="text-3xl md:text-4xl font-bold text-white">50</div>
                  <div className="text-[9px] font-bold tracking-widest uppercase text-white/30">TILES PER SQM</div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Calculated with a standard 10mm mortar joint for optimal coverage and aesthetic appeal.
                  </p>
                </div>
                
                <div className="pkg-stagger space-y-3 bg-white/5 p-6 rounded-xl border border-white/10">
                  <Package className="text-[#22c55e] w-6 h-6" />
                  <div className="text-3xl md:text-4xl font-bold text-white">36</div>
                  <div className="text-[9px] font-bold tracking-widest uppercase text-white/30">TILES PER BOX</div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Each box covers approximately 0.72 square meters. Easy to carry and stack.
                  </p>
                </div>
              </div>

              <div className="pkg-stagger bg-white/5 p-6 rounded-xl border border-white/10 mt-6 flex items-start gap-4">
                <Truck className="text-[#22c55e] w-8 h-8 shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Direct to Doorstep</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    We partner with specialized couriers to deliver your tiles directly to your doorstep. Fully tracked and insured from our warehouse to your project site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
