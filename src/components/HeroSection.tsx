import React from 'react';
import { productData } from '../data/mockData';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#5C3A21] rounded-full blur-[120px]"></div>
      </div>

      {/* Oversized Background Word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-8 md:-translate-y-16">
        <h1 className="text-[22vw] md:text-[24vw] font-['Anton'] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/[0.02] uppercase leading-none select-none">
          {productData.productName}
        </h1>
      </div>

      {/* Utility Trigger Top Left */}
      <div className="absolute top-24 md:top-32 left-6 md:left-16 flex items-center gap-4 z-20 group cursor-pointer">
        <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#22c55e] group-hover:bg-[#22c55e]/10 transition-all">
          <Play size={14} className="text-white ml-1 md:w-4 md:h-4 group-hover:text-[#22c55e] transition-colors" />
        </button>
        <span className="text-[10px] md:text-xs text-white/60 uppercase tracking-widest leading-tight group-hover:text-white transition-colors">Promotion<br/>video</span>
      </div>

      {/* Product Meta Bottom Left */}
      <div className="absolute bottom-32 md:bottom-12 left-6 md:left-16 z-20">
        <h2 className="text-3xl md:text-5xl font-bold text-[#b89b82] tracking-tight mb-1 md:mb-2">
          {productData.productName}
        </h2>
        <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-widest flex items-center gap-2">
          CATEGORY: <span className="text-white">{productData.category}</span>
        </p>
      </div>

      {/* Primary CTA Bottom Center (Mobile: Bottom Left below Meta) */}
      <div className="absolute bottom-12 md:bottom-12 left-6 md:left-1/2 md:-translate-x-1/2 z-20 w-[calc(100%-3rem)] md:w-auto">
        <button className="w-full md:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-4 text-xs md:text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          {productData.primaryCta}
        </button>
      </div>

      {/* Circular Controls Bottom Right */}
      <div className="hidden md:flex absolute bottom-12 right-16 gap-4 z-20">
        <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#22c55e] hover:bg-[#22c55e]/10 transition-all group">
          <ChevronLeft size={20} className="text-white group-hover:text-[#22c55e] transition-colors" />
        </button>
        <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-[#22c55e] hover:bg-[#22c55e]/10 transition-all group">
          <ChevronRight size={20} className="text-white group-hover:text-[#22c55e] transition-colors" />
        </button>
      </div>
    </section>
  );
}
