import React from 'react';
import { motion } from 'motion/react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { ShoppingCart } from 'lucide-react';

export function RedRegisterSection() {
  const { activeCategory, selectedCatalogItem, setIsQuoteWizardOpen } = useVisualLab();
  const categoryData = productData[activeCategory];
  
  const itemName = selectedCatalogItem ? selectedCatalogItem.name : "Kalahari";
  const accentColor = activeCategory === 'cladding-tiles' ? '#22c55e' : '#eab308';

  return (
    <section id="red-register" className="relative w-full min-h-screen bg-[#0a0a0a] flex items-center py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content (3D Object space) */}
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center order-2 md:order-1">
          {/* The 3D object will be positioned here via ProductScene */}
          <div className="absolute bottom-0 left-0 md:left-24 z-20">
            <button 
              onClick={() => setIsQuoteWizardOpen(true)}
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white/5 transition-all flex items-center gap-3 group"
            >
              <ShoppingCart size={14} className="group-hover:scale-110 transition-transform" />
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center z-20 order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/60">RED-CLAY FIELD</span>
                </div>
              </div>
              
              <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#22c55e]">
                MODULED FOR WARMER INTERIORS
              </div>

              <h2 className="text-6xl md:text-8xl font-['Anton'] text-white uppercase tracking-tighter leading-[0.85]">
                RED<br/>
                <span className="text-white">REGISTER</span>
              </h2>

              <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md pt-4">
                {itemName} brings more warmth into the wall, but the longer module and tighter height still keep the finish architectural rather than decorative.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <div className="text-3xl md:text-5xl font-bold text-white">223mm</div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-white/30">MODULE LENGTH</div>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-[180px]">
                  A slightly longer module that helps the richer red tone read as a calmer horizontal field.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-5xl font-bold text-white">73mm</div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-white/30">FACE HEIGHT</div>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-[180px]">
                  Keeps the course compact so the stronger clay warmth does not overpower the room.
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm italic text-white/30 pt-8 border-t border-white/5">
              Best used where a warmer red-clay wall should feel grounded, relaxed, and more interior-led.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
