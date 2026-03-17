import React from 'react';
import { productData } from '../data/mockData';

export function TechnicalSection() {
  return (
    <section id="technical-spotlight" className="relative w-full h-screen bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Crosshair / Radar UI Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full border border-white/20 relative">
          <div className="absolute inset-0 border border-white/10 rounded-full scale-75"></div>
          <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20 -translate-x-1/2"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20 -translate-y-1/2"></div>
          
          {/* Tick marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div key={deg} className="absolute top-0 left-1/2 w-px h-2 md:h-4 bg-[#22c55e] origin-bottom md:hidden" style={{ transform: `translateX(-50%) rotate(${deg}deg) translateY(-150px)` }}></div>
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div key={`md-${deg}`} className="hidden md:block absolute top-0 left-1/2 w-px h-4 bg-[#22c55e] origin-bottom" style={{ transform: `translateX(-50%) rotate(${deg}deg) translateY(-300px)` }}></div>
          ))}
        </div>
      </div>

      {/* Spec Callouts */}
      <div className="relative w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-between md:justify-center z-20 pointer-events-none py-24 md:py-0 px-6 md:px-0">
        {/* Top Specs (Mobile) */}
        <div className="flex flex-col w-full md:hidden gap-6">
          {productData.technical.specs.slice(0, 2).map((spec, idx) => (
            <div key={idx} className="flex flex-col items-center text-center w-full">
              <div className="text-[10px] text-white/50 tracking-widest uppercase mb-1">{spec.label}</div>
              <div className="text-xl font-bold text-white border-b-2 border-white/20 pb-1 px-4">{spec.value}</div>
            </div>
          ))}
        </div>

        {/* Desktop Specs */}
        <div className="hidden md:block w-full h-full">
          {productData.technical.specs.map((spec, idx) => {
            const isLeft = spec.position.x < 0;
            const isTop = spec.position.y > 0;
            
            return (
              <div 
                key={idx} 
                className={`absolute flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}
                style={{
                  left: isLeft ? '15%' : 'auto',
                  right: !isLeft ? '15%' : 'auto',
                  top: isTop ? '30%' : 'auto',
                  bottom: !isTop ? '30%' : 'auto',
                }}
              >
                <div className="text-xs text-white/50 tracking-widest uppercase mb-2 flex items-center gap-2">
                  {isLeft && <div className="w-8 h-px bg-white/20"></div>}
                  {spec.label}
                  {!isLeft && <div className="w-8 h-px bg-white/20"></div>}
                </div>
                <div className={`text-2xl font-bold text-white border-white/20 pb-1 ${isLeft ? 'border-r-2 pr-4' : 'border-l-2 pl-4'}`}>
                  {spec.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Specs (Mobile) */}
        <div className="flex flex-col w-full md:hidden gap-6 mt-auto">
          {productData.technical.specs.slice(2, 4).map((spec, idx) => (
            <div key={idx} className="flex flex-col items-center text-center w-full">
              <div className="text-[10px] text-white/50 tracking-widest uppercase mb-1">{spec.label}</div>
              <div className="text-xl font-bold text-white border-b-2 border-white/20 pb-1 px-4">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
