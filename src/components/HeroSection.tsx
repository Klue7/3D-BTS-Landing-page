import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useVisualLab } from './VisualLabContext';

export function HeroSection() {
  const { activeCategory, setActiveCategory } = useVisualLab();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const sectionIndex = Math.round(scrollLeft / clientWidth);
    
    if (sectionIndex === 0 && activeCategory !== 'cladding-tiles') {
      setActiveCategory('cladding-tiles');
    } else if (sectionIndex === 1 && activeCategory !== 'bricks') {
      setActiveCategory('bricks');
    } else if (sectionIndex === 2 && activeCategory !== 'paving') {
      setActiveCategory('paving');
    }
  };

  const scrollToSection = (index: number) => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    scrollContainerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth'
    });
  };

  // Sync scroll position if category changes externally
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const targetScrollLeft = activeCategory === 'cladding-tiles' ? 0 : activeCategory === 'bricks' ? clientWidth : clientWidth * 2;
    
    // Only scroll if we're not already there (to prevent fighting with manual scroll)
    if (Math.abs(scrollContainerRef.current.scrollLeft - targetScrollLeft) > 10) {
      scrollContainerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1516533075015-a3838414c3ca?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(120%)'
        }}
      />

      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-colors duration-1000 pointer-events-none">
        <div className={`w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[150px] transition-colors duration-1000 ${
          activeCategory === 'cladding-tiles' ? 'bg-[#22c55e]' : 
          activeCategory === 'bricks' ? 'bg-[#eab308]' : 
          'bg-[#94a3b8]'
        }`}></div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Section 1: Cladding Tiles */}
        <div className="w-screen h-screen shrink-0 snap-center flex flex-col items-center justify-center relative">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-20">
            <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#22c55e]">
              BRICK TILE SHOP
            </h2>
          </div>
          <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-20">
            <div className="px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
              <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                BRICK TILE SHOP TILE
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Bricks */}
        <div className="w-screen h-screen shrink-0 snap-center flex flex-col items-center justify-center relative">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-20">
            <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#eab308]">
              BRICK TILE SHOP
            </h2>
          </div>
          <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-20">
            <div className="px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
              <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                BRICK TILE SHOP BRICK
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Paving */}
        <div className="w-screen h-screen shrink-0 snap-center flex flex-col items-center justify-center relative">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-20">
            <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#94a3b8]">
              BRICK TILE SHOP
            </h2>
          </div>
          <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-20">
            <div className="px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
              <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                BRICK TILE SHOP PAVING
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Controls */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-6 w-full px-4 pointer-events-none">
        {/* Category Toggle */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={() => {
              const currentIndex = activeCategory === 'cladding-tiles' ? 0 : activeCategory === 'bricks' ? 1 : 2;
              scrollToSection(Math.max(0, currentIndex - 1));
            }}
            className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors bg-black/50 backdrop-blur-md hover:border-white hover:text-white text-white/50`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md overflow-hidden p-1">
            <button 
              onClick={() => scrollToSection(0)}
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-colors ${
                activeCategory === 'cladding-tiles' 
                  ? 'bg-transparent text-[#22c55e]' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              CLADDING TILES
            </button>
            <button 
              onClick={() => scrollToSection(1)}
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-colors ${
                activeCategory === 'bricks' 
                  ? 'bg-transparent text-[#eab308]' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              BRICKS
            </button>
            <button 
              onClick={() => scrollToSection(2)}
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-colors ${
                activeCategory === 'paving' 
                  ? 'bg-transparent text-[#94a3b8]' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              PAVING
            </button>
          </div>

          <button 
            onClick={() => {
              const currentIndex = activeCategory === 'cladding-tiles' ? 0 : activeCategory === 'bricks' ? 1 : 2;
              scrollToSection(Math.min(2, currentIndex + 1));
            }}
            className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors bg-black/50 backdrop-blur-md hover:border-white hover:text-white text-white/50`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Scroll Hint */}
        <p className="text-[10px] md:text-xs text-white/40 tracking-widest uppercase mt-2 text-center pointer-events-auto">
          SCROLL TO BROWSE THE {
            activeCategory === 'cladding-tiles' ? 'CLADDING TILES' : 
            activeCategory === 'bricks' ? 'BRICKS' : 
            'PAVING'
          } SELECTION BOARD
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
