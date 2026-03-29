import React from 'react';
import { motion } from 'motion/react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductJourneySection() {
  const { activeCategory, selectedCatalogItem, setSelectedCatalogItem, setIsQuoteWizardOpen } = useVisualLab();
  
  // Fallback to first item if none selected
  const items = (productData as any)[activeCategory].catalog;
  const currentItem = selectedCatalogItem || items[0];
  
  const accentColor = activeCategory === 'cladding-tiles' ? '#22c55e' : '#eab308';

  const handleNext = () => {
    const currentIndex = items.findIndex((i: any) => i.id === currentItem.id);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedCatalogItem(items[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = items.findIndex((i: any) => i.id === currentItem.id);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setSelectedCatalogItem(items[prevIndex]);
  };

  return (
    <section id="product-journey" className="relative w-full min-h-screen bg-[#050505] flex items-center overflow-hidden py-24">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000" 
          alt="Brick texture"
          className="w-full h-full object-cover grayscale blur-md"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Background Large Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] whitespace-nowrap">
        <h2 className="text-[25vw] font-bold uppercase leading-none tracking-tighter">
          {currentItem.name}
        </h2>
      </div>

      <div className="container mx-auto px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl relative z-20">
            <motion.div 
              key={`${currentItem.id}-header`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#22c55e]">
                  BRICK TILE SHOP SIGNATURE FINISH
                </span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-light text-white tracking-tight leading-none">
                {currentItem.name}
              </h2>
              
              <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/40">
                THIN BRICK TILES
              </div>

              <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-md">
                {currentItem.description}
              </p>

              <div className="space-y-2 pt-8">
                <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/30">
                  SELLING PRICE
                </div>
                <div className="text-4xl md:text-6xl font-bold text-[#22c55e]">
                  {currentItem.price}
                </div>
                <div className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-white/40">
                  {currentItem.specs.boxDetail}
                </div>
                <div className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-white/40">
                  FORMAT {currentItem.specs.module.replace(/x/g, '•')}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content (Empty space for centered 3D object) */}
          <div className="hidden md:block h-[400px] md:h-[600px]"></div>
        </div>

        {/* Centered Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 pt-16 relative z-20"
        >
          <button 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-12 py-5 bg-[#22c55e] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:bg-[#16a34a] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            VIEW PRODUCTS
          </button>
          <button 
            onClick={() => setIsQuoteWizardOpen(true)}
            className="text-white/40 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <ShoppingCart size={14} />
            ADD TO CART
          </button>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-12 right-6 md:right-16 flex items-center gap-8">
          <div className="flex flex-col items-end">
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-1">
              0{items.findIndex((i: any) => i.id === currentItem.id) + 1} / 0{items.length}
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-white">
              {currentItem.name}
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2 mr-4">
              {items.map((item: any, idx: number) => (
                <div 
                  key={item.id}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${item.id === currentItem.id ? 'bg-[#22c55e] scale-125' : 'bg-white/10'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
