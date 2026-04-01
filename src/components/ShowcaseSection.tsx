import React from 'react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { ShoppingCart, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';

export function ShowcaseSection() {
  const { activeCategory, selectedCatalogItem } = useVisualLab();
  const categoryData = productData[activeCategory];
  
  // Use selected item if available, otherwise fallback to category default
  const item = selectedCatalogItem || categoryData.catalog[0];

  return (
    <section id="showcase" className="relative w-full min-h-screen bg-[#050505] py-24 px-4 md:px-8 flex items-center justify-center overflow-hidden">
      {/* Container with rounded corners and subtle background */}
      <div className="w-full max-w-[1400px] mx-auto bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 md:p-12 relative overflow-hidden">
        
        {/* Background texture (optional, subtle) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', filter: 'blur(40px)' }}></div>

        {/* Top Header */}
        <div className="relative z-10 text-center mb-16 md:mb-24">
          <p className="text-[#22c55e] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4">SIGNATURE SHOWCASE</p>
          <h2 className="text-5xl md:text-7xl font-['Anton'] text-white uppercase tracking-tighter leading-[0.9] mb-6">
            INSTALLED,<br />IN CONTEXT.
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            A real {item.name} installation view paired with the live tile stage, so the product proof and the material read stay aligned to the same finish.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
          
          {/* Left Card: Price & Details */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 relative group">
              <div className="aspect-square w-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                
                {/* Price Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
                  <p className="text-[10px] text-white/50 tracking-widest uppercase mb-1">SELLING PRICE</p>
                  <p className="text-4xl md:text-5xl font-bold text-[#22c55e] mb-2">R {item.price}</p>
                  <p className="text-[10px] text-white/50 tracking-widest uppercase">INCL VAT • 1 SQ/M BOX • 52 TILES</p>
                </div>
              </div>
            </div>
            
            <div className="px-2">
              <p className="text-sm text-white/60 mb-6 line-clamp-2">{item.description}</p>
              
              <div className="mb-6">
                <p className="text-[10px] text-white/40 tracking-widest uppercase mb-2">DESIGN EFFECT</p>
                <p className="text-sm text-white/80">Best used in disciplined runs with matching mortar for a monolithic read.</p>
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                  <ArrowUp size={14} />
                </div>
                BACK TO TOP
              </button>
            </div>
          </div>

          {/* Center: Pedestal & 3D Tile Space */}
          <div className="relative h-[400px] flex flex-col items-center justify-end pb-12">
            {/* The 3D tile from ProductScene will float here */}
            
            {/* CSS Pedestal */}
            <div className="relative w-[280px] md:w-[380px] h-[80px] mx-auto mt-auto">
              <div className="absolute bottom-0 left-0 w-full h-[50px] bg-[#050505] rounded-[50%] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"></div>
              <div className="absolute top-[25px] left-0 w-full h-[30px] bg-gradient-to-b from-[#1a1a1a] to-[#050505]"></div>
              <div className="absolute top-0 left-0 w-full h-[50px] bg-[#2a2a35] rounded-[50%] border-[3px] border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.3)_inset,0_0_20px_rgba(255,255,255,0.3)] z-10 flex items-center justify-center">
                <div className="w-[85%] h-[75%] bg-[#1f1f28] rounded-[50%]"></div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-[#0a0a0a] border border-white/20 rounded-full hover:bg-white hover:text-black transition-all group z-20">
              <ShoppingCart size={16} className="text-white/60 group-hover:text-black" />
              <span className="text-xs font-bold tracking-widest uppercase whitespace-nowrap">ADD TO CART</span>
            </button>
          </div>

          {/* Right Card: Installation Match */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/10">
              <div className="aspect-[4/3] w-full relative">
                <img src={categoryData.showcase.image} alt="Installation" className="w-full h-full object-cover" />
                
                {/* Image Counter Overlay */}
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 flex flex-col items-center">
                  <span className="text-[8px] text-white/50 tracking-widest mb-1">01 / 06</span>
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">{item.name}</span>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-[#22c55e] text-[10px] font-bold tracking-widest uppercase mb-2">ASSET TRUTH</p>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">Confirmed Install Match</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Supported by the confirmed local {item.name} installation and sample imagery.
                </p>
              </div>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-end gap-6 px-2 mt-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} className="text-white/60" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronRight size={16} className="text-white/60" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
