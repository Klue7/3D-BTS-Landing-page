import React from 'react';
import { productData } from '../data/mockData';
import { useVisualLab } from './VisualLabContext';

export function MaterialStorySection() {
  const { activeCategory, selectedCatalogItem } = useVisualLab();
  const categoryData = productData[activeCategory];
  const { materialStory } = categoryData;

  const title = selectedCatalogItem ? selectedCatalogItem.name : materialStory.title;
  const subtitle = selectedCatalogItem ? "AUTHENTIC TEXTURE" : materialStory.subtitle;

  return (
    <section id="material-story" className="relative w-full min-h-screen bg-[#0a0a0a] flex items-start md:items-center pt-32 md:pt-0 pb-24 md:py-24">
      <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Content */}
        <div className="flex flex-col justify-center z-20">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${activeCategory === 'cladding-tiles' ? 'bg-[#22c55e]' : 'bg-[#eab308]'}`}></div>
            <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase ${activeCategory === 'cladding-tiles' ? 'text-[#22c55e]' : 'text-[#eab308]'}`}>PERFORMANCE METRICS</span>
          </div>
          
          <h2 className="text-5xl md:text-8xl font-['Anton'] text-white uppercase tracking-tighter leading-[0.85] mb-12 md:mb-16">
            {title}<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>{subtitle}</span>
          </h2>

          <div className="space-y-8 md:space-y-12 max-w-md">
            {materialStory.metrics.map((metric, idx) => (
              <div key={idx} className="border-l border-white/10 pl-4 md:pl-6">
                <div className="flex items-baseline gap-1 mb-1 md:mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-white">{metric.value.replace(/[^0-9.]/g, '')}</span>
                  <span className="text-xs md:text-sm text-white/50">{metric.value.replace(/[0-9.]/g, '')}</span>
                </div>
                <h3 className="text-[10px] md:text-xs font-bold text-white/70 tracking-widest uppercase mb-2 md:mb-3">{metric.label}</h3>
                <p className="text-xs md:text-sm text-white/40 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content (3D Object space) */}
        <div className="hidden md:block relative">
          {/* The 3D object will float here via GSAP */}
        </div>
      </div>
    </section>
  );
}
