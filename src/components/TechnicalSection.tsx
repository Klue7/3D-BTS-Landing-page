import React, { useState, useEffect, useRef, useMemo } from 'react';
import { productData } from '../data/mockData';
import { useVisualLab } from './VisualLabContext';
import { Download, Calculator, ArrowRight, X, Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { calculateProjectEstimation, ESTIMATION_DISCLAIMER } from '../utils/calculator';

gsap.registerPlugin(ScrollTrigger);

export function TechnicalSection() {
  const { activeCategory, isEstimating, setIsEstimating } = useVisualLab();
  const categoryData = productData[activeCategory];
  
  // Estimation State
  const [dims, setDims] = useState({
    width: 4,
    height: 2.5,
    unit: 'm' as 'm' | 'mm',
    wastage: 10
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Calculation Logic (Memoized for performance)
  const results = useMemo(() => {
    return calculateProjectEstimation(dims);
  }, [dims]);

  const mainTl = useRef<gsap.core.Timeline | null>(null);
  const pulseTl = useRef<gsap.core.Timeline | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentPlaneRef = useRef<HTMLDivElement>(null);

  // Idle Pulse Animation
  useEffect(() => {
    if (!triggerRef.current) return;
    
    pulseTl.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(triggerRef.current, {
        scale: 1.08,
        duration: 2.5,
        ease: "sine.inOut"
      })
      .to(triggerRef.current.querySelector('.pulse-ring'), {
        opacity: 0.4,
        scale: 1.4,
        duration: 2.5,
        ease: "sine.inOut"
      }, 0);

    return () => { pulseTl.current?.kill(); };
  }, []);

  // Master Transition Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (mainTl.current) mainTl.current.kill();
    mainTl.current = gsap.timeline();

    if (isEstimating) {
      // Forward Flow: To Estimation (Rightward Drift)
      mainTl.current
        .to(pulseTl.current, { timeScale: 0, duration: 0.4 }) // Pause pulse
        .to(bgRef.current, { xPercent: isMobile ? 0 : -15, opacity: 0.08, ease: "expo.inOut", duration: 1.8 }, 0)
        .to(contentPlaneRef.current, { xPercent: isMobile ? 0 : -35, opacity: 0, ease: "expo.inOut", duration: 1.6 }, 0)
        .to(triggerRef.current, { x: 150, opacity: 0, ease: "expo.in", duration: 0.8 }, 0)
        .fromTo(calculatorRef.current, 
          { x: isMobile ? 0 : 250, y: isMobile ? 100 : -50, opacity: 0 },
          { x: 0, y: isMobile ? 0 : -50, opacity: 1, ease: "expo.out", duration: 1.8, pointerEvents: 'auto' }, 
          0.2
        )
        .from(".est-stagger", { 
          y: 40, 
          opacity: 0, 
          stagger: 0.1, 
          duration: 1.4, 
          ease: "expo.out",
          clearProps: "all"
        }, 0.6);
    } else {
      // Backward Flow: To Specs (Leftward Glide)
      mainTl.current
        .to(calculatorRef.current, { x: isMobile ? 0 : 150, y: isMobile ? 100 : -50, opacity: 0, duration: 1, ease: "expo.in", pointerEvents: 'none' })
        .to(bgRef.current, { xPercent: 0, opacity: 0.2, ease: "expo.out", duration: 1.4 }, 0.2)
        .to(contentPlaneRef.current, { xPercent: 0, opacity: 1, ease: "expo.out", duration: 1.4 }, 0.2)
        .to(triggerRef.current, { x: 0, opacity: 1, ease: "expo.out", duration: 1.2 }, 0.4)
        .to(pulseTl.current, { timeScale: 1, duration: 0.8 }, 1);
    }

    // Master Transition Bridge
    const bridgeTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        // Fade out content over 70% of the bridge to prevent dead zone
        const progress = Math.min(1, self.progress * 1.4);
        if (contentPlaneRef.current) {
          gsap.set(contentPlaneRef.current, { 
            opacity: 1 - progress, 
            y: -50 * progress,
            pointerEvents: progress > 0.5 ? 'none' : 'auto'
          });
        }
        if (bgRef.current) {
          gsap.set(bgRef.current, { opacity: 0.2 * (1 - progress) });
        }
        if (triggerRef.current) {
          gsap.set(triggerRef.current, { opacity: 1 - progress });
        }
      }
    });

    return () => { 
      mainTl.current?.kill(); 
      bridgeTrigger.kill();
    };
  }, [isEstimating]);

  return (
    <section id="technical-spotlight" ref={sectionRef} className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Top Left Label */}
      <div className="absolute top-12 left-12 z-20 hidden md:block">
        <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 flex items-center gap-4">
          <div className="w-8 h-px bg-white/10"></div>
          {isEstimating ? 'PROJECT ESTIMATION' : 'MATERIAL ANALYSIS'}
        </div>
      </div>

      {/* Radar Grid Background (Layer 1) */}
      <div ref={bgRef} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[300px] h-[300px] md:w-[700px] md:h-[700px] rounded-full border border-white/10 relative">
          <div className="absolute inset-0 border border-white/5 rounded-full scale-75"></div>
          <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 -translate-x-1/2"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Mode 1: Technical Callouts (Layer 2) */}
      <div ref={contentPlaneRef} className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
        <div className="w-full max-w-7xl relative h-full">
          {categoryData.technical.specs.map((spec, idx) => {
            const isLeft = spec.position.x < 0;
            const isTop = spec.position.y > 0;
            return (
              <div 
                key={idx} 
                className={`spec-label absolute flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}
                style={{
                  left: isLeft ? (window.innerWidth < 768 ? '10%' : '12%') : 'auto',
                  right: !isLeft ? (window.innerWidth < 768 ? '10%' : '12%') : 'auto',
                  top: isTop ? (window.innerWidth < 768 ? '20%' : '28%') : 'auto',
                  bottom: !isTop ? (window.innerWidth < 768 ? '20%' : '28%') : 'auto',
                }}
              >
                <div className="text-[8px] md:text-[10px] text-white/40 tracking-[0.4em] uppercase mb-1 md:mb-3 flex items-center gap-3">
                  {isLeft && <div className="w-6 md:w-10 h-px bg-white/20"></div>}
                  {spec.label}
                  {!isLeft && <div className="w-6 md:w-10 h-px bg-white/20"></div>}
                </div>
                <div className={`text-2xl md:text-4xl font-serif font-bold text-white border-white/20 pb-2 ${isLeft ? 'border-r-2 pr-4 md:pr-6' : 'border-l-2 pl-4 md:pl-6'}`}>
                  {spec.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode 2: Calculator Panel (Layer 3) */}
      <div 
        ref={calculatorRef} 
        className="absolute bottom-0 md:bottom-auto md:right-[10%] md:top-1/2 md:-translate-y-1/2 w-full md:max-w-xl z-40 opacity-0 pointer-events-none"
      >
        <div className="p-8 md:p-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent md:from-transparent md:to-transparent pt-20 md:pt-0">
          {/* Back Button */}
          <button 
            onClick={() => setIsEstimating(false)}
            className="est-stagger group flex items-center gap-4 mb-8 md:mb-12 text-white/40 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowRight size={16} className="rotate-180" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Back to Material Specs</span>
          </button>

          <div className="space-y-12 md:space-y-16">
            {/* Large Input Section */}
            <div className="est-stagger space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight uppercase leading-none">Estimation</h3>
                <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                  {['m', 'mm'].map((u) => (
                    <button
                      key={u}
                      onClick={() => setDims({...dims, unit: u as any})}
                      className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${dims.unit === u ? 'bg-[#22c55e] text-black' : 'text-white/40 hover:text-white'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Surface Width</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={dims.width}
                      onChange={(e) => setDims({...dims, width: Number(e.target.value)})}
                      className="w-full bg-transparent text-5xl md:text-8xl font-serif font-bold text-white focus:outline-none border-b border-white/10 pb-2 md:pb-4 focus:border-[#22c55e] transition-colors"
                    />
                    <span className="absolute right-0 bottom-4 md:bottom-6 text-white/20 font-mono text-lg md:text-xl uppercase">{dims.unit}</span>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Surface Height</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={dims.height}
                      onChange={(e) => setDims({...dims, height: Number(e.target.value)})}
                      className="w-full bg-transparent text-5xl md:text-8xl font-serif font-bold text-white focus:outline-none border-b border-white/10 pb-2 md:pb-4 focus:border-[#22c55e] transition-colors"
                    />
                    <span className="absolute right-0 bottom-4 md:bottom-6 text-white/20 font-mono text-lg md:text-xl uppercase">{dims.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="est-stagger grid grid-cols-2 gap-8 border-t border-white/5 pt-8 md:pt-12">
              <div className="space-y-2">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Total Area</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-white">{results.formattedArea} <span className="text-xs md:text-sm text-white/20">m²</span></p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Tile Count</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-white">{results.formattedQuantity} <span className="text-xs md:text-sm text-[#22c55e]">+{dims.wastage}%</span></p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="est-stagger space-y-6 md:space-y-8">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mb-1 md:mb-2">Estimated Investment</p>
                <p className="text-4xl md:text-7xl font-serif font-bold text-[#22c55e] tracking-tighter">{results.formattedInvestment}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button className="flex-1 py-5 md:py-6 bg-[#22c55e] text-black rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn shadow-2xl shadow-[#22c55e]/20">
                  Generate Quote
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Trigger (Responsive) */}
      <div 
        ref={triggerRef}
        className="absolute bottom-12 md:bottom-auto md:right-12 md:top-1/2 md:-translate-y-1/2 z-30 w-full md:w-auto px-6 md:px-0"
      >
        {!isEstimating && (
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsEstimating(true)}
              className="group relative w-full md:w-auto flex flex-row md:flex-col items-center justify-center gap-4 bg-[#22c55e] md:bg-white/5 text-black md:text-[#22c55e] py-4 md:py-0 md:px-0 rounded-full md:rounded-none shadow-2xl md:shadow-none transition-all duration-500"
            >
              {/* Pulse Ring */}
              <div className="pulse-ring absolute inset-0 rounded-full border-2 border-[#22c55e] opacity-0 pointer-events-none hidden md:block"></div>
              
              <div className="w-6 h-6 md:w-16 md:h-16 md:rounded-full md:border md:border-white/10 flex items-center justify-center md:group-hover:bg-[#22c55e] md:group-hover:text-black transition-all duration-500">
                <Calculator size={window.innerWidth < 768 ? 20 : 24} />
              </div>
              <span className="text-[10px] md:text-[9px] font-bold tracking-[0.4em] uppercase text-black md:text-white/40 md:group-hover:text-white transition-colors md:vertical-text">
                Calculate Coverage
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Download CTA (Desktop Only) */}
      {!isEstimating && (
        <div className="absolute bottom-12 left-12 z-30 hidden md:block">
          <button 
            onClick={() => alert('Spec sheet download started.')}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.4em] uppercase text-white hover:bg-white/10 transition-all flex items-center gap-4 group"
          >
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
            Download Spec Sheet
          </button>
        </div>
      )}
    </section>
  );
}
